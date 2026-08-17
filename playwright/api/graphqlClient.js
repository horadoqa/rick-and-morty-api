export async function postGraphQL(request, query) {
  return await request.post(
    'https://rickandmortyapi.com/graphql',
    {
      headers: {
        'Content-Type': 'application/json',
      },

      data: {
        query,
      },
    }
  );
}