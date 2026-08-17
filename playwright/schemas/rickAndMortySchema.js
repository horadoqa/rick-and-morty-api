import { z } from 'zod';

export const rickAndMortyResponseSchema = z.object({
  data: z.object({
    characters: z.object({
      info: z.object({
        count: z.number().int().nonnegative(),
      }),
      results: z.array(
        z.object({
          name: z.string().min(1),
        })
      ),
    }),
    location: z.object({
      id: z.string().min(1),
    }),
    episodesByIds: z.array(
      z.object({
        id: z.string().min(1),
      })
    ),
  }),
  errors: z.undefined().optional(),
});