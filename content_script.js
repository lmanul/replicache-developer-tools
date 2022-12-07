console.log('I am the ad-hoc content script');

console.log('This is the content script. Window is', window);
window.addEventListener("message", (event) => {
  // Only accept messages from our own window.
  if (event.source !== this) {
    console.log('Wrong source, discarding');
    return;
  }

  console.log('Got message', event.data);
});
