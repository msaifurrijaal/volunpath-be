import { Error400 } from '../errors/http.errors';
import LocationRepository from '../repositories/location.repository';
import { z } from 'zod';

export class LocationService {
  name = 'locationService';
  locationRepository: LocationRepository;

  constructor(ctx: { repositories: { locationRepository: LocationRepository } }) {
    this.locationRepository = ctx.repositories.locationRepository;
  }

  async getProvinces({
    limit,
    offset,
    search,
  }: {
    limit?: number;
    offset?: number;
    search: string;
  }) {
    const schema = z.object({
      limit: z.number().optional(),
      offset: z.number().optional(),
      search: z.string().min(1).max(255).optional().or(z.literal('')),
    });

    const parsedData = schema.safeParse({ limit, offset, search });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.locationRepository.getProvinces({
      limit,
      offset,
      search,
    });
  }

  async getRegencies({
    provinceId,
    limit,
    offset,
    search,
  }: {
    provinceId: number;
    limit?: number;
    offset?: number;
    search: string;
  }) {
    const schema = z.object({
      provinceId: z.number(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      search: z.string().min(1).max(255).optional().or(z.literal('')),
    });

    const parsedData = schema.safeParse({ provinceId, limit, offset, search });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.locationRepository.getRegencies({
      provinceId,
      limit,
      offset,
      search,
    });
  }
}

export default LocationService;
