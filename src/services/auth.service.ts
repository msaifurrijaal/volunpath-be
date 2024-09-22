import bcrypt from 'bcrypt';
import { z } from 'zod';
import { jwtSign } from '../helpers/jwt';
import config from '../config';
import UserRepository from '../repositories/user.repository';
import { JWTObject } from '../types/common';
import { Error400, Error401 } from '../errors/http.errors';
import { CreateUserOrganizationReq, CreateUserVolunteerReq } from '../types/apps/user.type';

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

    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error(`Validation Error: ${errorMessage}`);
    }

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

    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error(`Validation Error: ${errorMessage}`);
    }

    return this.userRepository.createUserOrganization(data);
  }
}

export default AuthService;
