import { browserHistory } from 'react-router';

if (typeof window !== 'undefined') {
  watchClickEvents();
}

function watchClickEvents() {
  // This logic is taken from page.js
  // See: https://github.com/visionmedia/page.js
  const clickEvent = typeof document !== 'undefined' && document.ontouchstart
    ? 'touchstart'
    : 'click';
  document.addEventListener(clickEvent, onclick, false);

  function onclick(e) {
    if (which(e) !== 1) {
      return;
    }

    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      return;
    }

    if (e.defaultPrevented) {
      return;
    }

    // ensure link
    // use shadow dom when available
    let el = e.path ? e.path[0] : e.target;
    while (el && el.nodeName !== 'A') {
      el = el.parentNode;
    }

    if (!el || el.nodeName !== 'A') {
      return;
    }

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') {
      return;
    }

    // ensure non-hash for the same path
    const link = el.getAttribute('href');
    if (el.pathname === location.pathname && (el.hash || link === '#')) {
      return;
    }

    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) {
      return;
    }

    // check target
    if (el.target) {
      return;
    }

    // x-origin
    if (!sameOrigin(el.href)) {
      return;
    }

    // rebuild path
    let path = el.pathname + el.search + (el.hash || '');

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    e.preventDefault();
    browserHistory.push(path);
  }

  function which(e) {
    e = e || window.event;
    return e.which === null ? e.button : e.which;
  }

  function sameOrigin(href) {
    let origin = `${location.protocol}//${location.hostname}`;
    if (location.port) {
      origin += `:${location.port}`;
    }

    return href && href.indexOf(origin) === 0;
  }
}
