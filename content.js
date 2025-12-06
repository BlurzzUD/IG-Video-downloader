function gatherMedia() {
  const urls = new Map();
  document.querySelectorAll('video').forEach(v => {
    const src = v.currentSrc || v.src;
    if (src) urls.set(src, { url: src, type: 'video', context: describeContext(v) });
  });
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.getAttribute('srcset')?.split(' ')[0];
    if (!src) return;
    const w = img.naturalWidth || parseInt(img.getAttribute('width') || '0');
    const h = img.naturalHeight || parseInt(img.getAttribute('height') || '0');
    if ((w && w < 50) || (h && h < 50)) return;
    urls.set(src, { url: src, type: 'image', context: describeContext(img) });
  });
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && ogImage.content) urls.set(ogImage.content, { url: ogImage.content, type: 'image', context: 'og:image' });
  const ogVideo = document.querySelector('meta[property="og:video"]');
  if (ogVideo && ogVideo.content) urls.set(ogVideo.content, { url: ogVideo.content, type: 'video', context: 'og:video' });
  try {
    document.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
      try {
        const j = JSON.parse(s.textContent);
        if (j && typeof j === 'object') {
          if (j.image) {
            const img = Array.isArray(j.image) ? j.image[0] : j.image;
            if (img) urls.set(img, { url: img, type: 'image', context: 'ld+json' });
          }
          if (j.video && j.video.contentUrl) {
            urls.set(j.video.contentUrl, { url: j.video.contentUrl, type: 'video', context: 'ld+json' });
          }
        }
      } catch (e) {}
    });
  } catch (e) {}
  return Array.from(urls.values());
}

function describeContext(node) {
  const post = node.closest('article') || node.closest('a') || node.closest('div');
  if (!post) return '';
  const alt = node.getAttribute && node.getAttribute('alt');
  if (alt) return alt;
  const caption = post.querySelector('div[role="button"]') || post.querySelector('h1') || post.querySelector('span');
  if (caption && caption.textContent) return caption.textContent.slice(0, 120);
  return '';
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;
  if (msg.type === 'GET_MEDIA') {
    const media = gatherMedia();
    sendResponse({ success: true, media });
    return true;
  }
});
