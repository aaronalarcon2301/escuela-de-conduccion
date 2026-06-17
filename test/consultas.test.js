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

test('GET /consultas devuelve todos los datos de la API y explicaciones claras', async () => {
  const child = spawn(process.execPath, ['src/index.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: '3102' },
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
    await waitForServer('http://127.0.0.1:3102/consultas');
    const response = await fetch('http://127.0.0.1:3102/consultas');
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.mensaje.includes('consulta') || body.mensaje.includes('respuesta'));
    assert.ok(body.datosCompletos);
    assert.ok(Array.isArray(body.requisitosEvaluacion));
    assert.equal(body.requisitosEvaluacion.length, 3);
    assert.equal(response.headers.get('x-contexto'), 'Gestión de la escuela de conducción');
  } finally {
    child.kill('SIGTERM');
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
});

test('GET /alumnos soporta filtros por nombre y /instructores por rut o email', async () => {
  const child = spawn(process.execPath, ['src/index.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: '3103' },
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
    await waitForServer('http://127.0.0.1:3103/alumnos');
    const alumnosResponse = await fetch('http://127.0.0.1:3103/alumnos?nombre=Carlos');
    const alumnos = await alumnosResponse.json();

    assert.equal(alumnosResponse.status, 200);
    assert.equal(alumnos.length, 1);
    assert.equal(alumnos[0].nombre, 'Carlos');
    assert.equal(alumnos[0].email, 'carlos@example.com');

    const instructoresResponse = await fetch('http://127.0.0.1:3103/instructores?rut=11111111-1');
    const instructores = await instructoresResponse.json();

    assert.equal(instructoresResponse.status, 200);
    assert.equal(instructores.length, 1);
    assert.equal(instructores[0].nombre, 'Daniel');
    assert.equal(instructores[0].email, 'daniel@example.com');
  } finally {
    child.kill('SIGTERM');
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
});
