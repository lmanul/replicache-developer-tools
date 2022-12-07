console.log('Installing hook');
// Looks like the Replicache object isn't quite ready yet when this
// runs. Just do a timeout for now.
window.setTimeout(() => {
  console.log(window.__replicache);
}, 1000);
