import { z } from 'zod';
import UserRepository from '../repositories/user.repository';
import { Error400 } from '../errors/http.errors';

export class AccountService {
  name = 'accountService';
  userRepository: UserRepository;

  constructor(ctx: { repositories: { userRepository: UserRepository } }) {
    this.userRepository = ctx.repositories.userRepository;
  }

  async getProfile(id: number) {
    const schema = z.object({ id: z.number() });

    const parsedData = schema.safeParse({ id });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const user = await this.userRepository.findUserById(id);
    return user;
  }
}

export default AccountService;
