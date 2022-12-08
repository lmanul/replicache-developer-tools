const port = chrome.runtime.connect({ name: 'bg-content' });

window.addEventListener("message", (event) => {
  // Only accept messages from our own window.
  if (event.source !== this) {
    console.log('Wrong source, discarding');
    return;
  }

  console.log('Content script: got message', event.data);
  port.postMessage({
    'event': 'sync-response',
    'data': event.data
  });
});
