self.addEventListener('fetch', function(event) {
  // TODO: only respond to requests with a
  // url ending in ".jpg"
  console.log(event.request);
  if(event.request.url.endsWith('.jpg')) {
    event.respondWith(
      fetch('/imgs/dr-evil.gif')
    );
  }
});
