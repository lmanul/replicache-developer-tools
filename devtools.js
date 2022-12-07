chrome.devtools.panels.create('Replicache', null,
    'panel.html', null);

const getCurrentTab = async () => {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const initialize = async () => {
  const currentTab = await getCurrentTab();
  if (!currentTab) {
    return;
  }

  chrome.scripting.registerContentScripts([{
      id: 'hook',
      matches: ['<all_urls>'],
      js: ['install_hook.js'],
      runAt: 'document_idle',
      world: chrome.scripting.ExecutionWorld.MAIN,
    },
  ]);
};

initialize();
