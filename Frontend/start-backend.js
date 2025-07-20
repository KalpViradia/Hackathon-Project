const { spawn } = require('child_process');
const path = require('path');

// Start the backend server
const backendPath = path.join(__dirname, '..', 'Backend');
const backend = spawn('npm', ['start'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

backend.on('error', (error) => {
  console.error('Failed to start backend:', error);
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

console.log('Starting backend server...');