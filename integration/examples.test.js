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

  describe('sandboxes', () => {
    afterAll(() => {
      browser.close();
    });

    it.concurrent(
      `Take screenshots for '${name}'`,
      async () => {
        browser = await browser;
        const page = await browser.newPage();
        await page.setViewport({ width: 1400, height: 1000 });
        await page.goto(`http://localhost:${port}`);
        await page.waitForSelector('[role="menuitem"][data-name="Welcome"]');
        await page.waitFor(2000);

        const screenshot = await page.screenshot({ fullPage: true });

        expect(screenshot).toMatchImageSnapshot({
          customDiffConfig: {
            threshold: 0.03, // 3% threshold
          },
          customSnapshotIdentifier: name.split('/').join('-'),
        });
      },
      1000 * 60 * 10 // 10 minutes for all tests in total
    );
  });
});
