import config from '../config';
import jwt from 'jsonwebtoken';

export const jwtSign = (
  payload: any,
  { canExpired, expiredTime }: { canExpired: boolean; expiredTime?: string },
) => {
  const { expired, privateKey } = config.jwt;

  const signOptions: any = {
    issuer: 'MS19',
    algorithm: 'RS256',
  };

  if (canExpired) {
    signOptions.expiresIn = parseInt(expiredTime ?? expired!);
  }
  console.log(config.jwt.privateKey);
  return jwt.sign(payload, privateKey, signOptions);
};

export const jwtVerify = (token: string) => {
  const { publicKey } = config.jwt;
  const verifyOptions = {
    issuer: 'MS19',
    algorithm: ['RS256'],
  };

  return jwt.verify(token, publicKey, verifyOptions);
};
