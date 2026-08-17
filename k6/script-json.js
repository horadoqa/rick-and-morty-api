import http from 'k6/http';
import { check } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';

const queries = new SharedArray('queries', () => {
    return JSON.parse(open('./queries.json'));
});

const BASE_URL = __ENV.BASE_URL || 'https://rickandmortyapi.com/graphql';

const graphqlDuration = new Trend('graphql_duration');
const http200 = new Counter('http_200');
const http400 = new Counter('http_400');
const http429 = new Counter('http_429');
const http500 = new Counter('http_500');
const graphqlErrors = new Counter('graphql_errors');

// Configuração de carga para o teste de desempenho. Ajuste conforme necessário.
// export const options = {
//   vus: 10, // Número de usuários virtuais (VUs) simultâneos
//   duration: '30s',
// };

// Rate Limit do lado do Gerador de Carga (k6) para evitar sobrecarga do servidor. Ajuste conforme necessário.
export const options = {
    scenarios: {
        graphql_load: {
            executor: 'constant-arrival-rate',
            rate: 1, // 1 requisição por segundo
            timeUnit: '1s', // 
            duration: '5m', // Duração total do teste
            preAllocatedVUs: 2, // Número de VUs pré-alocados
            maxVUs: 10, // Número máximo de VUs que podem ser alocados
        },
    },
};

export default function () {
    const item = queries[Math.floor(Math.random() * queries.length)];

    const response = http.post(
        BASE_URL,
        JSON.stringify({
            query: item.query,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    graphqlDuration.add(response.timings.duration);

    if (response.status === 200) {
        http200.add(1);
    } else if (response.status === 400) {
        http400.add(1);
    } else if (response.status === 429) {
        http429.add(1);
    } else if (response.status >= 500) {
        http500.add(1);
    }

    try {
        const body = response.json();

        if (body.errors) {
            graphqlErrors.add(1);
        }
    } catch (e) {
        // Resposta não-JSON
    }

    console.log(
        JSON.stringify({
            status: response.status,
            error: response.error,
            error_code: response.error_code,
            body: response.body?.substring(0, 500),
        })
    );

    check(response, {
        'HTTP 200': (r) => r.status === 200,
        'GraphQL sem errors': (r) => {
            try {
                return !r.json().errors;
            } catch (e) {
                return false;
            }
        },
    });
}

// Observação: a API possui atualmente 826 personagens, 126 locations e 51 episódios, e a paginação retorna até 20 personagens por página.

// Para executar o script, use o seguinte comando no terminal:
// k6 run script-json.js

// Para executar o script com 1 VU e 10 iterações, use o seguinte comando:
//k6 run --vus 1 --iterations 10 script-json.js

// Exportar a variável de ambiente BASE_URL para definir a URL base da API GraphQL antes de executar o script:
// export BASE_URL=https://rickandmortyapi.com/graphql
// echo $BASE_URL