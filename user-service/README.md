# 👥 User Service

Este serviço gerencia **usuários** e **autores (docentes)** da aplicação de blogging.  
Permite o cadastro, listagem, atualização, remoção e busca de usuários e autores.  
Funciona como parte de uma arquitetura de microsserviços, usando JWT para segurança e REST para comunicação.

---

## 📦 Instalação

```bash
git clone https://github.com/<seu-usuario>/user-service.git
cd user-service
npm install
```

---

## 🚀 Inicialização

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Ambiente de produção

```bash
npm start
```

A aplicação será executada na porta definida no `.env`.

---

## 🔐 Autenticação

As rotas protegidas exigem um token JWT válido.  
Envie o token no cabeçalho da requisição:

```
Authorization: Bearer <token>
```

---

## 🌐 Endpoints e Exemplos

### Usuários (`/users`)

#### `POST /users`
Cria um novo usuário.

```json
POST http://localhost:3001/users
Headers:
  Content-Type: application/json

Body:
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456"
}
```

#### `GET /users`
Lista todos os usuários.

```json
GET http://localhost:3001/users
```

#### `GET /users/:id`
Busca um usuário por ID.

```json
GET http://localhost:3001/users/ID_DO_USUARIO
```

#### `PUT /users/:id` 🔐
Atualiza um usuário existente.

```json
PUT http://localhost:3001/users/ID_DO_USUARIO
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "name": "Maria Silva Atualizada",
  "email": "maria@novoemail.com"
}
```

#### `DELETE /users/:id` 🔐
Remove um usuário existente.

```json
DELETE http://localhost:3001/users/ID_DO_USUARIO
Headers:
  Authorization: Bearer <token>
```

---

### Autores (`/authors`)

#### `POST /authors` 🔐
Cria um novo autor.

```json
POST http://localhost:3001/authors
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "name": "Prof. João da Silva",
  "email": "joao@instituicao.com"
}
```

#### `GET /authors`
Lista todos os autores.

```json
GET http://localhost:3001/authors
```

#### `GET /authors/:id`
Busca um autor pelo ID.

```json
GET http://localhost:3001/authors/ID_DO_AUTOR
```

#### `GET /authors/search/:name`
Busca autores pelo nome.

```json
GET http://localhost:3001/authors/search/joao
```

#### `PUT /authors/:id` 🔐
Atualiza os dados de um autor.

```json
PUT http://localhost:3001/authors/ID_DO_AUTOR
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "name": "Prof. João Atualizado",
  "email": "joao@atualizado.com"
}
```

#### `DELETE /authors/:id` 🔐
Remove um autor.

```json
DELETE http://localhost:3001/authors/ID_DO_AUTOR
Headers:
  Authorization: Bearer <token>
```

---

## 🧪 Como Testar os Endpoints

### 🧘 Usando Swagger UI
Acesse a documentação interativa em:
`http://localhost:3001/api-docs`

### 💼 Usando Postman
Importe a coleção `arq-soft-express-js.postman_collection.json` e configure a variável de token.

---

## ⚙️ Variáveis de Ambiente

Crie um `.env` com:

```env
DB_CONNECTION_STRING=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Para testes, use:

```env
DB_URL_TEST=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

---

## 🧪 Testes

Execute com:

```bash
npm test
```

Utiliza:
- Jest
- Supertest
- MongoDB in-memory

---

## 🧰 Tecnologias

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Jest + Supertest

---

## 📁 Estrutura de Pastas

```plaintext
user-service/
├── .env                     # Arquivo de variáveis de ambiente (não versionado)
├── .env.test                # Variáveis específicas para ambiente de teste
├── server.js                # Ponto de entrada da aplicação
├── package.json             # Definições de scripts, dependências e metadata
├── jest.config.js           # Configuração do Jest
├── src/                     # Código-fonte principal do serviço
│   ├── app.js               # Configuração do servidor Express
│   ├── config/              # Conexão com MongoDB, segredo JWT e Swagger
│   │   ├── dbConnect.js
│   │   ├── jsonSecret.js
│   │   └── swagger.js
│   ├── controllers/         # Camada de controladores HTTP
│   │   ├── userController.js
│   │   └── authorController.js
│   ├── dtos/                # Objetos de Transferência de Dados (validação)
│   │   ├── userDto.js
│   │   └── authorDto.js
│   ├── middleware/          # Middleware de autenticação JWT
│   │   └── authMiddleware.js
│   ├── models/              # Schemas Mongoose para User e Author
│   │   ├── User.js
│   │   └── Author.js
│   ├── repositories/        # Acesso e manipulação de dados no banco
│   │   ├── baseRepository.js
│   │   ├── userRepository.js
│   │   └── authorRepository.js
│   ├── routes/              # Arquivos de definição de rotas
│   │   ├── userRoutes.js
│   │   ├── authorRoutes.js
│   │   └── index.js
│   ├── services/            # Regras de negócio e orquestração de lógica
│   │   ├── userService.js
│   │   └── authorService.js
│   └── tests/               # Testes unitários e de integração
│       ├── controllers/
│       ├── integration/
│       ├── services/
│       └── utils/


## 📬 Contato

Dúvidas, sugestões ou contribuições? Abra uma issue ou envie um pull request.
