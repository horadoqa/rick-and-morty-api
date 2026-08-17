# `GraphQL`

GraphQL é uma **linguagem de consulta para APIs** e também uma **especificação para como essas APIs funcionam**. Ela foi criada pelo Facebook (atual Meta) em 2012 e lançada como open source em 2015.

A principal ideia do GraphQL é permitir que o cliente (frontend) **peça exatamente os dados de que precisa**, sem receber informações extras nem precisar fazer várias requisições.

### Comparando com uma API REST

Imagine que você tem um usuário:

#### REST

Você faz uma requisição para:

```http
GET /users/123
```

E recebe:

```json
{
  "id": 123,
  "nome": "João",
  "email": "joao@email.com",
  "telefone": "99999-9999",
  "endereco": {
    "cidade": "São Paulo",
    "estado": "SP"
  }
}
```

Mesmo que você só precise do nome, a API retorna tudo.

---

#### GraphQL

Você envia uma consulta dizendo exatamente o que quer:

```graphql
query {
  usuario(id: 123) {
    nome
  }
}
```

Resposta:

```json
{
  "data": {
    "usuario": {
      "nome": "João"
    }
  }
}
```

Se depois precisar do email também:

```graphql
query {
  usuario(id: 123) {
    nome
    email
  }
}
```

Sem alterar a API, apenas a consulta.

---

## Outro benefício: evitar várias requisições

No REST, pode acontecer assim:

```
GET /users/123
GET /users/123/posts
GET /posts/1/comments
```

No GraphQL, tudo pode vir em uma única consulta:

```graphql
query {
  usuario(id: 123) {
    nome
    posts {
      titulo
      comentarios {
        texto
      }
    }
  }
}
```

---

## Operações principais

### Query (buscar dados)

```graphql
query {
  produtos {
    id
    nome
    preco
  }
}
```

### Mutation (alterar dados)

```graphql
mutation {
  criarProduto(
    nome: "Notebook"
    preco: 3500
  ) {
    id
    nome
  }
}
```

### Subscription (dados em tempo real)

Muito usada para chats, notificações e dashboards.

```graphql
subscription {
  novaMensagem {
    texto
    autor
  }
}
```

---

## Vantagens

* ✅ O cliente escolhe quais campos receber.
* ✅ Menos dados trafegando na rede.
* ✅ Menos requisições ao servidor.
* ✅ API fortemente tipada (há um esquema que define os tipos disponíveis).
* ✅ Boa documentação automática baseada nesse esquema.

---

## Desvantagens

* ❌ Implementação costuma ser mais complexa que uma API REST simples.
* ❌ Cache HTTP pode exigir estratégias diferentes.
* ❌ Consultas muito complexas podem impactar o desempenho se não forem limitadas.

---

## Quando usar?

GraphQL é uma boa escolha quando:

* Aplicações web ou mobile precisam de diferentes conjuntos de dados.
* Há muitos relacionamentos entre entidades (usuários, pedidos, produtos etc.).
* Você quer reduzir o número de chamadas à API.

REST costuma ser suficiente quando:

* A API é simples.
* Os recursos são bem definidos.
* Você quer aproveitar o cache HTTP de forma direta.

### Resumindo

| REST                                  | GraphQL                                   |
| ------------------------------------- | ----------------------------------------- |
| Vários endpoints (`/users`, `/posts`) | Um único endpoint (geralmente `/graphql`) |
| O servidor define a resposta          | O cliente define os campos da resposta    |
| Pode haver excesso ou falta de dados  | Recebe apenas o necessário                |
| Fácil de começar                      | Mais flexível, porém mais complexo        |

Em projetos modernos, é comum encontrar GraphQL em aplicações com interfaces ricas (como React, Vue ou Flutter), enquanto REST continua sendo uma excelente escolha para APIs mais simples ou quando a simplicidade e o uso de padrões HTTP são prioridades.


