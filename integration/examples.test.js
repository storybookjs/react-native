import puppeteer from 'puppeteer';
import path from 'path';

// We do screenshots against the static build of the storybook.
// For this test to be meaningful, you must build the static version of the storybook *before* running this test suite.
const pathToVueKitchenSink = path.join(
  __dirname,
  '..',
  'examples/vue-kitchen-sink/storybook-static/index.html'
);
const pathToAngularKitchenSink = path.join(
  __dirname,
  '..',
  'examples/angular-cli/storybook-static/index.html'
);
const pathToCraKitchenSink = path.join(
  __dirname,
  '..',
  'examples/cra-kitchen-sink/storybook-static/index.html'
);

const examples = [
  {
    name: 'cra-kitchen-sink',
    storybookUrl: pathToCraKitchenSink,
  },
  {
    name: 'vue-kitchen-sink',
    storybookUrl: pathToVueKitchenSink,
  },
  {
    name: 'angular-cli',
    storybookUrl: pathToAngularKitchenSink,
  },
];

examples.forEach(({ name, storybookUrl }) => {
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
      await page.goto(`file://${storybookUrl}`);
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        failureThreshold: 0.04, // 4% threshold,
        failureThresholdType: 'percent',
        customSnapshotIdentifier: name.split('/').join('-'),
      });
    });
  });
});
