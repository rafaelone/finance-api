'use strict'

const { writeFileSync, writeFile, mkdir, mkdirSync } = require("fs")

class SaveRestFunctionInFile {



    constructor(serverless, options, utils) {
        this.serverless = serverless
        this.options = options // CLI options
        this.utils = utils;
        // this.getSerializedFunctions = this.getSerializedFunctions.bind(this);
        // this.afterPackage = this.afterPackage.bind(this);

        this.hooks = {
            initialize: () => this.customAfterPackage(),
        }
    }

    customAfterPackage() {


        console.log('AFTER.PACKAGE::MyPLUGIN')
        const serializedFunctions = this.getSerializedFunctions()
        console.log('AFTER.PACKAGE::MyPLUGIN-> ', serializedFunctions)

        writeFileSync("detail-functions.json", JSON.stringify(this.getSerializedFunctions()), {
            encoding: "utf-8",
            flag: "w"
        })
    }

    getSerializedFunctions() {
        const service = this.serverless.service

        const funcoes = service.functions;

        return Object.keys(funcoes).reduce((agg, fn) => {

            let myFn = funcoes[fn];

            agg.push({
                event_method: myFn.events[0].http.method,
                event_path: myFn.events[0].http.path,
                name: fn,
                handler: myFn.handler
            });

            return agg;
        }, [])

    }

    init() {


        this.utils.log('Functions: ', this.getSerializedFunctions())
    }
}


module.exports = SaveRestFunctionInFile