import { config } from 'dotenv';

config();

interface Env {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  ANTHROPIC_API_KEY: string;
  OPENAI_API_KEY: string;
  STORAGE_PROVIDER: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_S3_BUCKET: string;
  WEB_URL: string;
  MOBILE_APP_SCHEME: string;
  SENTRY_DSN?: string;
}

function getEnv(): Env {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL!,
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 's3',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
    WEB_URL: process.env.WEB_URL || 'http://localhost:5173',
    MOBILE_APP_SCHEME: process.env.MOBILE_APP_SCHEME || 'fitlife://',
    SENTRY_DSN: process.env.SENTRY_DSN,
  };
}

export const env = getEnv();
