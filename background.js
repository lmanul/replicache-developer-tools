const CONTENT_SCRIPT_ID = 'replicache_devtools_hook';

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    console.log('Tab updated');
  }
})

console.log('Add listener, this is toplevel');
chrome.runtime.onConnect.addListener(port => {
  console.log('Add listener on runtime');
  port.onMessage.addListener(msg => {
    console.log('Got message', msg);
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
