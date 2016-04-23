function isModifierPressed(e) {
  return (e.ctrlKey || e.keyCode === 91 || e.metaKey) && e.shiftKey;
}

export default function handleShortCuts(e, syncedStore) {
  if (isModifierPressed(e) && e.keyCode === 80) {
    e.preventDefault();
    const newData = { ...syncedStore.getData() };
    newData.showSearchBox = !newData.showSearchBox;
    syncedStore.setData(newData);
  } else if (isModifierPressed(e) && e.keyCode === 76) {
    e.preventDefault();
    const newData = { ...syncedStore.getData() };
    newData.showControls = !newData.showControls;
    syncedStore.setData(newData);
  } else if (e.keyCode === 27) {
    const newData = { ...syncedStore.data };
    newData.showSearchBox = false;
    syncedStore.setData(newData);
  } else if (isModifierPressed(e) && e.keyCode === 66) {
    e.preventDefault();
    const newData = { ...syncedStore.getData() };
    newData.showLogger = !newData.showLogger;
    syncedStore.setData(newData);
  }
}
