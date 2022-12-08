const CONTENT_SCRIPT_ID = 'replicache_devtools_hook';

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
  port.onMessage.addListener(async (msg) => {
    console.log('Background: got message', msg);
    if (msg.event === 'sync-request') {
      const tab = await getCurrentTab();
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: () => {
          console.log('Executing script');
          return 1;
        }
      }, (scriptResult) => {
        console.log('Got result from script: ', scriptResult);
        port.postMessage({
          'event': 'sync-response',
          'data':  scriptResult[0].result
        });
      });
    }
  });
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
