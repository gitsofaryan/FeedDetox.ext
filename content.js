function filterVideos() {
  chrome.storage.sync.get(['keywords', 'channels'], (data) => {
    const keywords = data.keywords || [];
    const channels = data.channels || [];
    const videos = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer');

    videos.forEach(video => {
      const titleElement = video.querySelector('#video-title');
      const channelElement = video.querySelector('#channel-name');

      if (titleElement && channelElement) {
        const title = titleElement.innerText.toLowerCase();
        const channel = channelElement.innerText.toLowerCase();

        const keywordMatch = keywords.some(keyword => title.includes(keyword.toLowerCase()));
        const channelMatch = channels.some(channelName => channel.includes(channelName.toLowerCase()));

        if (!keywordMatch && !channelMatch) {
          video.style.filter = 'blur(5px)';
          if (!video.querySelector('.unblur-button')) {
            const button = document.createElement('button');
            button.innerText = 'Unblur';
            button.className = 'unblur-button';
            button.style.position = 'absolute';
            button.style.top = '10px';
            button.style.right = '10px';
            button.addEventListener('click', () => unblurVideo(video, title, channel));
            video.appendChild(button);
          }
        } else {
          video.style.filter = '';
          const button = video.querySelector('.unblur-button');
          if (button) {
            button.remove();
          }
        }
      }
    });
  });
}

function unblurVideo(video, title, channel) {
  video.style.filter = '';
  const button = video.querySelector('.unblur-button');
  if (button) {
    button.remove();
  }

  chrome.storage.sync.get(['keywords', 'channels'], (data) => {
    const keywords = data.keywords || [];
    const channels = data.channels || [];

    if (!keywords.includes(title)) {
      keywords.push(title);
    }

    if (!channels.includes(channel)) {
      channels.push(channel);
    }

    chrome.storage.sync.set({ keywords: keywords, channels: channels }, () => {
      console.log('Video unblurred and preferences updated.');
    });
  });
}

function observeVideos() {
  const observer = new MutationObserver(() => {
    filterVideos();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

observeVideos();
