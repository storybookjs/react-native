export default function({ provider }, actionMap) {
  const panels = Object.keys(provider.getPanels());

  if (panels.length > 0) {
    actionMap.ui.selectAddonPanel(panels[0]);
  }
}
