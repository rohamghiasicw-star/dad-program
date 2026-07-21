/* Dad's Program service worker */
const CACHE='dad-v4';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const q=e.request; if(q.method!=='GET') return;
  const doc = q.mode==='navigate'||q.destination==='document'||(q.headers.get('accept')||'').includes('text/html');
  if(doc){ e.respondWith(fetch(q).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c)).catch(()=>{});return r;})
    .catch(()=>caches.match('./index.html').then(r=>r||caches.match('./')))); return; }
  e.respondWith(caches.match(q).then(c=>c||fetch(q).then(r=>{const cc=r.clone();caches.open(CACHE).then(x=>x.put(q,cc)).catch(()=>{});return r;}).catch(()=>c)));
});
