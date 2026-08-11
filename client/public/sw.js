self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',(event)=>event.waitUntil(self.clients.claim()));

// Keep live game builds network-owned so a service worker never serves stale combat code.
self.addEventListener('fetch',()=>{});
