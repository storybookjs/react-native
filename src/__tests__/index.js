import renderStorybookUI, { Provider } from '../';
import { expect } from 'chai';
import sinon from 'sinon';
const { describe, it } = global;

describe('Main API', () => {
  describe('default export', (done) => {
    it('should fail if provider is not extended from the base Provider', () => {
      const run = () => {
        const fakeProvider = {};
        renderStorybookUI(null, fakeProvider);
      };

      expect(run).to.throw(/base Provider/);
    });
  })
});
