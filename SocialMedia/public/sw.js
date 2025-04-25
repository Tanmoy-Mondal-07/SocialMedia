const cacheName = 'utlity-cache-v1'

const cacheAssets = [
    '../index.html',
    '../src/utils/timeStamp.js',
    '../src/utils/getProfilesThroughache.js',
    '../src/utils/userProfileCache.js',
    '../src/component/footer/Footer.jsx',
    '../src/component/header/Header.jsx',
]

self.addEventListener('install', (e) => {
    // console.log('service worker installed');

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                // console.log('from sw caching');
                cache.addAll(cacheAssets)
            })
            .then(() => self.skipWaiting())
    )
});

self.addEventListener('activate', (e) => {
    // console.log('service worker activated');

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        // console.log('sw clearing old cache');
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
});

self.addEventListener('fetch', (e) => {
    // console.log('sw fetching');
    e.respondWith(
        fetch(e.request)
            .catch(() => caches.match(e.request))
    )
})


// const cacheName = 'v2'

// self.addEventListener('install', (e) => {
//     console.log('service worker installed');
// });

// self.addEventListener('activate', (e) => {
//     console.log('service worker activated');

//     e.waitUntil(
//         caches.keys().then(cacheNames => {
//             return Promise.all(
//                 cacheNames.map(cache => {
//                     if (cache !== cacheName) {
//                         console.log('sw clearing old cache');
//                         return caches.delete(cache)
//                     }
//                 })
//             )
//         })
//     )
// });

// self.addEventListener('fetch', (e) => {
//     console.log('sw fetching');
//     e.respondWith(
//         fetch(e.request)
//             .then(res => {
//                 const resClone = res.clone();
//                 caches
//                     .open(cacheName)
//                     .then(cache => {
//                         cache.put(e.request, resClone)
//                     });
//                 return res
//             })
//             .catch(err => caches.match(e.request).then(res => res))
//     )
// })