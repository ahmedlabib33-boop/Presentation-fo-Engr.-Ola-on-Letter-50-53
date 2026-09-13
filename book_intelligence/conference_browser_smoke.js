const { chromium } = require('playwright');

(async () => {
  const baseUrl = process.env.CONFERENCE_URL || 'http://127.0.0.1:8765/';
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const host = await context.newPage();
  const guest = await context.newPage();
  const diagnostics = { consoleErrors: [], pageErrors: [], failedRequests: [] };
  for (const page of [host, guest]) {
    page.on('console', message => {
      if (message.type() === 'error') diagnostics.consoleErrors.push(message.text());
    });
    page.on('pageerror', error => diagnostics.pageErrors.push(error.message));
    page.on('requestfailed', request => diagnostics.failedRequests.push(`${request.url()} ${request.failure()?.errorText || ''}`));
  }

  const room = `vercel-parity-${Date.now()}`;
  await host.goto(baseUrl, { waitUntil: 'networkidle' });
  const launcherText = await host.locator('.conference-launcher').innerText();
  await host.locator('.conference-launcher').click();
  const setupDisclosure = await host.locator('.conference-disclosure').innerText();
  await host.locator('#conferenceRoom').fill(room);
  await host.locator('.conference-sync').click();
  await host.locator('.conference-dock.connected').waitFor({ timeout: 20000 });

  const guestUrl = new URL(baseUrl);
  guestUrl.searchParams.set('conference', room);
  guestUrl.searchParams.set('role', 'guest');
  guestUrl.searchParams.set('mode', 'sync');
  await guest.goto(guestUrl.href, { waitUntil: 'networkidle' });
  await guest.locator('.conference-sync').click();
  await host.locator('.conference-peer-state').filter({ hasText: /Both participants connected/ }).waitFor({ timeout: 20000 });
  await guest.locator('.conference-peer-state').filter({ hasText: /Both participants connected/ }).waitFor({ timeout: 20000 });

  await host.locator('#press').click();
  await guest.locator('#master.show').waitFor({ timeout: 25000 });
  await host.locator('.tb').filter({ hasText: /^Event 2 - IFC$/ }).click();
  await guest.locator('.tb').filter({ hasText: /^Event 2 - IFC$/ }).evaluate((node) => new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      if (node.getAttribute('aria-selected') === 'true') return resolve();
      if (Date.now() - started > 8000) return reject(new Error('Guest did not follow the host tab'));
      setTimeout(check, 100);
    };
    check();
  }));

  await guest.locator('.conference-control').click();
  await host.locator('.conference-request.show').waitFor({ timeout: 8000 });
  const controlRequest = await host.locator('.conference-request span').innerText();
  await host.locator('.conference-request .accept').click();
  await guest.locator('.conference-control').filter({ hasText: /You control/ }).waitFor({ timeout: 8000 });
  await guest.locator('.tb').filter({ hasText: /^Library$/ }).click();
  await host.locator('.tb').filter({ hasText: /^Library$/ }).evaluate((node) => new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      if (node.getAttribute('aria-selected') === 'true') return resolve();
      if (Date.now() - started > 8000) return reject(new Error('Host did not follow the guest controller'));
      setTimeout(check, 100);
    };
    check();
  }));

  await guest.locator('.conference-voice-toggle').click();
  await host.locator('.conference-request.show').waitFor({ timeout: 8000 });
  const voiceRequest = await host.locator('.conference-request span').innerText();
  await host.locator('.conference-request .reject').click();
  await guest.locator('.conference-toast.show').filter({ hasText: /voice request was declined/i }).waitFor({ timeout: 8000 });
  const syncStillActive = await guest.locator('.conference-dock').evaluate(node => node.classList.contains('connected'));

  await guest.setViewportSize({ width: 390, height: 844 });
  const mobile = await guest.locator('.conference-dock').evaluate(node => ({
    clientWidth: node.clientWidth,
    scrollWidth: node.scrollWidth,
    bottom: getComputedStyle(node).bottom,
    position: getComputedStyle(node).position
  }));

  const report = {
    baseUrl,
    launcherText,
    setupDisclosure,
    hostConnected: true,
    guestConnected: true,
    hostToGuestSync: true,
    controlRequest,
    guestToHostSync: true,
    voiceRequest,
    voiceDeclinedWithoutEndingSync: syncStillActive,
    mobile,
    ...diagnostics
  };
  console.log(JSON.stringify(report, null, 2));

  const checks = [
    /Voice & live sync/.test(launcherText),
    /does not request microphone access/.test(setupDisclosure),
    /asking to control/.test(controlRequest),
    /requesting a voice connection/.test(voiceRequest),
    syncStillActive,
    mobile.clientWidth === mobile.scrollWidth,
    mobile.position === 'fixed',
    diagnostics.consoleErrors.length === 0,
    diagnostics.pageErrors.length === 0,
    diagnostics.failedRequests.length === 0
  ];
  await browser.close();
  if (checks.some(check => !check)) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
