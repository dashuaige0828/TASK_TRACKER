// Helper de descarga con Node.js (sigue redirecciones, muestra progreso)
// Uso: node download.js <url> <archivo_destino>
const https = require('https');
const fs = require('fs');

function download(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      const status = res.statusCode;
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        console.log(`[redirect ${redirects + 1}] -> ${res.headers.location}`);
        if (redirects >= 10) return reject(new Error('Demasiadas redirecciones'));
        return resolve(download(res.headers.location, dest, redirects + 1));
      }
      if (status !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${status} para ${url}`));
      }
      const mb = res.headers['content-length'] ? Math.round(res.headers['content-length'] / 1048576) : '?';
      console.log(`Descargando ${url}`);
      console.log(`  -> ${dest} (${mb} MB aprox.)`);
      const file = fs.createWriteStream(dest);
      let bytes = 0;
      const started = Date.now();
      res.on('data', (chunk) => {
        bytes += chunk.length;
        const secs = (Date.now() - started) / 1000;
        const rate = secs > 0 ? (bytes / 1048576 / secs).toFixed(1) : '?';
        process.stdout.write(`\r  ${(bytes / 1048576).toFixed(1)} MB  @ ${rate} MB/s   `);
      });
      res.pipe(file);
      file.on('finish', () => { process.stdout.write('\n'); file.close(() => resolve(dest)); });
      file.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(60000, () => req.destroy(new Error('Timeout de descarga')));
  });
}

const [url, dest] = process.argv.slice(2);
if (!url || !dest) { console.error('Uso: node download.js <url> <dest>'); process.exit(1); }

download(url, dest)
  .then(() => { console.log('OK'); })
  .catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
