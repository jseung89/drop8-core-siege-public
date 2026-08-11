module.exports = {
  apps: [
    {
      name: 'drop8-test',
      script: 'server/build/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || '2567',
        DROP8_TEST_CHEATS: process.env.DROP8_TEST_CHEATS || '0',
      },
    },
  ],
};
