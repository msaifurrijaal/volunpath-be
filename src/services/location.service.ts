import LocationRepository from '../repositories/location.repository';

export class LocationService {
  name = 'locationService';
  locationRepository: LocationRepository;

  constructor(ctx: {
    repositories: { locationRepository: LocationRepository };
  }) {
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
    return this.locationRepository.getProvinces({
      limit,
      offset,
      search,
    });
  }
}

export default LocationService;
