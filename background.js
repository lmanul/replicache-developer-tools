const CONTENT_SCRIPT_ID = 'replicache_devtools_hook';

let panelPort, contentPort;

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    console.log('Tab updated');
  }
})

chrome.runtime.onConnect.addListener(port => {
  console.log('Port name is', port.name);
  if (port.name === 'panel-bg') {
    panelPort = port;
    port.onMessage.addListener(async (msg) => {
      console.log('Background: got message from panel', msg);
      // if (msg.event === 'sync-request') {
        // const tab = await getCurrentTab();
        // chrome.scripting.executeScript({
          // target: {tabId: tab.id},
          // func: () => {
            // console.log('Executing script');
            // return 1;
          // }
        // }, (scriptResult) => {
          // console.log('Got result from script: ', scriptResult);
          // port.postMessage({
            // 'event': 'sync-response',
            // 'data':  scriptResult[0].result
          // });
        // });
      // }
    });
  }
  if (port.name === 'bg-content') {
    contentPort - port;
    port.onMessage.addListener(async (msg) => {
      console.log('Background: got message from page', msg);
      // If we are connected to the panel, forward that message.
      if (!!panelPort) {
        panelPort.postMessage({
          'event': 'sync-response',
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
