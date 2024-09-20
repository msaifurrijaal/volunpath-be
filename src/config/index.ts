import dotenv from 'dotenv';
import path from 'path';
import { readFileSync } from 'fs';

dotenv.config();

export type AppMode = 'prod' | 'dev';

export interface ConfigProps {
  mode?: AppMode;
  port: number;
  jwt: jwtProps;
}

export interface jwtProps {
  keysPath?: string;
  expired?: string;
  refreshExpired?: string;
  privateKey: Buffer;
  publicKey: Buffer;
}

const config: ConfigProps = {
  mode: process.env.NODE_ENV as AppMode,
  port: parseInt(process.env.PORT ?? '3000'),
  jwt: {
    keysPath: process.env.KEYS_PATH,
    expired: process.env.JWT_EXPIRED_TIME,
    refreshExpired: process.env.JWT_REFRESH_EXPIRED_TIME,
    get privateKey() {
      const privateKeyPath: string = path.join(this.keysPath!, 'private.key');
      return readFileSync(privateKeyPath);
    },
    get publicKey() {
      const publicKeyPath: string = path.join(this.keysPath!, 'public.key');
      return readFileSync(publicKeyPath);
    },
  },
};

export default config;
