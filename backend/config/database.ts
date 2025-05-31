import fs from 'fs';
import * as path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  
  // Check if we're in production (DO) vs local
  const isProduction = env('NODE_ENV') === 'production' || env('APP_ENV') === 'production';
  
  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: false
        },
      },
    },
    postgres: {
      connection: {
        ...(env('DATABASE_URL') 
          ? { connectionString: env('DATABASE_URL') }
          : {
              host: env('DATABASE_HOST', 'localhost'),
              port: env.int('DATABASE_PORT', 5432),
              database: env('DATABASE_NAME', 'strapi'),
              user: env('DATABASE_USERNAME', 'strapi'),
              password: env('DATABASE_PASSWORD', 'strapi'),
            }
        ),
        ssl: env.bool('DATABASE_SSL', false) && {
          // For managed databases, often need more lenient settings
          rejectUnauthorized: isProduction ? false : env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          ca: env('DATABASE_SSL_CA', undefined),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
