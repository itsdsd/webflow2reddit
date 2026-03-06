# Webflow2Reddit

A desktop app for Mac and Windows. Fetch any Webflow CMS item, generate an AI summary, and post it to Reddit — all in a few clicks.

<p align="center">
  <a href="https://github.com/itsdsd/webflow2reddit/releases/latest/download/Webflow2Reddit-1.2.0-arm64.dmg">
    <img src="https://img.shields.io/badge/Download%20for%20Mac-DMG-black?style=for-the-badge&logo=apple&logoColor=white" alt="Download for Mac"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/itsdsd/webflow2reddit/releases/latest/download/Webflow2Reddit.Setup.1.2.0.exe">
    <img src="https://img.shields.io/badge/Download%20for%20Windows-EXE-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="Download for Windows"/>
  </a>
</p>

<p align="center">You can download the <strong>.dmg</strong> file for Mac or <strong>.exe</strong> version for Windows to install the desktop version of the app.</p>

---

## Download & Install

👉 **[Download the latest version here](../../releases/latest)**

- **Mac** — download the `.dmg` file, open it, drag the app to your Applications folder
- **Windows** — download the `.exe` file and run the installer

No coding required. Just install and open like any other app.

---

## Getting Started

When you first open the app, go to **Credentials** and enter your API keys. The app has a built-in **Setup Guide** (in the left sidebar) that walks you through getting each one step by step.

You'll need:
- **Webflow** — a free API token from your Webflow account
- **Reddit** — a free app credential from your Reddit account
- **Anthropic** — optional, only needed if you want AI-generated summaries

Your credentials are saved locally on your computer only. They are never uploaded anywhere.

---

## How to Use

1. Open the app and enter your credentials
2. Go to **CMS Items** and click **Fetch Items**
3. Select the item you want to post
4. Go to **Compose** — hit **Generate Summary** for an AI-written post, or write your own
5. Pick which images to include
6. Go to **Publish** and hit **Publish to Reddit**

---

## For Developers

Want to run from source or contribute?

```
git clone https://github.com/itsdsd/webflow2reddit.git
cd webflow2reddit
npm install
npm start
```

Built with Electron. MIT licensed — free to use, modify and share.

---

## Credits

Background photo by [Juan Pablo Serrano](https://www.pexels.com/@juanphotography) via [Pexels](https://www.pexels.com).
