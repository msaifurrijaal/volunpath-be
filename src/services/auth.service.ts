import bcrypt from 'bcrypt';
import { z } from 'zod';
import { jwtSign, jwtVerify } from '../helpers/jwt';
import config from '../config';
import UserRepository from '../repositories/user.repository';
import { JWTObject } from '../types/common';
import { Error401 } from '../errors/http.errors';
import { CreateUserOrganizationReq, CreateUserVolunteerReq } from '../types/apps/user.type';
import { JwtPayload } from 'jsonwebtoken';
import { validateSchema } from '../helpers/validateSchema';

export class AuthService {
  name = 'authService';
  userRepository: UserRepository;

  constructor(ctx: { repositories: { userRepository: UserRepository } }) {
    this.userRepository = ctx.repositories.userRepository;
  }

  async login(email: string, password: string) {
    const schema = z.object({
      email: z
        .string({ message: 'Email is required!' })
        .email({ message: 'Invalid email format!' }),
      password: z
        .string({
          message: 'Password is required!',
        })
        .min(1, { message: 'Password is required!' }),
    });

    validateSchema(schema, { email, password });

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

  async refreshToken(refreshToken: string) {
    const schema = z.object({
      refreshToken: z
        .string({
          message: 'Refresh token is required!',
        })
        .min(1, { message: 'Refresh token is required!' }),
    });

    validateSchema(schema, { refreshToken });

    let decodedJwt: JwtPayload;

    try {
      decodedJwt = jwtVerify(refreshToken) as JwtPayload;
    } catch (error) {
      throw new Error401({ message: 'Invalid refresh token' });
    }

    if (decodedJwt.type !== 'refresh_token') {
      throw new Error401({ message: 'Invalid refresh token' });
    }

    const user = await this.userRepository.findUserById(decodedJwt.id);

    if (!user) {
      throw new Error401({ message: 'Invalid refresh token' });
    }

    return {
      ...(await this.generateTokens({
        id: user.id,
        roleId: user.role.id,
      })),
    };
  }

  async registerVolunteerUser(data: CreateUserVolunteerReq) {
    const schema = z.object({
      username: z.string().min(3, { message: 'Username must be at least 3 characters long.' }),
      email: z.string().email({ message: 'Invalid email format!' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
      fullname: z.string().min(1, { message: 'Fullname is required.' }),
      phone: z.string().optional(),
      volunteerDetail: z.object({
        educationId: z.number(),
        otherDetails: z.string().optional(),
        address: z.string().optional(),
        provinceId: z.number().optional(),
        regencyId: z.number().optional(),
      }),
    });

    validateSchema(schema, data);

    return this.userRepository.createUserVolunteer(data);
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

  async registerOrganizationUser(data: CreateUserOrganizationReq) {
    const schema = z.object({
      username: z.string().min(3, { message: 'Username must be at least 3 characters long.' }),
      email: z.string().email({ message: 'Invalid email format!' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
      fullname: z.string().min(1, { message: 'Fullname is required.' }),
      phone: z.string().optional(),
      organizationDetail: z.object({
        name: z.string().max(255, { message: 'Name must be at most 255 characters long.' }),
        address: z.string().optional(),
        provinceId: z.number().optional(),
        regencyId: z.number().optional(),
        description: z
          .string()
          .max(900, { message: 'Description must be at most 900 characters long.' }),
        categoryOrganizationId: z.number(),
      }),
    });

    validateSchema(schema, data);

    return this.userRepository.createUserOrganization(data);
  }
}

export default AuthService;
