// Diagnóstico de Swagger y del endpoint POST
// Uso: node tools/diagnostico-swagger.js
(async () => {
  console.log('=== 1. POST /api/tasks (con JSON válido) ===');
  try {
    const r = await fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Prueba desde Node ' + Date.now(), description: 'test' }),
    });
    const txt = await r.text();
    console.log(`HTTP ${r.status} → ${txt}`);
  } catch (e) { console.log(`ERROR: ${e.message}`); }

  console.log('\n=== 2. POST sin título (¿qué responde el backend?) ===');
  try {
    const r = await fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'sin titulo' }),
    });
    const txt = await r.text();
    console.log(`HTTP ${r.status} → ${txt.slice(0, 300)}`);
  } catch (e) { console.log(`ERROR: ${e.message}`); }

  console.log('\n=== 3. Endpoints que Swagger detecta (/v3/api-docs) ===');
  try {
    const doc = await (await fetch('http://localhost:8080/v3/api-docs')).json();
    console.log(`OpenAPI version: ${doc.openapi} · título: ${doc.info?.title}`);
    for (const [ruta, metodos] of Object.entries(doc.paths ?? {})) {
      console.log(`  ${ruta}: ${Object.keys(metodos).join(', ').toUpperCase()}`);
    }
    const esquemas = Object.keys(doc.components?.schemas ?? {});
    console.log(`  Esquemas: ${esquemas.join(', ') || '(ninguno)'}`);
  } catch (e) { console.log(`ERROR: ${e.message}`); }
})();
