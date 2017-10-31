import puppeteer from 'puppeteer';

const examples = [
  {
    name: 'cra-kitchen-sink',
    port: 9010,
  },
  {
    name: 'vue-kitchen-sink',
    port: 9009,
  },
];

examples.forEach(({ name, port }) => {
  let browser = puppeteer.launch();
  let page;

  describe('sandboxes', () => {
    beforeAll(async () => {
      browser = await browser;
      page = await browser.newPage();
      await page.setViewport({ width: 1400, height: 1000 });
    });
    afterAll(() => {
      browser.close();
    });

    it(`Take screenshots for '${name}'`, async () => {
      await page.goto(`http://localhost:${port}`);
      await page.waitForSelector('[role="menuitem"][data-name="Welcome"]');
      await page.waitFor(2000);

      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        failureThreshold: 0.04, // 4% threshold,
        failureThresholdType: 'percent',
        customSnapshotIdentifier: name.split('/').join('-'),
      });
    });
  });
});
