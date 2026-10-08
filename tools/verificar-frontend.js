// Verifica que el frontend esté sirviendo y crea 2 tareas de ejemplo
// Uso: node tools/verificar-frontend.js
const FRONTEND = 'http://localhost:4200/';
const API = 'http://localhost:8080/api/tasks';

(async () => {
  console.log('=== VERIFICACIÓN DEL FRONTEND ===\n');

  // 1. ¿El dev server responde?
  try {
    const r = await fetch(FRONTEND);
    const html = await r.text();
    const tieneRoot = html.includes('<app-root>');
    console.log(`${r.ok ? '✅' : '❌'} Frontend responde HTTP ${r.status}`);
    console.log(`${tieneRoot ? '✅' : '❌'} El HTML contiene <app-root> (Angular puede arrancar)`);
  } catch (e) {
    console.log(`❌ No responde el frontend: ${e.message}`);
    process.exit(1);
  }

  // 2. Crear tareas de ejemplo (para verlas en pantalla)
  console.log('\n=== CREANDO TAREAS DE EJEMPLO ===');
  const ejemplos = [
    { title: 'Comprar pan', description: 'Pan integral del supermercado' },
    { title: 'Estudiar Spring Boot', description: 'Repasar el ciclo de vida de un bean' },
  ];
  for (const t of ejemplos) {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
    const datos = await r.json().catch(() => null);
    console.log(`${r.status === 201 ? '✅' : '❌'} POST "${t.title}" → HTTP ${r.status}`);
  }

  // 3. Lista final
  const finales = await (await fetch(API)).json();
  console.log(`\n📋 Tareas en la base de datos: ${finales.length}`);
  finales.forEach((t) => console.log(`   #${t.id} ${t.title} — ${t.description ?? '(sin descripción)'}`));

  console.log('\n👉 Abre http://localhost:4200 en el navegador para verlas');
})().catch((e) => { console.error('❌ ERROR:', e.message); process.exit(1); });
