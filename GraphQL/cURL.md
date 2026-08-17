# `cURL` + GraphQL

Como saber se a aplicação aceita a requisição seja feita utilizando o Método `QUERY` ?

```bash
curl -i -X OPTIONS 'https://rickandmortyapi.com/graphql'
HTTP/2 200 
date: Mon, 17 Aug 2026 10:23:29 GMT
content-length: 0
server: cloudflare
x-xss-protection: 1; mode=block
access-control-allow-origin: *
access-control-allow-headers: *
access-control-allow-methods: POST, GET, HEAD, OPTIONS
access-control-allow-credentials: true
access-control-expose-headers: *
access-control-max-age: 600
x-robots-tag: noindex
x-served-by: cache-bru1480055-BRU
cf-cache-status: DYNAMIC
report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=aPz6M7hoqMeS3NOSYnLxyK1YlYJD91LABQB54Z8eqFagv2ADCL11pZbjmbgMZ5zaUCklcuaDtzdW4%2BWO1PnzVwyjpk5TD5%2FDK0QLRrvDkEHG1OHzsB2%2FGmDqwkI6AYV59bfZRVK2"}]}
nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
expect-ct: max-age=86400, enforce
referrer-policy: same-origin
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
cf-ray: a2c7f6b088232a36-GIG
alt-svc: h3=":443"; ma=86400
```

No caso da aplicação testada, a resposta foi:

```json
{
    access-control-allow-methods: POST, GET, HEAD, OPTIONS
}
```

Ou seja, não aceita o Método `QUERY`

