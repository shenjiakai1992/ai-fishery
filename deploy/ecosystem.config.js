// deploy/ecosystem.config.js — PM2 进程配置
module.exports = {
  apps: [
    {
      name: "ai-fishery",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/ai-fishery",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/pm2/ai-fishery-error.log",
      out_file: "/var/log/pm2/ai-fishery-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
