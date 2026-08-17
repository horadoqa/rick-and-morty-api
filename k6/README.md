# Testes de Performance

O arquivo: generate.js 

Gera uma massa de teste que varia independentemente entre 42 páginas × 12 filtros × 126 locations × combinações de episódios × 10 níveis de seleção de campos, embora as 1.000 amostras sejam uma distribuição determinística desse espaço de combinações.

Salva no arquivo queries.json que é utilizado no teste script-json.js

Ao executar o teste: k6 run script-json.js



