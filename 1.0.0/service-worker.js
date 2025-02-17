const STATIC_CACHE = 'image-converter-static-v1';
const CONVERTED_CACHE = 'image-converter-converted-v1';

const staticAssets = [
    './index.html',
    './style.css',
    './script.js',
    './worker.js',
    'https://cdn.jsdelivr.net/npm/intro.js@7.2.0/minified/introjs.min.css',
    'https://cdn.jsdelivr.net/npm/intro.js@7.2.0/minified/intro.min.js',
    'https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(staticAssets);
            })
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle converted image caching
    if (event.request.method === 'POST' && url.searchParams.has('cache-converted')) {
        event.respondWith(handleConvertedImage(event.request));
        return;
    }

    // Handle static assets and other requests
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch(() => {
                console.log('Fetch failed, returning offline page');
                return caches.match('./index.html');
            })
    );
});

async function handleConvertedImage(request) {
    try {
        const formData = await request.formData();
        const imageBlob = formData.get('image');
        const format = formData.get('format');
        const quality = formData.get('quality');
        
        // Create cache key from image properties
        const cacheKey = `${await hashImage(imageBlob)}-${format}-${quality}`;
        
        // Check if we have a cached version
        const cache = await caches.open(CONVERTED_CACHE);
        const cachedResponse = await cache.match(cacheKey);
        
        if (cachedResponse) {
            console.log('Returning cached converted image');
            return cachedResponse;
        }

        // If not cached, return original response but cache it first
        const response = await fetch(request);
        cache.put(cacheKey, response.clone());
        return response;
    } catch (error) {
        console.error('Error handling converted image:', error);
        return new Response('Conversion failed', { status: 500 });
    }
}

async function hashImage(blob) {
    // Create a simple hash from the image content
    const buffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (![STATIC_CACHE, CONVERTED_CACHE].includes(cacheName)) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Claim clients so the service worker is in control immediately
            self.clients.claim()
        ])
    );
});
