// Comprueba si el backend (8080) y el frontend (4200) están corriendo
// Uso: node tools/estado-servidores.js
const objetivos = [
  { nombre: 'Backend  (Spring Boot)', url: 'http://localhost:8080/api/tasks' },
  { nombre: 'Frontend (Angular)    ', url: 'http://localhost:4200/' },
];

(async () => {
  console.log('=== ESTADO DE LOS SERVIDORES ===\n');
  for (const o of objetivos) {
    try {
      const c = new AbortController();
      setTimeout(() => c.abort(), 3000);
      const r = await fetch(o.url, { signal: c.signal });
      console.log(`✅ ${o.nombre} ACTIVO   → HTTP ${r.status}`);
    } catch {
      console.log(`❌ ${o.nombre} APAGADO  → ${o.url}`);
    }
  }
  console.log('\n(Backend: .\\mvnw.cmd spring-boot:run  ·  Frontend: ng serve)');
})();
