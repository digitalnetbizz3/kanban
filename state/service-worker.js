const CACHE_NAME = 'State_V1.04';

const urlsToCache = [
    'index.html',
    'js/state_vue_app.js',
    'js/state_handling.js',
    '../js/dom-to-image.min.js',
    '../js/vue.global.js',
    '../js/chooser.js',
    'css/dialog.css',
    'css/layout.css',
    'css/load.css',
    '../assets/menu.svg',
    '../assets/close.svg',
    '../assets/delete.svg',
    '../assets/edit.svg',
    '../assets/logo.svg',
    '../assets/settings.svg',
    '../assets/logo.png',
    '../assets/kanban.png',
    '../assets/sequence.png',
    '../assets/flowchart.png',
    '../assets/statetransition.png',
    'https://cdnjs.cloudflare.com/ajax/libs/mermaid/8.13.10/mermaid.min.js',
    'https://fonts.gstatic.com/s/opensans/v28/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVQUwaEQbjA.woff'
];

self.addEventListener('install', installer  => {
    console.log('Installing');

    self.skipWaiting();
    const done = async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.addAll(urlsToCache);
    };

    installer.waitUntil(done());
});

self.addEventListener('fetch', fetchEvent => {
    // respond to fetch request with a match from the cache
    // if not in cache, then request from network and cache
    // if there is a server error, show the offline page
    const url = fetchEvent.request.url;

    console.log(`Fetching: ${url}`);

    const getResponse = async (request) => {
        let response;

        response = await caches.match(request);
        if(response && response.status === 200) {
            console.log('File in cache. Returning cached version.');
            return response;
        }

        try {
            response = await fetch(request);
            if(response && response.status === 404) {
                return null;
            }
        } catch (e) {
            return null;
        }

        const clone = response.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(url, clone);
        return response;
    };

    fetchEvent.respondWith(getResponse(fetchEvent.request));
});

self.addEventListener('activate', activator => {
    console.log('Activating');

    const currentCaches = [CACHE_NAME];
    const done = async () => {
        const names = await caches.keys();
        return Promise.all(names.map(name => {
            if(!currentCaches.includes(name)) {
                return caches.delete(name);
            }
        }));
    };

    activator.waitUntil(done());
});