Este documento apresenta diferentes formas de executar consultas GraphQL na [Rick and Morty API](https://rickandmortyapi.com/graphql) utilizando `cURL`.

A consulta utilizada nos exemplos é:

```graphql
query {
  characters(
    page: 2
    filter: { name: "rick" }
  ) {
    info {
      count
    }
    results {
      name
    }
  }

  location(id: 1) {
    id
  }

  episodesByIds(ids: [1, 2]) {
    id
  }
}
```

Ela consulta simultaneamente:

* **Characters:** personagens cujo nome contém `"rick"`, na página 2;
* **Location:** a localização de ID `1`;
* **Episodes:** os episódios de IDs `1` e `2`.

---

## 1. Requisição via GET

Uma requisição GraphQL pode ser enviada pelo método `GET`, utilizando a query como parâmetro da URL.

### Query sem codificação

```text
https://rickandmortyapi.com/graphql?query=query { characters(page: 2, filter: { name: "rick" }) { info { count } results { name } } location(id: 1) { id } episodesByIds(ids: [1, 2]) { id } }
```

### Query codificada

Como a query contém espaços, chaves, aspas, colchetes e outros caracteres especiais, ela pode ser codificada para ser utilizada com segurança na URL:

```text
https://rickandmortyapi.com/graphql?query=query%20%7B%20characters%28page%3A%202%2C%20filter%3A%20%7B%20name%3A%20%22rick%22%20%7D%29%20%7B%20info%20%7B%20count%20%7D%20results%20%7B%20name%20%7D%20%7D%20location%28id%3A%201%29%20%7B%20id%20%7D%20episodesByIds%28ids%3A%20%5B1%2C%202%5D%29%20%7B%20id%20%7D%20%7D
```

> **Observação:** não é necessário montar manualmente uma URL codificada. O `cURL` pode fazer essa codificação automaticamente.

### Forma recomendada com `cURL`

```bash
curl -G 'https://rickandmortyapi.com/graphql' \
  --data-urlencode 'query=query { characters(page: 2, filter: { name: "rick" }) { info { count } results { name } } location(id: 1) { id } episodesByIds(ids: [1, 2]) { id } }'
```

O parâmetro `-G` instrui o `cURL` a enviar os dados como parâmetros de uma requisição `GET`, enquanto `--data-urlencode` realiza a codificação necessária.

---

## 2. Requisição via POST

Outra forma, e geralmente mais conveniente para consultas GraphQL maiores, é utilizar `POST` e enviar a query no corpo da requisição.

```bash
curl -X POST 'https://rickandmortyapi.com/graphql' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "query": "query { characters(page: 2, filter: { name: \"rick\" }) { info { count } results { name } } location(id: 1) { id } episodesByIds(ids: [1, 2]) { id } }"
  }'
```

### Resposta

```json
{
  "data": {
    "characters": {
      "info": {
        "count": 107
      },
      "results": [
        { "name": "Mechanical Rick" },
        { "name": "Mega Fruit Farmer Rick" },
        { "name": "Morty Rick" },
        { "name": "Pickle Rick" },
        { "name": "Plumber Rick" },
        { "name": "Quantum Rick" },
        { "name": "Regional Manager Rick" },
        { "name": "Reverse Rick Outrage" },
        { "name": "Rick D. Sanchez III" },
        { "name": "Rick Guilt Rick" },
        { "name": "Rick Prime" },
        { "name": "Rick D-99" },
        { "name": "Rick D716" },
        { "name": "Rick D716-B" },
        { "name": "Rick D716-C" },
        { "name": "Rick Sanchez" },
        { "name": "Rick J-22" },
        { "name": "Rick K-22" },
        { "name": "Rick Sanchez" },
        { "name": "Ricktiminus Sancheziminius" }
      ]
    },
    "location": {
      "id": "1"
    },
    "episodesByIds": [
      { "id": "1" },
      { "id": "2" }
    ]
  }
}
```

---

## 3. `GET` vs. `POST`

É importante diferenciar o **método HTTP** da **operação GraphQL**.

Uma query GraphQL pode ser enviada por HTTP usando `GET` ou `POST`, dependendo do servidor e da forma como a requisição é construída.

### `GET`

A query é enviada como parâmetro da URL:

```text
GET /graphql?query=...
```

Exemplo:

```bash
curl -G 'https://rickandmortyapi.com/graphql' \
  --data-urlencode 'query=query { location(id: 1) { name } }'
```

### `POST`

A query é enviada no corpo da requisição:

```bash
curl -X POST 'https://rickandmortyapi.com/graphql' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "query": "query { location(id: 1) { name } }"
  }'
```

---

## 4. Sobre `curl -X QUERY`

```bash
curl -X QUERY 'https://rickandmortyapi.com/graphql' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "query": "query { characters(page: 2, filter: { name: \"rick\" }) { info { count } results { name } } location(id: 1) { id } episodesByIds(ids: [1, 2]) { id } }"
  }'
```

### Resposta:

```json
{"data":{"characters":{"info":{"count":107},"results":[{"name":"Mechanical Rick"},{"name":"Mega Fruit Farmer Rick"},{"name":"Morty Rick"},{"name":"Pickle Rick"},{"name":"Plumber Rick"},{"name":"Quantum Rick"},{"name":"Regional Manager Rick"},{"name":"Reverse Rick Outrage"},{"name":"Rick D. Sanchez III"},{"name":"Rick Guilt Rick"},{"name":"Rick Prime"},{"name":"Rick D-99"},{"name":"Rick D716"},{"name":"Rick D716-B"},{"name":"Rick D716-C"},{"name":"Rick Sanchez"},{"name":"Rick J-22"},{"name":"Rick K-22"},{"name":"Rick Sanchez"},{"name":"Ricktiminus Sancheziminius"}]},"location":{"id":"1"},"episodesByIds":[{"id":"1"},{"id":"2"}]}}%    
```

---

## 6. Resumo

| Método  | Query           | Onde a query é enviada      |
| ------- | --------------- | --------------------------- |
| `GET`   | GraphQL `query` | Parâmetro `query` da URL    |
| `POST`  | GraphQL `query` | Corpo JSON da requisição    |
| `QUERY` | ❌ Inválido     | O método HTTP não implementado |

Para consultas simples, `GET` é útil para testes rápidos. Para consultas maiores ou quando o corpo da requisição for mais conveniente, `POST` é uma opção mais adequada.

> **Nota:** não é necessário manter várias versões manualmente codificadas da mesma URL. Prefira `--data-urlencode` no `cURL` para gerar a codificação da query automaticamente.
