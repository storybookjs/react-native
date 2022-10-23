class Node {
  constructor(nodeName) {
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);

    this.style = {};
    this.className = {
      baseVal: '',
    };
    this.nodeName = nodeName;
  }

  get ownerDocument() {
    return window.document;
  }

  addEventListener(_eventName, _listener) {}

  removeEventListener(_eventName, _listener) {}

  appendChild() {}
  insertBefore() {}
  removeChild() {}
  setAttributeNS() {}

  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
}

export default Node;
