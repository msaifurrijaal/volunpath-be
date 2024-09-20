import dotenv from 'dotenv';

dotenv.config();

export type AppMode = 'prod' | 'dev';

export interface ConfigProps {
  mode?: AppMode;
  port: number;
}

const config: ConfigProps = {
    mode: process.env.NODE_ENV as AppMode,
    port: parseInt(process.env.PORT ?? '3000'),
}

export default config;