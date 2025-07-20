# 📝 Post Service

Serviço responsável pela criação, leitura, atualização e remoção de postagens (CRUD) na aplicação de blogging.  
Opera de forma independente como parte da arquitetura de microsserviços, comunicando-se com os serviços de usuários/autores via HTTP RESTful.

---

## 📦 Instalação

```bash
git clone https://github.com/<seu-usuario>/post-service.git
cd post-service
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

A aplicação será executada na porta definida no arquivo `.env`.

---

## 🔐 Autenticação

O serviço utiliza **JWT** para validar o acesso às rotas protegidas.  
O token JWT deve ser enviado no cabeçalho da requisição como abaixo:

```
Authorization: Bearer <token>
```

---

## 🌐 Endpoints e Exemplos

### `GET /posts`

Retorna todas as postagens.

```bash
curl http://localhost:3003/posts
```

---

### `POST /posts` (🔐 Requer autenticação)

Cria uma nova postagem.

```bash
curl -X POST http://localhost:3003/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título da Postagem",
    "description": "Descrição detalhada do conteúdo",
    "author": "ID_DO_AUTOR"
}'
```

---

### `GET /posts/:id`

Busca uma postagem pelo ID.

```bash
curl http://localhost:3003/posts/ID_DA_POSTAGEM
```

---

### `PUT /posts/:id` (🔐 Requer autenticação)

Atualiza uma postagem existente.

```bash
curl -X PUT http://localhost:3003/posts/ID_DA_POSTAGEM \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Novo Título",
    "description": "Nova descrição",
    "author": "ID_DO_AUTOR"
}'
```

---

### `DELETE /posts/:id` (🔐 Requer autenticação)

Remove uma postagem.

```bash
curl -X DELETE http://localhost:3003/posts/ID_DA_POSTAGEM \
  -H "Authorization: Bearer <token>"
```

---

### `GET /posts/search/:keyword`

Busca postagens por palavra-chave no título ou descrição.

```bash
curl http://localhost:3003/posts/search/javascript
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
DB_CONNECTION_STRING=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Para testes, utilize o `.env.test` com:

```env
DB_URL_TEST=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

> Mantenha `.env` fora do versionamento. Use `.env.example` como referência pública.

---

## 🧪 Testes

Execute os testes com:

```bash
npm test
```

Utiliza:
- **Jest** para testes unitários
- **Supertest** para testes de endpoints
- **MongoDB in-memory** para testes de integração

---

## 🧰 Stack Tecnológica

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Jest + Supertest

---

## 📁 Estrutura de Pastas

```
post-service/
├── .env                     # Variáveis de ambiente
├── server.js                # Ponto de entrada da aplicação
├── src/
│   ├── app.js               # Configuração principal do Express
│   ├── config/              # Conexão com DB e configurações auxiliares
│   ├── controllers/         # Lógica das rotas de postagens
│   ├── dtos/                # Validação de dados das postagens
│   ├── middleware/          # Middleware de autenticação JWT
│   ├── models/              # Schema Mongoose de Post
│   ├── repositories/        # Base e repositório específico de Post
│   ├── routes/              # Rotas do recurso Post
│   ├── services/            # Regras de negócio do Post
│   └── tests/               # Testes unitários e de integração
└── package.json             # Dependências e scripts
```

---

## 📬 Contato

Dúvidas, sugestões ou contribuições? Fique à vontade para abrir uma issue ou contribuir via pull request.
