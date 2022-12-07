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
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    args: [],
    func: () => {
      console.log('Loading replicache dev tools content script');
    },
  });
};

initialize();
