self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('caca-palavras-v1').then(cache => {
      return cache.addAll([
        '/casa-palavras/',
        '/casa-palavras/index.html',
        '/casa-palavras/style.css',
        '/casa-palavras/script.js',
        '/casa-palavras/manifest.json',
        '/casa-palavras/icon-512.png',
        '/casa-palavras/ding.wav',
        '/casa-palavras/erro.wav',
        '/casa-palavras/tempo.wav'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
