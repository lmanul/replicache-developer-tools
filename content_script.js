console.log('This is the content script. Window is', window);
window.addEventListener("message", (event) => {
  // Only accept messages from our own window.
  if (event.source !== this) {
    console.log('Wrong source, discarding');
    return;
  }

  console.log('Content script: got message', event.data);
});
