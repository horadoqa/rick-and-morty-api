
Base url: https://rickandmortyapi.com/api

{
  "characters": "https://rickandmortyapi.com/api/character",
  "locations": "https://rickandmortyapi.com/api/location",
  "episodes": "https://rickandmortyapi.com/api/episode"
}

curl https://rickandmortyapi.com/api/character | jq
curl https://rickandmortyapi.com/api/location | jq
curl https://rickandmortyapi.com/api/episode | jq


Salvando o conteúdo da resposta no arquivo

```bash
curl -sS -o character.json https://rickandmortyapi.com/api/character
curl -sS -o location.json https://rickandmortyapi.com/api/location
curl -sS -o episode.json https://rickandmortyapi.com/api/episode
```

## Opções:

`-o` → salva no arquivo
`-s` → modo silencioso
`-S` → ainda mostra erros caso aconteçam

## Visualizar o arquivo

```bash
jq . character.json
```

## Outra forma

```bash
curl -s https://rickandmortyapi.com/api/character | jq > character.json
```
