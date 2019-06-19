module.exports = {
    apps: [{
      name: 'mysiloam-frontend',
      script: './dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      out_file: '/dev/null',
      error_file: '/dev/null',
      max_size: '3M',
      retain: '3',
      compress: true,
      dateFormat: 'YYYY-MM-DD_HH-mm-ss',
      workerInterval: '30',
      rotateInterval: '0 0 * * *',
      rotateModule: true,
    }],
  };