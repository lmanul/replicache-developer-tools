console.log('panel JS');

let port;

const initializePanel = async () => {
  console.log('Initializing...');
  const testButton = document.getElementById('test-message');
  if (!!testButton) {
    testButton.addEventListener('click', testMessage);
  }
  port = chrome.runtime.connect({ name: 'knockknock' });
};

const testMessage = (evt) => {
  port.postMessage({
    'event': 'test',
    'data': {'hello': 'world'},
  });
};

initializePanel();
