import bcrypt from 'bcrypt';
import { z } from 'zod';
import { jwtSign } from '../helpers/jwt';
import config from '../config';
import UserRepository from '../repositories/user.repository';
import { JWTObject } from '../types/common';
import { Error400, Error401 } from '../errors/http.errors';

export class AuthService {
  name = 'authService';
  userRepository: UserRepository;

  constructor(ctx: { repositories: { userRepository: UserRepository } }) {
    this.userRepository = ctx.repositories.userRepository;
  }

  async login(email: string, password: string) {
    const schema = z.object({
      email: z.string().email({ message: 'Invalid email format!' }),
      password: z.string().min(1, { message: 'Password is required!' }),
    });

    const parsedData = schema.safeParse({ email, password });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const data = await this.userRepository.findUserByEmail(email);
    if (!data) {
      throw new Error401({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) {
      throw new Error401({ message: 'Invalid email or password' });
    }

    return {
      ...(await this.generateTokens({
        id: data.id,
        roleId: data.roleId,
      })),
    };
  }

  async generateTokens(payload: JWTObject) {
    const accessToken = jwtSign(
      { ...payload, type: 'access_token' },
      { canExpired: true, expiredTime: config.jwt.expired },
    );
    const refreshToken = jwtSign(
      { ...payload, type: 'refresh_token' },
      { canExpired: true, expiredTime: config.jwt.refreshExpired },
    );

    return { accessToken, refreshToken };
  }
}

export default AuthService;
