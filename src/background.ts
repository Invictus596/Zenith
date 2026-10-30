chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['zenModeEnabled', 'accentColor'], (result) => {
    if (result.zenModeEnabled === undefined) {
      chrome.storage.sync.set({ zenModeEnabled: true });
    }
    if (result.accentColor === undefined) {
      chrome.storage.sync.set({ accentColor: '#8b5cf6' });
    }
  });
});
