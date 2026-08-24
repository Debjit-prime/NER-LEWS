/**
 * NER-LEWS: Unified Local Development Runner
 * Spawns both Backend (port 5001) and Frontend (port 5173) in one terminal.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('\n======================================================');
console.log('🚀 Starting NER-LEWS Full-Stack Development Environment');
console.log('======================================================\n');

// 1. Start Backend Express Server
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Vite Dev Server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

// Handle graceful termination
const cleanup = () => {
  console.log('\n[NER-LEWS] Stopping all dev servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
