module.exports = {
  apps: [
    {
      name: "robotrack-api",
      script: "./backend/server.js",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: 3010,
        JWT_SECRET: "super_secret_robotics_2026_bolt"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G"
    }
  ]
};
