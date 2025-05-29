module.exports = {
  apps: [
    {
      name: 'zuny-real-estate-backend',
      script: './node_modules/.bin/strapi',
      args: 'start',
      cwd: './backend',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        DATABASE_CLIENT: 'sqlite',
        DATABASE_FILENAME: '.tmp/data.db',
        HOST: '0.0.0.0',
        PORT: 1337,
      },
    },
  ],
}; 