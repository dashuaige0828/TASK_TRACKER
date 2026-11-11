// Crea tareas de ejemplo con fecha para ver el calendario poblado
// Uso: node tools/seed-calendario.js
const API = 'http://localhost:8080/api/tasks';

const hoy = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const enDias = (n) => { const d = new Date(hoy); d.setDate(d.getDate() + n); return iso(d); };

const ejemplos = [
  { title: 'Comprar pan', description: 'Pan integral', dueDate: iso(hoy) },
  { title: 'Estudiar Spring Boot', description: 'Repasar el calendario', dueDate: iso(hoy) },
  { title: 'Reunión con el equipo', description: 'Sincronización semanal', dueDate: enDias(1) },
  { title: 'Pagar la luz', description: 'Factura del mes', dueDate: enDias(3) },
  { title: 'Llamar al fontanero', description: 'Revisar la fuga', dueDate: enDias(7) },
];

(async () => {
  console.log('=== CREANDO TAREAS DE EJEMPLO ===\n');
  for (const t of ejemplos) {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
    const datos = await r.json().catch(() => null);
    const ok = r.status === 201 || r.status === 409;
    console.log(`${ok ? '✅' : '❌'} "${t.title}" (${t.dueDate}) → HTTP ${r.status}${r.status === 409 ? ' (ya existía)' : ''}`);
  }

  const todas = await (await fetch(API)).json();
  console.log(`\n📋 Total de tareas: ${todas.length}`);
  console.log('👉 Abre http://localhost:4200 y pulsa un día del calendario');
})().catch((e) => { console.error('❌ ERROR: ¿backend arrancado?', e.message); process.exit(1); });
