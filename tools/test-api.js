// Prueba automática de la API del Task Tracker (usa el fetch nativo de Node 18+)
// Uso: node tools/test-api.js
const BASE = 'http://localhost:8080/api/tasks';

async function pedir(metodo, url, cuerpo) {
  const opciones = { method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (cuerpo) opciones.body = JSON.stringify(cuerpo);
  const r = await fetch(url, opciones);
  let datos = null;
  const texto = await r.text();
  if (texto) { try { datos = JSON.parse(texto); } catch { datos = texto; } }
  return { status: r.status, datos };
}

function mostrar(titulo, esperado, resultado) {
  const ok = esperado.includes(resultado.status) ? '✅' : '❌';
  console.log(`${ok} ${titulo} → HTTP ${resultado.status} (esperado: ${esperado.join('/')})`);
  if (resultado.datos) console.log(`   ${JSON.stringify(resultado.datos)}`);
}

(async () => {
  console.log('=== PRUEBA DE LA API TASK TRACKER ===\n');

  mostrar('1. GET lista (vacía al arrancar)', [200], await pedir('GET', BASE));

  const creada = await pedir('POST', BASE, { title: 'Comprar pan', description: 'Pan integral' });
  mostrar('2. POST crear tarea', [201], creada);

  mostrar('3. POST duplicado exacto (409 esperado)', [409],
    await pedir('POST', BASE, { title: 'Comprar pan', description: 'Otra vez' }));

  mostrar('4. POST duplicado con espacios/mayúsculas', [409],
    await pedir('POST', BASE, { title: '  comprar PAN  ' }));

  const id = creada.datos?.id;
  if (id) {
    mostrar('5. GET por id', [200], await pedir('GET', `${BASE}/${id}`));
    mostrar('6. PUT actualizar', [200],
      await pedir('PUT', `${BASE}/${id}`, { title: 'Comprar pan y leche', description: 'Integral' }));
    mostrar('7. GET id inexistente', [404], await pedir('GET', `${BASE}/99999`));
    mostrar('8. DELETE', [204], await pedir('DELETE', `${BASE}/${id}`));
    mostrar('9. DELETE otra vez (ya no existe)', [404], await pedir('DELETE', `${BASE}/${id}`));
  } else {
    console.log('⚠️  No se obtuvo id de la tarea creada; se saltan las pruebas 5-9');
  }

  mostrar('10. GET lista final', [200], await pedir('GET', BASE));
  console.log('\n=== FIN DE LAS PRUEBAS ===');
})().catch((e) => {
  console.error('❌ ERROR: ¿está el backend corriendo en el puerto 8080?');
  console.error(e.message);
  process.exit(1);
});
