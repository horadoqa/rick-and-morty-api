const fs = require("fs");

const TOTAL_QUERIES = 1000;

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const TOTAL_PAGES = 42;
const TOTAL_LOCATIONS = 126;
const TOTAL_EPISODES = 51;

// ============================================================
// 1. CHARACTERS.FILTER.NAME
// ============================================================

const names = [
  "rick",
  "morty",
  "summer",
  "beth",
  "jerry",
  "smith",
  "alien",
  "bird",
  "pickle",
  "president",
  "evil",
  "sanchez"
];

// ============================================================
// 2. SELEÇÃO DE CAMPOS DO CHARACTER
//
// 10 níveis diferentes.
//
// IMPORTANTE:
// Não utilizamos "url" nem "created", pois o schema GraphQL
// do endpoint apresentou erro para esses campos.
// ============================================================

const characterSelections = [

  // ==========================================================
  // NÍVEL 1
  // ==========================================================

  `
    id
    name
  `,

  // ==========================================================
  // NÍVEL 2
  // ==========================================================

  `
    id
    name
    status
    species
  `,

  // ==========================================================
  // NÍVEL 3
  // ==========================================================

  `
    id
    name
    status
    species
    type
    gender
  `,

  // ==========================================================
  // NÍVEL 4
  // ==========================================================

  `
    id
    name
    status
    species
    type
    gender
    image
  `,

  // ==========================================================
  // NÍVEL 5
  // ==========================================================

  `
    id
    name
    status
    species
    gender
    origin {
      id
      name
    }
  `,

  // ==========================================================
  // NÍVEL 6
  // ==========================================================

  `
    id
    name
    status
    species
    gender
    location {
      id
      name
    }
  `,

  // ==========================================================
  // NÍVEL 7
  // ==========================================================

  `
    id
    name
    status
    species
    type
    gender

    origin {
      id
      name
    }

    location {
      id
      name
    }
  `,

  // ==========================================================
  // NÍVEL 8
  // ==========================================================

  `
    id
    name
    status
    species
    type
    gender
    image

    origin {
      id
      name
    }

    location {
      id
      name
    }
  `,

  // ==========================================================
  // NÍVEL 9
  // ==========================================================

  `
    id
    name
    status
    species
    type
    gender

    origin {
      id
      name
    }

    location {
      id
      name
    }

    episode {
      id
      name
      episode
    }
  `,

  // ==========================================================
  // NÍVEL 10
  // ==========================================================

  `
    id
    name
    status
    species
    type
    gender
    image

    origin {
      id
      name
    }

    location {
      id
      name
    }

    episode {
      id
      name
      air_date
      episode
    }
  `
];

// ============================================================
// 3. FUNÇÃO PARA GERAR COMBINAÇÕES DE EPISÓDIOS
// ============================================================
//
// Gera três IDs diferentes entre 1 e 51.
//
// A combinação é determinística, o que facilita reproduzir
// exatamente a mesma massa de testes.
// ============================================================

function generateEpisodeIds(index) {
  let episode1 = (index % TOTAL_EPISODES) + 1;

  let episode2 =
    ((index * 7 + 3) % TOTAL_EPISODES) + 1;

  let episode3 =
    ((index * 13 + 11) % TOTAL_EPISODES) + 1;

  // Garante que os três IDs sejam diferentes.

  if (episode2 === episode1) {
    episode2 = (episode2 % TOTAL_EPISODES) + 1;
  }

  if (
    episode3 === episode1 ||
    episode3 === episode2
  ) {
    episode3 = (episode3 % TOTAL_EPISODES) + 1;
  }

  return [
    episode1,
    episode2,
    episode3
  ];
}

// ============================================================
// 4. NORMALIZA A QUERY
// ============================================================

function normalizeQuery(query) {
  return query
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// 5. GERA AS 1.000 QUERIES
// ============================================================

const queries = [];

for (let i = 0; i < TOTAL_QUERIES; i++) {

  // ----------------------------------------------------------
  // characters.page
  //
  // 1 → 42
  // ----------------------------------------------------------

  const page =
    (i % TOTAL_PAGES) + 1;

  // ----------------------------------------------------------
  // characters.filter.name
  //
  // 12 nomes
  // ----------------------------------------------------------

  const name =
    names[i % names.length];

  // ----------------------------------------------------------
  // location.id
  //
  // 1 → 126
  // ----------------------------------------------------------

  const locationId =
    (i % TOTAL_LOCATIONS) + 1;

  // ----------------------------------------------------------
  // episodesByIds
  //
  // combinação de 3 episódios
  // ----------------------------------------------------------

  const [
    episode1,
    episode2,
    episode3
  ] = generateEpisodeIds(i);

  // ----------------------------------------------------------
  // seleção de campos
  //
  // 10 níveis
  // ----------------------------------------------------------

  const selection =
    characterSelections[
      i % characterSelections.length
    ];

  // ----------------------------------------------------------
  // QUERY GRAPHQL
  // ----------------------------------------------------------

  const query = normalizeQuery(`
    query {

      characters(
        page: ${page},
        filter: {
          name: "${name}"
        }
      ) {

        info {
          count
          pages
        }

        results {
          ${selection}
        }
      }

      location(
        id: ${locationId}
      ) {
        id
        name
        type
        dimension
      }

      episodesByIds(
        ids: [
          ${episode1},
          ${episode2},
          ${episode3}
        ]
      ) {
        id
        name
        air_date
        episode
      }
    }
  `);

  queries.push({
    query
  });
}

// ============================================================
// 6. ESTATÍSTICAS
// ============================================================

const statistics = {
  totalQueries: queries.length,

  pages: TOTAL_PAGES,

  names: names.length,

  locations: TOTAL_LOCATIONS,

  episodes: TOTAL_EPISODES,

  fieldSelectionLevels:
    characterSelections.length
};

// ============================================================
// 7. VALIDAÇÕES DA MASSA
// ============================================================

if (queries.length !== TOTAL_QUERIES) {
  throw new Error(
    `Esperado ${TOTAL_QUERIES} queries, ` +
    `mas foram geradas ${queries.length}.`
  );
}

if (characterSelections.length !== 10) {
  throw new Error(
    "É esperado exatamente 10 níveis de seleção de campos."
  );
}

// ============================================================
// 8. ESCREVE queries.json
// ============================================================

fs.writeFileSync(
  "queries.json",
  JSON.stringify(queries, null, 2),
  "utf8"
);

// ============================================================
// 9. RELATÓRIO
// ============================================================

console.log("");
console.log("==========================================");
console.log(" GraphQL Test Data Generator");
console.log("==========================================");
console.log(
  ` Queries:              ${statistics.totalQueries}`
);
console.log(
  ` Pages:                ${statistics.pages}`
);
console.log(
  ` Names:                ${statistics.names}`
);
console.log(
  ` Locations:            ${statistics.locations}`
);
console.log(
  ` Episodes:             ${statistics.episodes}`
);
console.log(
  ` Field selections:     ${statistics.fieldSelectionLevels}`
);
console.log("==========================================");
console.log(" Arquivo: queries.json");
console.log("==========================================");
console.log("");