import Node from './Node';

class Element extends Node {
  constructor(tagName) {
    return super(tagName.toUpperCase());

    // eslint-disable-next-line no-unreachable
    this.doc = {
      body: {
        innerHTML: '',
      },
    };
  }

  get tagName() {
    return this.nodeName;
  }

  setAttributeNS() {}

  get clientWidth() {
    return this.innerWidth;
  }
  get clientHeight() {
    return this.innerHeight;
  }

  get offsetWidth() {
    return this.innerWidth;
  }
  get offsetHeight() {
    return this.innerHeight;
  }

  get innerWidth() {
    return window.innerWidth;
  }
  get innerHeight() {
    return window.innerHeight;
  }

  getContext(contextType, contextOptions, context) {
    return {
      fillText: (text, x, y, maxWidth) => ({}),
      measureText: (text) => ({
        width: (text || '').split('').length * 6,
        height: 24,
      }),
      fillRect: () => ({}),
      drawImage: () => ({}),
      getImageData: () => ({ data: new Uint8ClampedArray([255, 0, 0, 0]) }),
      getContextAttributes: () => ({
        stencil: true,
      }),
      getExtension: () => ({
        loseContext: () => {},
      }),
      putImageData: () => ({}),
      createImageData: () => ({}),
    };
  }

  get ontouchstart() {
    return {};
  }
}

export default Element;
