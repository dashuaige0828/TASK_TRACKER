// Prueba la feature de estados (PENDIENTE / EN_PROGRESO / COMPLETADA)
// Uso: node tools/test-estados.js
const API = 'http://localhost:8080/api/tasks';

async function pedir(metodo, url, cuerpo) {
  const opciones = { method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (cuerpo) opciones.body = JSON.stringify(cuerpo);
  const r = await fetch(url, opciones);
  const texto = await r.text();
  let datos = null;
  try { datos = texto ? JSON.parse(texto) : null; } catch { datos = texto; }
  return { status: r.status, datos };
}

function check(nombre, esperado, resultado, condicion) {
  const okStatus = esperado.includes(resultado.status);
  const okExtra = condicion ? condicion(resultado.datos) : true;
  console.log(`${okStatus && okExtra ? '✅' : '❌'} ${nombre} → HTTP ${resultado.status} (esperado ${esperado.join('/')})`);
  return okStatus && okExtra;
}

(async () => {
  console.log('=== PRUEBAS DE ESTADOS ===\n');

  // 1. Crear sin estado → debe ser PENDIENTE por defecto
  const creada = await pedir('POST', API, { title: 'Tarea de prueba estados ' + Date.now(), dueDate: new Date().toISOString().slice(0, 10) });
  check('1. POST sin status → PENDIENTE por defecto', [201], creada, (d) => d?.status === 'PENDIENTE');
  console.log(`   status: ${creada.datos?.status}`);
  const id = creada.datos?.id;

  if (!id) { console.log('⚠️ sin id; aborto'); return; }

  // 2. Cambiar a EN_PROGRESO
  const enProgreso = await pedir('PUT', `${API}/${id}/estado?estado=EN_PROGRESO`);
  check('2. PUT /{id}/estado?estado=EN_PROGRESO', [200], enProgreso, (d) => d?.status === 'EN_PROGRESO');
  console.log(`   status: ${enProgreso.datos?.status}`);

  // 3. Cambiar a COMPLETADA
  const completada = await pedir('PUT', `${API}/${id}/estado?estado=COMPLETADA`);
  check('3. PUT /{id}/estado?estado=COMPLETADA', [200], completada, (d) => d?.status === 'COMPLETADA');

  // 4. Estado inválido → 400
  const invalido = await pedir('PUT', `${API}/${id}/estado?estado=VOLANDO`);
  check('4. Estado inválido → 400', [400], invalido);

  // 5. Actualización completa sin status → conserva COMPLETADA
  const update = await pedir('PUT', `${API}/${id}`, { title: creada.datos.title + ' (editada)', dueDate: creada.datos.dueDate });
  check('5. PUT completo sin status → conserva COMPLETADA', [200], update, (d) => d?.status === 'COMPLETADA');

  // 6. GET lo confirma
  const get = await pedir('GET', `${API}/${id}`);
  check('6. GET devuelve el estado', [200], get, (d) => d?.status === 'COMPLETADA');

  // limpieza
  await pedir('DELETE', `${API}/${id}`);
  console.log('\n🧹 Tarea de prueba eliminada. === FIN ===');
})().catch((e) => { console.error('❌ ERROR: ¿backend arrancado?', e.message); process.exit(1); });
