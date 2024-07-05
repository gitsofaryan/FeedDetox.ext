chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({keywords: [], channels: []}, () => {
    console.log('Default keywords and channels set.');
  });
});
