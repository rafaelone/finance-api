Aqui está um README.md otimizado para o projeto **Finance API**:

# Finance API

**Finance API** é uma aplicação backend desenvolvida para gerenciar finanças pessoais. Esta API fornece endpoints para controle de transações financeiras, categorização de despesas e receitas, e cálculo de balanços. O projeto utiliza **Fastify** pela sua alta performance, seguindo práticas de desenvolvimento modernas como validação com **Zod** e autenticação com **JWT**.

## 🚀 Tecnologias Utilizadas

- **Fastify**: Framework web rápido e eficiente para Node.js.
- **TypeScript**: Tipagem estática para maior segurança no desenvolvimento.
- **Zod**: Biblioteca para validação e tipagem de dados.
- **JWT**: Autenticação baseada em tokens JSON Web Token.
- **Prisma**: ORM para interações com o banco de dados.
- **Docker**: Gerenciamento de containers para simplificar o ambiente de desenvolvimento.
- **Jest** e **Supertest**: Para testes automatizados.

## 📂 Funcionalidades

- **Autenticação de usuários**:
  - Registro e login utilizando JWT.
- **Gerenciamento de transações**:
  - Criar, listar, atualizar e excluir receitas e despesas.
- **Relatórios financeiros**:
  - Visualizar saldo total, receitas e despesas categorizadas.
- **Validação robusta**:
  - Esquemas de validação para dados de entrada com Zod.
- **Arquitetura escalável**:
  - Estruturado para facilitar a expansão e manutenção.

## 📂 Estrutura do Projeto

O projeto segue uma estrutura modular e escalável:

- **src/**:
  - **modules/**: Contém os módulos principais, como autenticação, transações e categorias.
  - **routes/**: Define as rotas disponíveis na API.
  - **prisma/**: Gerencia o esquema e as migrações do banco de dados.
  - **schemas/**: Esquemas de validação com Zod.
  - **utils/**: Funções auxiliares reutilizáveis.

## 🛠️ Instalação e Uso

### Pré-requisitos

- **Node.js** (v18+)
- **Docker** (opcional, para rodar o banco de dados)

### Passos para execução

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/rafaelone/finance-api.git
   cd finance-api
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis necessárias, como informações de conexão ao banco de dados.

4. **Inicie o banco de dados com Docker (opcional)**:

   ```bash
   docker-compose up -d
   ```

5. **Execute as migrações do banco de dados**:

   ```bash
   npx prisma migrate dev
   ```

6. **Inicie a aplicação**:

   ```bash
   npm run dev
   ```

7. **Acesse a API**:
   A API estará disponível em `http://localhost:3000`.

## 🧪 Testes

O projeto utiliza **Jest** e **Supertest** para garantir a qualidade do código e funcionalidade dos endpoints.

### Executar testes:

```bash
npm test
```

### Verificar a cobertura dos testes:

```bash
npm run test:coverage
```

## 📖 Documentação

### Endpoints Principais

1. **Autenticação**

   - `POST /auth/signup`: Cria uma nova conta.
   - `POST /auth/login`: Realiza o login e retorna o token JWT.

2. **Transações**

   - `GET /transactions`: Lista todas as transações.
   - `POST /transactions`: Cria uma nova transação.
   - `PUT /transactions/:id`: Atualiza uma transação.
   - `DELETE /transactions/:id`: Exclui uma transação.

3. **Relatórios**
   - `GET /reports`: Retorna o saldo total, receitas e despesas.

### Documentação Completa

Para mais detalhes, acesse a documentação gerada pelo Swagger (se configurada) em:  
`http://localhost:3000/docs`

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório.
2. Crie uma nova branch para sua funcionalidade:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "feat: descrição da funcionalidade"
   ```
4. Envie sua branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. Abra um Pull Request.

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE). Sinta-se à vontade para usá-lo e adaptá-lo conforme necessário.

## 👨‍💻 Autor

Desenvolvido por [Rafael One](https://github.com/rafaelone). Se você achou este projeto útil, deixe uma ⭐ no repositório para apoiar o desenvolvimento!

Se precisar de ajustes, como adicionar mais detalhes ou alterar algum item, é só avisar! 🚀
