# 🔐 Auth Service

Serviço de autenticação da aplicação de blogging, responsável pelo login de usuários e emissão de tokens JWT para acesso seguro aos demais microsserviços.

Este serviço é parte de uma arquitetura de microsserviços e se comunica via HTTP RESTful.

---

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/<seu-usuario>/auth-service.git
cd auth-service
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

A aplicação será executada na porta definida em `.env` (por padrão, `3000`).

---

## 🔐 Autenticação

A autenticação é baseada em **JSON Web Tokens (JWT)**. Após realizar o login, um token é retornado e deve ser incluído no header das requisições subsequentes aos demais microsserviços.

### Exemplo de header:

```
Authorization: Bearer <token>
```

---

## 🌐 Endpoints

### `POST /auth/login`

Autentica o usuário e retorna um token JWT.

#### Payload:

```json
{
  "email": "usuario@exemplo.com",
  "password": "123456"
}
```

#### Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
DB_CONNECTION_STRING=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Para testes, use um arquivo `.env.test` com:

```env
DB_URL_TEST=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

> Recomenda-se não versionar `.env` diretamente. Utilize `.env.example` como referência pública.

---

## 🧪 Testes

Execute os testes unitários e de integração com:

```bash
npm test
```

Utiliza:
- **Jest** para testes unitários
- **Supertest** para testes de endpoints
- **MongoDB in-memory** para isolamento em ambiente de teste

---

## 🧰 Stack Tecnológica

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Jest + Supertest

---

## 📁 Estrutura de Pastas

```
auth-service/
├── .env                     # Variáveis de ambiente
├── server.js                # Ponto de entrada
├── src/
│   ├── app.js               # Configuração principal do Express
│   ├── config/              # Conexão com DB e configurações JWT/Swagger
│   ├── controllers/         # Lógica do endpoint de autenticação
│   ├── dtos/                # DTOs para validação de dados
│   ├── middleware/          # Middleware de autenticação JWT
│   ├── models/              # Schema do usuário
│   ├── routes/              # Definições de rotas
│   ├── services/            # Lógica de autenticação
│   └── tests/               # Testes organizados por tipo
└── package.json             # Dependências e scripts
```

---

## 📬 Contato

Em caso de dúvidas, sugestões ou contribuições, abra uma issue ou entre em contato pelo GitHub.
