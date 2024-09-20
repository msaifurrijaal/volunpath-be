import SkillRepository from '../repositories/skill.repository';

export class SkillService {
  name = 'skillService';
  skillRepository: SkillRepository;

  constructor(ctx: { repositories: { skillRepository: SkillRepository } }) {
    this.skillRepository = ctx.repositories.skillRepository;
  }

  async getSkills() {
    return this.skillRepository.getSkills();
  }
}

export default SkillService;
