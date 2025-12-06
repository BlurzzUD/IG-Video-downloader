document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.getElementById('fetchBtn');
  const downloadAllBtn = document.getElementById('downloadAllBtn');
  const mediaList = document.getElementById('mediaList');
  const noMedia = document.getElementById('noMedia');

  async function queryActiveTabAndSend(message) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) throw new Error('No active tab');
    const tabId = tabs[0].id;
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        resolve(response);
      });
    });
  }

  function clearList() {
    mediaList.innerHTML = '';
  }

  function makeFilenameFromUrl(url, index, type) {
    try {
      const u = new URL(url);
      const seg = u.pathname.split('/').filter(Boolean).pop() || 'media';
      const ext = (u.pathname.match(/\.(mp4|jpg|jpeg|png|webp|gif)(\?.*)?$/i) || [])[1] || (type === 'video' ? 'mp4' : 'jpg');
      return `${seg.replace(/[^a-z0-9_\-\.]/gi, '_')}_${index}.${ext}`;
    } catch (e) {
      return `instagram_media_${index}.${type === 'video' ? 'mp4' : 'jpg'}`;
    }
  }

  function addMediaItem(item, idx) {
    const li = document.createElement('li');
    const thumb = document.createElement('img');
    thumb.className = 'thumb';
    thumb.src = item.url;
    thumb.alt = item.type;
    const meta = document.createElement('div');
    meta.className = 'meta';
    const typeEl = document.createElement('div');
    typeEl.className = 'type';
    typeEl.textContent = item.type.toUpperCase();
    const ctx = document.createElement('div');
    ctx.className = 'context';
    ctx.textContent = item.context || item.url;
    meta.appendChild(typeEl);
    meta.appendChild(ctx);
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.textContent = 'Download';
    btn.addEventListener('click', () => downloadSingle(item, idx));
    li.appendChild(thumb);
    li.appendChild(meta);
    li.appendChild(btn);
    mediaList.appendChild(li);
  }

  async function downloadSingle(item, idx) {
    try {
      const filename = makeFilenameFromUrl(item.url, idx + 1, item.type);
      chrome.downloads.download({ url: item.url, filename, conflictAction: 'uniquify' }, (id) => {
        if (!id) alert('Download failed.');
      });
    } catch (e) {
      alert('Download error: ' + e.message);
    }
  }

  async function downloadAll(items) {
    for (let i = 0; i < items.length; ++i) downloadSingle(items[i], i);
  }

  async function fetchMedia() {
    clearList();
    noMedia.style.display = 'none';
    downloadAllBtn.disabled = true;
    try {
      const response = await queryActiveTabAndSend({ type: 'GET_MEDIA' });
      if (!response || !response.success) {
        noMedia.style.display = 'block';
        noMedia.textContent = 'No response from page.';
        return;
      }
      const media = response.media || [];
      const unique = [];
      const seen = new Set();
      media.forEach(m => {
        if (!m || !m.url) return;
        if (seen.has(m.url)) return;
        seen.add(m.url);
        unique.push(m);
      });
      if (unique.length === 0) {
        noMedia.style.display = 'block';
        noMedia.textContent = 'No media found.';
        return;
      }
      unique.forEach((it, idx) => addMediaItem(it, idx));
      downloadAllBtn.disabled = false;
      downloadAllBtn._items = unique;
    } catch (e) {
      noMedia.style.display = 'block';
      noMedia.textContent = 'Error: ' + (e.message || e);
    }
  }

  fetchBtn.addEventListener('click', fetchMedia);
  downloadAllBtn.addEventListener('click', () => {
    const items = downloadAllBtn._items || [];
    if (items.length === 0) return;
    downloadAll(items);
  });
});
