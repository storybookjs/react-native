import * as ExpoClipboard from 'expo-clipboard';

class Clipboard {
  async writeText(text: string) {
    try {
      await ExpoClipboard.setStringAsync(text);
    } catch (error: any) {
      return Promise.reject(new Error('Failed to copy text: ' + error.message));
    }
  }
  readText(): Promise<string> {
    return ExpoClipboard.getStringAsync();
  }
  async write(data: ClipboardItem[]) {
    for (const item of data) {
      if (item.types.includes('text/plain')) {
        const text = await item.getType('text/plain');
        if (text) {
          await this.writeText(text.toString());
          return Promise.resolve();
        }
      }
    }
    throw new Error('Only text/plain is supported');
  }
  async read() {
    return [new ClipboardItem({ 'text/plain': await ExpoClipboard.getStringAsync() })];
  }
}

// Assign to navigator.clipboard if it doesn't exist
if (!navigator.clipboard) {
  // @ts-expect-error
  navigator.clipboard = new Clipboard();
}
