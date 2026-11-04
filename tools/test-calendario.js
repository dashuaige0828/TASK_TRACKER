// Verifica el filtro por fecha: GET /api/tasks?fecha=YYYY-MM-DD
// Uso: node tools/test-calendario.js
const API = 'http://localhost:8080/api/tasks';

const hoy = new Date();
const iso = (d) => d.toISOString().slice(0, 10); // yyyy-MM-dd
const manana = new Date(hoy.getTime() + 86400000);
const pasado = new Date(hoy.getTime() + 2 * 86400000);

async function crear(titulo, dueDate) {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: titulo, description: 'prueba', dueDate }),
  });
  const ok = r.status === 201;
  console.log(`${ok ? '✅' : '❌'} POST "${titulo}" (dueDate: ${dueDate ?? 'null'}) → HTTP ${r.status}`);
  return ok ? await r.json() : null;
}

async function listar(query = '') {
  const r = await fetch(API + query);
  const lista = await r.json();
  return { status: r.status, lista };
}

(async () => {
  console.log('=== PRUEBAS DEL CALENDARIO (filtro por fecha) ===\n');

  const t1 = await crear('Tarea de hoy ' + Date.now(), iso(hoy));
  const t2 = await crear('Tarea de mañana ' + Date.now(), iso(manana));
  const t3 = await crear('Tarea sin fecha ' + Date.now(), null);

  console.log('');

  const todas = await listar();
  console.log(`📋 GET /api/tasks → ${todas.lista.length} tareas (debe incluir las 3)`);

  const deHoy = await listar('?fecha=' + iso(hoy));
  const soloHoy = deHoy.lista.every((t) => t.dueDate === iso(hoy));
  console.log(`${deHoy.lista.length >= 1 && soloHoy ? '✅' : '❌'} GET ?fecha=${iso(hoy)} → ${deHoy.lista.length} tarea(s), todas de esa fecha`);

  const deManana = await listar('?fecha=' + iso(manana));
  console.log(`${deManana.lista.length >= 1 ? '✅' : '❌'} GET ?fecha=${iso(manana)} → ${deManana.lista.length} tarea(s)`);

  const sinDatos = await listar('?fecha=' + iso(pasado));
  console.log(`${sinDatos.lista.length === 0 ? '✅' : '❌'} GET ?fecha=${iso(pasado)} (día vacío) → ${sinDatos.lista.length} tarea(s)`);

  // PUT debe conservar la fecha
  if (t1) {
    const r = await fetch(`${API}/${t1.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t1.title + ' (editada)', description: 'x', dueDate: t1.dueDate }),
    });
    const editada = await r.json();
    console.log(`${r.status === 200 && editada.dueDate === t1.dueDate ? '✅' : '❌'} PUT conserva dueDate → ${editada.dueDate}`);
  }

  // limpieza
  for (const t of [t1, t2, t3]) if (t?.id) await fetch(`${API}/${t.id}`, { method: 'DELETE' });
  console.log('\n🧹 Tareas de prueba eliminadas. === FIN ===');
})().catch((e) => {
  console.error('❌ ERROR: ¿está el backend corriendo?', e.message);
  process.exit(1);
});
