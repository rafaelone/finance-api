import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { TaskFunction, task, series } from 'gulp'
import run from 'gulp-run'
import { Open as UnzipperOpen } from 'unzipper'


const buildTask: TaskFunction = async (cb) => {
    await new Promise((resolve, reject) => {
        run(`yarn sls:build -p dist`).exec((err: any) => {
            if (err) reject(err);
            resolve(true)
        })
    });
    console.log('sls::build')
    cb();

}

const extractZipTask: TaskFunction = async (cb) => {
    const directory = await UnzipperOpen.file('./dist/finance-api.zip');
    await directory.extract({ path: './dist/' });
    run('mv src/functions/* ./apis/', { cwd: "./dist/" }).exec(cb)

    cb();
}

const templateFastifyFunction: string = `
fastify.{{method}}("{{path}}", async (req, reply) => {
    const response = await {{handlerName}}({
        ...req,
        pathParameters: req.params,
        queryStringParameters: req.query
    });


   reply.headers(response.headers).status(response.statusCode).send(response.body);

})
`

const templateFastifyCode: string = `
import Fastify from 'fastify';
{{import_rules}}

const fastify = Fastify({ logger: true });

{{functions_code}}

fastify.listen({ port: 8080 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
`

type DetailFnItem = {
    event_method: string;// "get", 
    event_path: string;// "teste", 
    name: string; // "teste", 
    handler: string;// "src/functions/teste/handler.main"
}

const generatefastify: TaskFunction = async (cb) => {
    const rawDetailFns = readFileSync("detail-functions.json", { encoding: "utf-8" });
    const detailFns = JSON.parse(rawDetailFns) as Array<DetailFnItem>
    // const API_PATH = "./dist/apis/";

    const raw = detailFns.map(fnItem => {
        const import_path = fnItem.handler.replace("src/functions/", "./").replace(/\.main$/, ".js")

        return {
            body: templateFastifyFunction
                .replace("{{method}}", fnItem.event_method)
                .replace("{{path}}", fnItem.event_path)
                .replace("{{handlerName}}", fnItem.name + "_main"),

            importStatement: `import {main as ${fnItem.name}_main } from '${import_path}';`
        }
    });

    const import_rules = raw.map(a => a.importStatement).join("\n")
    const functionsBody = raw.map(a => a.body).join("\n\n")

    const fastifyResultCode = templateFastifyCode.replace("{{import_rules}}", import_rules + "\n").replace("{{functions_code}}", functionsBody + "\n")

    try {
        mkdirSync("./dist/apis", { recursive: true })
    } catch (error) { }
    writeFileSync("./dist/apis/index.js", fastifyResultCode, { encoding: "utf8" })

    cb();
}

const cleanUpfastify: TaskFunction = (cb) => {
    run("rm -rf dist/src dist/*.json dist/*.zip").exec(() => {
        run('mv dist/apis/* dist/ && rm -r dist/apis/ && rm detail-functions.json').exec(cb)
    })
}

task("build:sls", buildTask);

task("extract:zip", extractZipTask);

task("generate:fastify", generatefastify)

task("cleanup:fastify", cleanUpfastify)

export const buildDefaults = series(
    "build:sls",
    "extract:zip",
    "generate:fastify",
    "cleanup:fastify"
)
