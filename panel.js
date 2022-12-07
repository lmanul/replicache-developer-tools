console.log('panel JS');

let port;

const initializePanel = async () => {
  console.log('Initializing...');
  const testButton = document.getElementById('test-message');
  if (!!testButton) {
    testButton.addEventListener('click', testMessage);
  }
  const syncButton = document.getElementById('sync-button');
  if (!!syncButton) {
    syncButton.addEventListener('click', sync);
  }
  port = chrome.runtime.connect({ name: 'knockknock' });
  port.onMessage.addListener((msg) => {
    console.log('Got message', msg);
    if (msg.event === 'sync-response') {
      console.log('Got sync response', msg.data);
    }
  });
  // Initial sync
  sync(null);
};

const sync = (evt) => {
  port.postMessage({
    'event': 'sync-request'
  });
};

const testMessage = (evt) => {
  port.postMessage({
    'event': 'test',
    'data': {'hello': 'world'},
  });
};

initializePanel();
