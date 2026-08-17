# Exemplo de requisição

Base url: https://rickandmortyapi.com/graphql

```query
query {
  characters(page: 2, filter: { name: "rick" }) {
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

Resposta:

```json
{
  "data": {
    "characters": {
      "info": {
        "count": 107
      },
      "results": [
        {
          "name": "Mechanical Rick"
        },
        {
          "name": "Mega Fruit Farmer Rick"
        },
        {
          "name": "Morty Rick"
        },
        {
          "name": "Pickle Rick"
        },
        {
          "name": "Plumber Rick"
        },
        {
          "name": "Quantum Rick"
        },
        {
          "name": "Regional Manager Rick"
        },
        {
          "name": "Reverse Rick Outrage"
        },
        {
          "name": "Rick D. Sanchez III"
        },
        {
          "name": "Rick Guilt Rick"
        },
        {
          "name": "Rick Prime"
        },
        {
          "name": "Rick D-99"
        },
        {
          "name": "Rick D716"
        },
        {
          "name": "Rick D716-B"
        },
        {
          "name": "Rick D716-C"
        },
        {
          "name": "Rick Sanchez"
        },
        {
          "name": "Rick J-22"
        },
        {
          "name": "Rick K-22"
        },
        {
          "name": "Rick Sanchez"
        },
        {
          "name": "Ricktiminus Sancheziminius"
        }
      ]
    },
    "location": {
      "id": "1"
    },
    "episodesByIds": [
      {
        "id": "1"
      },
      {
        "id": "2"
      }
    ]
  }
}
```
