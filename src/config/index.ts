import dotenv from 'dotenv';
import * as pkg from '../../package.json';

dotenv.config();

export type AppMode = 'prod' | 'dev';

export interface ConfigProps {
  name: string;
  description: string;
  version: string;
  mode?: AppMode;
  port: number;
  jwt: jwtProps;
  supabase: {
    url: string;
    key: string;
    bucketName: string;
  };
  smtpHost: string;
  smtpPort: number;
  smtpEmail: string;
  smtpAppPassword: string;
}

export interface jwtProps {
  keysPath?: string;
  expired?: string;
  refreshExpired?: string;
  privateKey: string;
  publicKey: string;
}

const config: ConfigProps = {
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,
  mode: process.env.NODE_ENV as AppMode,
  port: parseInt(process.env.PORT ?? '3000'),
  jwt: {
    keysPath: process.env.KEYS_PATH,
    expired: process.env.JWT_EXPIRED_TIME,
    refreshExpired: process.env.JWT_REFRESH_EXPIRED_TIME,
    get privateKey() {
      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('Private key is not defined in environment variables');
      }
      return privateKey.replace(/\\n/g, '\n');
    },
    get publicKey() {
      const publicKey = process.env.PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('Public key is not defined in environment variables');
      }
      return publicKey.replace(/\\n/g, '\n');
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
    bucketName: process.env.SUPABASE_BUCKET_NAME || '',
  },
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpEmail: process.env.SMTP_EMAIL || '',
  smtpAppPassword: process.env.SMTP_APP_PASSWORD || '',
};

export default config;
