import { EducationRepository } from '../repositories/education.repository';

export class EducationService {
  name = 'educationService';
  educationRepository: EducationRepository;

  constructor(ctx: { repositories: { educationRepository: EducationRepository } }) {
    this.educationRepository = ctx.repositories.educationRepository;
  }

  async getEducations() {
    return this.educationRepository.getEducations();
  }
}

export default EducationService;
