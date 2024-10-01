import { ZodSchema } from 'zod';
import { Error400 } from '../errors/http.errors';

export function validateSchema<T>(schema: ZodSchema, data: any): T {
  const parsedData = schema.safeParse(data);
  if (!parsedData.success) {
    const errorMessage = parsedData.error.issues[0].message;
    throw new Error400({ message: errorMessage });
  }
  return parsedData.data;
}
