document.addEventListener('DOMContentLoaded', () => {
  const keywordsInput = document.getElementById('keywords');
  const saveButton = document.getElementById('save');

  saveButton.addEventListener('click', () => {
    const keywords = keywordsInput.value.split(',').map(keyword => keyword.trim());

    chrome.storage.sync.set({ keywords: keywords }, () => {
      alert('Keywords saved successfully!');
    });
  });

  // Load saved keywords on popup open
  chrome.storage.sync.get('keywords', (data) => {
    if (data.keywords) {
      keywordsInput.value = data.keywords.join(', ');
    }
  });
});
