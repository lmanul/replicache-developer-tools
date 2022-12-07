const REPLICACHE_OBJECT_PROPERTY_NAME = '__replicache';
const DELAY_BETWEEN_ATTEMPTS_SECONDS = 1;
const MAX_ATTEMPTS = 3;
let attempts = 0;

const installHook = (onChangeCallback) => {
  if (attempts >= MAX_ATTEMPTS) {
    console.log('Reached maximum number of attempts, bailing out.');
    return;
  }
  attempts++;
  if (!!window[REPLICACHE_OBJECT_PROPERTY_NAME]) {
    console.log('Replicache object is', window[REPLICACHE_OBJECT_PROPERTY_NAME]);
    window[REPLICACHE_OBJECT_PROPERTY_NAME].experimentalWatch(evt => {
      console.log('Update from Replicache. Posting message to', window);
      window.postMessage(evt);
    });
  } else {
    console.log('Replicache object not available yet, retrying in ' +
        DELAY_BETWEEN_ATTEMPTS_SECONDS + ' second(s)...');
    window.setTimeout(installHook, 1000 * DELAY_BETWEEN_ATTEMPTS_SECONDS);
  }
};

installHook();

