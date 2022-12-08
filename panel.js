/** This lets us communicate down the stack */
let port;

/** Our local copy of the data store */
let dataStore = {};

const processChangeOperation = (operation) => {
  console.log('Change op', operation);
  // We might want to also use the old value in some way in the UI
  dataStore[operation.key] = operation.newValue;
  console.log(dataStore);
};

const renderSingleEntity = (key, entity) => {
  let rendered = '';
  rendered += '<li>';
  rendered += '<b>' + key + '</b>';
  rendered += '<ul>';
  for (const property in entity) {
    rendered += '<li>' + property + ': ' + entity[property] + '</li>';
  }
  rendered += '</ul>';
  rendered += '</li>';
  return rendered;
};

const render = () => {
  // This UI is likely never going to be complex enough that re-rendering
  // from scratch would get expensive. But we might want to add some
  // nifty animations.
  const container = document.getElementById('replicache-inspector');
  container.innerHTML = '';
  let rendered = '';
  rendered += '<ul>';
  for (const key in dataStore) {
    rendered += renderSingleEntity(key, dataStore[key]);
  }
  container.innerHTML = rendered;
}

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
  port = chrome.runtime.connect({ name: 'panel-bg' });
  port.onMessage.addListener((msg) => {
    console.log('Panel: got message', msg);
    if (msg.event === 'sync-response') {
      if (!Array.isArray(msg.data)) {
        console.log('I do not know how to process this data');
        return;
      }
      for (const operation of msg.data) {
        console.log('Operation: ', operation);
        if (operation.op === 'change') {
          processChangeOperation(operation);
        }
      }
      render();
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
