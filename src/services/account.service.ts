import UserRepository from '../repositories/user.repository';

export class AccountService {
  name = 'accountService';
  userRepository: UserRepository;

  constructor(ctx: { repositories: { userRepository: UserRepository } }) {
    this.userRepository = ctx.repositories.userRepository;
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findUserById(id);
    return user;
  }
}

export default AccountService;
