const REPLICACHE_OBJECT_PROPERTY_NAME = '__replicache';
const DELAY_BETWEEN_ATTEMPTS_SECONDS = 1;
const MAX_ATTEMPTS = 3;
let attempts = 0;

const installHook = () => {
  attempts++;
  if (attempts >= MAX_ATTEMPTS) {
    console.log('Reached maximum number of attempts, bailing out.');
  }
  if (!!window[REPLICACHE_OBJECT_PROPERTY_NAME]) {
    console.log('Replicache object is', window[REPLICACHE_OBJECT_PROPERTY_NAME]);
  } else {
    console.log('Replicache object not available yet, retrying in ' +
        DELAY_BETWEEN_ATTEMPTS_SECONDS + ' second(s)...');
    window.setTimeout(installHook, 1000 * DELAY_BETWEEN_ATTEMPTS_SECONDS);
  }
};

installHook();
