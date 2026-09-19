const CACHE_NAME = 'flappy-bee-space-v1';
// Daftar file yang wajib disimpan di dalam HP agar bisa dibuka offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. Tahap Instalasi: Menyimpan semua file ke dalam cache HP
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Membuka cache dan menyimpan aset game...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Tahap Aktivasi: Menghapus cache versi lama jika kamu memperbarui game
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('PWA: Menghapus cache lama yang tidak terpakai...');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Tahap Fetch: Mengambil file dari cache HP jika tidak ada koneksi internet (Offline Mode)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika file ada di cache, pakai file dari cache. Jika tidak, ambil dari internet.
      return response || fetch(event.request).catch(() => {
        // Jika internet mati total dan file tidak ada di cache, berikan fallback ke index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
