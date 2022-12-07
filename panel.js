console.log('panel JS');

let port;

const initialize = async () => {
  console.log('Initializing...');
  port = chrome.runtime.connect({ name: 'knockknock' });
};

initialize();
