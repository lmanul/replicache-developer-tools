const CONTENT_SCRIPT_ID = 'replicache_devtools_hook';

let panelPort, contentPort;

// Keep data-sync messages sent from Replicache before the UI is ready.
const messageBacklog = [];

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'panel-bg') {
    panelPort = port;
    // Any messages left for me?
    for (const delayedMsg of messageBacklog) {
      panelPort.postMessage({
        'event': 'data-sync',
        'data': delayedMsg.data
      });
    }
    port.onMessage.addListener(async (msg) => {
      console.log('Background: got message from panel', msg);
    });
  }
  if (port.name === 'bg-content') {
    contentPort = port;
    messageBacklog.length = 0;
    port.onMessage.addListener(async (msg) => {
      console.log('Background: got message from page', msg);
      if (!panelPort) {
        // If the panel isn't ready yet, keep the message for later.
        console.log('No UI yet, storing message');
        messageBacklog.push(msg);
      } else {
        panelPort.postMessage({
          'event': 'data-sync',
          'data': msg.data,
        });
      }
    });
  }
});

const initialize = async () => {
  const registered = await chrome.scripting.getRegisteredContentScripts({
    ids: [CONTENT_SCRIPT_ID],
  });
  if (!!registered.length) {
    console.log('Hook already installed');
  } else {
    console.log('Installing hook...');
    chrome.scripting.registerContentScripts([{
        id: CONTENT_SCRIPT_ID,
        matches: ['<all_urls>'],
        js: ['install_hook.js'],
        runAt: 'document_start',
        world: chrome.scripting.ExecutionWorld.MAIN,
    }]);
  }
};

initialize();
