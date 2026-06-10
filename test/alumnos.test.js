const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');

function waitForServer(url, timeoutMs = 10000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      fetch(url)
        .then(() => resolve())
        .catch(() => {
          if (Date.now() - startedAt > timeoutMs) {
            reject(new Error(`El servidor no respondió en ${timeoutMs} ms`));
            return;
          }
          setTimeout(attempt, 200);
        });
    };

    attempt();
  });
}

test('GET /alumnos/:id devuelve un alumno existente', async () => {
  const child = spawn(process.execPath, ['src/index.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: '3101' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer('http://127.0.0.1:3101/alumnos');
    const response = await fetch('http://127.0.0.1:3101/alumnos/1');
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.id, 1);
    assert.equal(body.nombre, 'Carlos');
  } finally {
    child.kill('SIGTERM');
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
});
