const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('file:///C:/Users/pc/Desktop/Response%20on%2053/Smart%20charts/Event%202%20All%20Possible%20Scenario.svg');
  await page.screenshot({
    path: 'C:/Users/pc/Documents/Codex/2026-09-12/create-an-image-of/work/ifc_schedule_renders/event-2-reference.png',
    fullPage: true,
  });
  await browser.close();
})();
