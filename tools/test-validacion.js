// Verifica que la validación del título devuelva 400 (y no 500)
// Uso: node tools/test-validacion.js
const API = 'http://localhost:8080/api/tasks';

async function probar(titulo, cuerpo, esperado, descripcion) {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  const texto = await r.text();
  const ok = esperado.includes(r.status) ? '✅' : '❌';
  console.log(`${ok} ${descripcion}`);
  console.log(`   Esperado: ${esperado.join('/')} → Obtenido: HTTP ${r.status}`);
  if (r.status >= 400) console.log(`   Mensaje: ${texto.slice(0, 220)}`);
  console.log('');
  return r.status;
}

(async () => {
  console.log('=== PRUEBAS DE VALIDACIÓN ===\n');

  await probar('sin title', { description: 'solo descripcion' }, [400],
    '1. POST sin "title" (antes daba 500)');

  await probar('title vacío', { title: '', description: 'x' }, [400],
    '2. POST con title = "" (vacío)');

  await probar('title con espacios', { title: '     ', description: 'x' }, [400],
    '3. POST con title = "     " (solo espacios)');

  await probar('title normal', { title: 'Tarea válida ' + Date.now(), description: 'ok' }, [201],
    '4. POST con title válido');

  await probar('title larguísimo', { title: 'x'.repeat(250) }, [400],
    '5. POST con title de 250 caracteres (máx 200)');

  console.log('=== FIN ===');
})().catch((e) => {
  console.error('❌ ERROR: ¿está el backend corriendo?', e.message);
  process.exit(1);
});
