
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('caca-palavras-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './script.js',
        './manifest.json',
        './icon-512.png',
        './click.wav',
        './ding.wav',
        './erro.wav',
        './tempo.wav'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
