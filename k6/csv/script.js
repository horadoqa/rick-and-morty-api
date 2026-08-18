import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
};

// Importar .csv

export default function () {
  const url = 'https://rickandmortyapi.com/graphql';

  const payload = JSON.stringify({
    query: `
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
    `,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.request('QUERY', url, payload, params);

  check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta contém characters': (r) =>
      r.body.includes('characters'),
    'resposta contém location': (r) =>
      r.body.includes('location'),
    'resposta contém episodesByIds': (r) =>
      r.body.includes('episodesByIds'),
  });

  console.log(response.body);
}