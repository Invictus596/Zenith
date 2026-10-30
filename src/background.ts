chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['zenModeEnabled', 'activeTheme'], (result) => {
    if (result.zenModeEnabled === undefined) {
      chrome.storage.sync.set({ zenModeEnabled: true });
    }
    if (result.activeTheme === undefined) {
      chrome.storage.sync.set({ activeTheme: 'catppuccin-mocha' });
    }
  });
});