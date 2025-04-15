const CACHE_NAME = 'site-cache-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
  console.log('[SW] Installed')
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated')
  // Optional: Clean old caches here
})

self.addEventListener('fetch', (event) => {
  // Only handle GET requests (ignore POST, etc.)
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // Optionally store response in cache
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone)
        })
        return response
      }).catch(() => {
        // Fallback for offline?
        return new Response('Offline or failed', { status: 503 })
      })
    })
  )
})
