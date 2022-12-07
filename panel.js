console.log('panel JS');

const CONTENT_SCRIPT_ID = 'replicache_devtools_hook';

const initialize = async () => {
  console.log('Initializing...');
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
      },
    ]);
  }
};

initialize();
