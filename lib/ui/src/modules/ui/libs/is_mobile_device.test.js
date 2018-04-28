import isMobileDevice from './is_mobile_device';

describe('manager.ui.libs.is_mobile_device', () => {
  it('should detect if storybook is open on mobile device', () => {
    // chrome
    expect(
      isMobileDevice(
        'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
      )
    ).toEqual(true);

    expect(
      isMobileDevice('Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0')
    ).toEqual(true);

    expect(
      isMobileDevice(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
      )
    ).toEqual(false);

    expect(
      isMobileDevice(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6'
      )
    ).toEqual(false);
  });
});
