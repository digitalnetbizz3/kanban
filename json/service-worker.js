const CACHE_NAME = 'JSON_APP_CONTENT_V1.03';

const urlsToCache = [
    'index.html',
    'js/common.js',
    'js/json_handling.js',
    '../assets/logo.png',
    '../assets/kanban.png',
    '../assets/sequence.png',
    '../assets/flowchart.png',
    '../assets/json.png',
    '../assets/statetransition.png',
    '../assets/class.png', 
    '../js/json-url/json-url.js',
    '../js/json-url/json-url-lzstring.js',
    '../js/json-url/json-url-lzw.js',
    '../js/json-url/json-url-msgpack.js',
    '../js/json-url/json-url-safe64.js',
    '../js/json-url/json-url-single.js',
    '../js/json-url/json-url-vendors~lzma.js',
    '../js/json-url/json-url-vendors~msgpack.js',    
    'https://fonts.gstatic.com/s/opensans/v28/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVQUwaEQbjA.woff',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.7.4/jsoneditor.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.7.4/jsoneditor.min.js'
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
