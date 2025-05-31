import fs from 'fs';
import * as path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  
  // Check if we're in production (DO) vs local
  const isProduction = env('NODE_ENV') === 'production' || env('APP_ENV') === 'production';
  
  console.log('=== DATABASE DEBUG INFO ===');
  console.log('NODE_ENV:', env('NODE_ENV'));
  console.log('APP_ENV:', env('APP_ENV'));
  console.log('isProduction:', isProduction);
  console.log('DATABASE_CLIENT:', client);
  console.log('DATABASE_SSL enabled:', env.bool('DATABASE_SSL', false));
  
  if (client === 'postgres') {
    console.log('DATABASE_HOST:', env('DATABASE_HOST', 'localhost'));
    console.log('DATABASE_PORT:', env.int('DATABASE_PORT', 5432));
    console.log('DATABASE_NAME:', env('DATABASE_NAME', 'strapi'));
    console.log('DATABASE_USERNAME:', env('DATABASE_USERNAME', 'strapi'));
    console.log('DATABASE_URL provided:', !!env('DATABASE_URL'));
    
    if (env.bool('DATABASE_SSL', false)) {
      const certPath = path.join(__dirname, '..', '..', 'ca_cert.cert');
      console.log('Certificate path:', certPath);
      console.log('Certificate exists:', fs.existsSync(certPath));
      
      if (fs.existsSync(certPath)) {
        const cert = fs.readFileSync(certPath).toString();
        console.log('Certificate length:', cert.length);
        console.log('Certificate preview:', cert.substring(0, 100) + '...');
      }
      
      console.log('SSL rejectUnauthorized will be:', isProduction ? false : env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true));
    }
  }
  console.log('=== END DEBUG INFO ===');
  
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
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          // For managed databases, often need more lenient settings
          rejectUnauthorized: isProduction ? false : env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          ca: fs.readFileSync(path.join(__dirname, '..', '..', 'ca_cert.cert')).toString(),
          // Remove capath as it's not needed when ca is provided
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

  const finalConfig = {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
  
  if (client === 'postgres' && env.bool('DATABASE_SSL', false)) {
    console.log('=== FINAL SSL CONFIG ===');
    console.log('SSL object:', JSON.stringify(finalConfig.connection.ssl, null, 2));
    console.log('=== END SSL CONFIG ===');
  }
  
  return finalConfig;
};
