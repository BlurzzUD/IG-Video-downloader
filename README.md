# Instagram Downloader (Chrome Extension)

A lightweight Chrome extension that lets you download images and videos directly from the Instagram page you're currently viewing. This extension **does NOT bypass Instagram privacy**. It only downloads media you can already see while logged in.

## Important Notes
- You must be logged into Instagram.
- You can only download media visible to your account.
- No automated login and no bypassing restrictions.
- Works only on pages under: `https://www.instagram.com/`

## Features
- Fetch all images & videos from the current Instagram page.
- Download items individually or download all at once.
- Works for:
  - Feed posts  
  - Reels (if visible)  
  - Stories (if visible on screen)  
  - Private accounts you already follow  
- Completely client-side. No tracking. No servers. No data collection.

## Installation (Developer Mode)
1. Create a new folder:
```
instagram-downloader
```

2. Add these files into the folder:
```
manifest.json
content.js
popup.html
popup.css
popup.js
icons/
```

3. Folder structure:
```
instagram-downloader/
â manifest.json
â content.js
â popup.html
â popup.css
â popup.js
âââ icons/
    â icon16.png
    â icon48.png
    â icon128.png
```

4. Open Chrome Extensions:
```
chrome://extensions
```

5. Enable Developer Mode (toggle top-right corner).

6. Click **Load unpacked** and select the `instagram-downloader` folder.

The extension will now appear in Chrome.

## How to Use
1. Go to any Instagram post, reel, or story.
2. Click the extension icon in the Chrome toolbar.
3. Click **Fetch media**.
4. A list of detected media will appear.
5. Click **Download** for individual items or **Download all** to save everything.

## Troubleshooting
- **No media found:** Scroll to load all content, refresh the page, or open the post directly.
- **Download failed:** Chrome sometimes blocks cross-origin downloads; refresh and retry.
- **Extension not responding:** Make sure the tab is active, fully loaded, and the URL starts with `https://www.instagram.com/`.

## Notes
- All processing happens locally on your device.
- The extension does not store or transmit your data.
- Safe, clean, privacy-respecting, and fully user-controlled.
- Only downloads content you already have permission to view.

---
