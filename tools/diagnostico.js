// Diagnóstico: backend, CORS y frontend
// Uso: node tools/diagnostico.js
(async () => {
  console.log('=== DIAGNÓSTICO ===\n');

  // 1. ¿Backend responde?
  let backendOk = false;
  try {
    const r = await fetch('http://localhost:8080/api/tasks');
    const t = await r.text();
    backendOk = true;
    console.log(`1. Backend 8080        ✅ HTTP ${r.status} → ${t.slice(0, 80)}`);
  } catch (e) {
    console.log(`1. Backend 8080        ❌ APAGADO (${e.message})`);
  }

  // 2. ¿CORS permite a Angular?
  if (backendOk) {
    try {
      const r = await fetch('http://localhost:8080/api/tasks', {
        headers: { Origin: 'http://localhost:4200' },
      });
      const acao = r.headers.get('access-control-allow-origin');
      console.log(`2. CORS (Origin 4200)  ${acao ? '✅' : '⚠️ '} access-control-allow-origin: ${acao ?? 'NO VIENE (falta cabecera)'}`);
    } catch (e) {
      console.log(`2. CORS                ❌ ${e.message}`);
    }
  }

  // 3. ¿En qué puerto está el frontend?
  for (const puerto of [4200, 4201, 4202, 4300]) {
    try {
      const c = new AbortController();
      setTimeout(() => c.abort(), 2000);
      const r = await fetch(`http://localhost:${puerto}/`, { signal: c.signal });
      if (r.ok) console.log(`3. Frontend ${puerto}       ✅ ACTIVO (¡abre ESTE puerto en el navegador!)`);
    } catch { /* apagado */ }
  }

  console.log('\n=== FIN ===');
})().catch((e) => console.error('ERROR:', e.message));
