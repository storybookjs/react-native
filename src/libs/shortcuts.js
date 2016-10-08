// returns true if current platform is 'mac'
export function isMacPlatform() {
  const platform = window.navigator.platform.toLowerCase();
  return (platform.indexOf('mac') !== -1);
}

// manage two separate shortcut keys for 'mac' & other (windows, linux) platform
export default function getShortcuts() {
  if (isMacPlatform()) {
    return [
      {name: 'Toggle Search Box', keys: ['⌘ ⇧ P', '⌃ ⇧ P']},
      {name: 'Toggle Action Logger position', keys: ['⌘ ⇧ J', '⌃ ⇧ J']},
      {name: 'Toggle Fullscreen Mode', keys: ['⌘ ⇧ F', '⌃ ⇧ F']},
      {name: 'Toggle Left Panel', keys: ['⌘ ⇧ L', '⌃ ⇧ L']},
      {name: 'Toggle Down Panel', keys: ['⌘ ⇧ D', '⌃ ⇧ D']},
      {name: 'Next Story', keys: ['⌘ ⇧ →', '⌃ ⇧ →']},
      {name: 'Previous Story', keys: ['⌘ ⇧ ←', '⌃ ⇧ ←']},
    ];
  } else {
    return [
      {name: 'Toggle Search Box', keys: ['Ctrl + Shift + P']},
      {name: 'Toggle Action Logger position', keys: ['Ctrl + Shift + J']},
      {name: 'Toggle Fullscreen Mode', keys: ['Ctrl + Shift + F']},
      {name: 'Toggle Left Panel', keys: ['Ctrl + Shift + L']},
      {name: 'Toggle Down Panel', keys: ['Ctrl + Shift + D']},
      {name: 'Next Story', keys: ['Ctrl + Shift + →']},
      {name: 'Previous Story', keys: ['Ctrl + Shift + ←']},
    ];
  }
}
