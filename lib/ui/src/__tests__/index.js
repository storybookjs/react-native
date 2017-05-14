import renderStorybookUI from '../';

describe('Main API', () => {
  describe('default export', () => {
    it('should fail if provider is not extended from the base Provider', () => {
      const run = () => {
        const fakeProvider = {};
        renderStorybookUI(null, fakeProvider);
      };

      expect(run).toThrow(/base Provider/);
    });
  });
});
