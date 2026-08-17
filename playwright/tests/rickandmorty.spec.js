import { test, expect } from '@playwright/test';
import { getRickAndMortyQuery } from '../queries/rickAndMortyQueries.js';
import { postGraphQL } from '../api/graphqlClient.js';
import { rickAndMortyResponseSchema } from '../schemas/rickAndMortySchema.js';
import { validateSchema } from '../utils/validateSchema.js';

test('consulta GraphQL - Rick and Morty API', async ({ request }) => {

  // Arrange
  const response = await postGraphQL(
    request,
    getRickAndMortyQuery
  );

  // Act
  const body = await response.json();

  // Assert - HTTP
  expect(response.ok()).toBeTruthy();

  // Assert - GraphQL
  expect(body.errors).toBeUndefined();

  // Assert - Schema
  expect(
    validateSchema(
      rickAndMortyResponseSchema,
      body
    )
  ).toBeTruthy();

  // Assert - Regras de negócio
  expect(
    body.data.characters.info.count
  ).toBeGreaterThan(0);

  expect(
    body.data.characters.results.length
  ).toBeGreaterThan(0);

  expect(
    body.data.location.id
  ).toBe('1');

  expect(
    body.data.episodesByIds
  ).toHaveLength(2);
});