export default function handleShortCuts(e, syncedStore) {
  if (e.keyCode === 79 && e.ctrlKey && e.shiftKey) {
    const newData = { ...syncedStore.getData() };
    newData.showSearchBox = !newData.showSearchBox;
    syncedStore.setData(newData);
  } else if (e.ctrlKey && e.keyCode === 76 && e.shiftKey) {
    const newData = { ...syncedStore.getData() };
    newData.showControls = !newData.showControls;
    syncedStore.setData(newData);
  } else if (e.keyCode === 27) {
    const newData = { ...syncedStore.data };
    newData.showSearchBox = false;
    syncedStore.setData(newData);
  } else if (e.keyCode === 66 && e.ctrlKey && e.shiftKey) {
    const newData = { ...syncedStore.getData() };
    newData.showLogger = !newData.showLogger;
    syncedStore.setData(newData);
  } else if (e.keyCode === 70 && e.shiftKey && e.ctrlKey) {
    const newData = { ...syncedStore.getData() };
    if (newData.showControls || newData.showLogger) {
      newData.showControls = false;
      newData.showLogger = false;
    } else {
      newData.showControls = true;
      newData.showLogger = true;
    }
    syncedStore.setData(newData);
  }
}
