import { Error400, Error404 } from '../errors/http.errors';
import UserRepository from '../repositories/user.repository';
import { z } from 'zod';

export class UserService {
  name = 'userService';
  userRepository: UserRepository;

  constructor(ctx: { repositories: { userRepository: UserRepository } }) {
    this.userRepository = ctx.repositories.userRepository;
  }

  async getUsers({
    roleId,
    limit,
    offset,
    search,
  }: {
    roleId: number;
    limit?: number;
    offset?: number;
    search: string;
  }) {
    const schema = z.object({
      roleId: z.number(),
      search: z.string().min(1).max(255).optional().or(z.literal('')),
    });

    const parsedData = schema.safeParse({ roleId, limit, offset, search });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.userRepository.getUsers({
      roleId,
      limit,
      offset,
      search,
    });
  }

  async getUserById(id: number) {
    const schema = z.object({
      id: z.number(),
    });

    const parsedData = schema.safeParse({ id });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error404({ message: 'User not found' });
    }

    return user;
  }
}

export default UserService;
