/**
 * Rwanda Tech Learning Hub (RTLH) - Service Worker
 * Version: 1.0.0
 */

const CACHE_NAME = 'rtlh-cache-v1';

// Critical app shell assets to precache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/course.html',
    '/elibrary.html',
    '/terms.html',
    '/privacy.html',
    '/404.html',
    '/manifest.json',
    '/assets/js/rtlh/firebase.js'
];

// 1. Install Event: Pre-cache the core application shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[RTLH SW] Pre-caching core app shell...');
            return cache.addAll(PRECACHE_ASSETS);
        }).then(() => self.skipWaiting()) // Instantly activate new service worker
    );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[RTLH SW] Deleting legacy cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all pages immediately
    );
});

// 3. Fetch Event: Intercept network requests
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Only intercept GET requests (skip Firebase POST/auth requests)
    if (request.method !== 'GET') return;

    // Handle HTML Page Navigations (Network-first, fallback to Cache, then 404 page)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => {
                    return caches.match(request).then((cachedResponse) => {
                        return cachedResponse || caches.match('/404.html');
                    });
                })
        );
        return;
    }

    // Handle Static Assets (CSS, JS, Images, Fonts) - Cache-first with Network Fallback
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version and update cache in background
                fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
                    }
                }).catch(() => {/* Ignore network error if offline */});

                return cachedResponse;
            }

            // If not in cache, fetch from network and cache for next time
            return fetch(request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });

                return networkResponse;
            });
        })
    );
});