import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export const receiptGenerator = {
  captureAndShare: async (viewRef: any) => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert('Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Snapshot failed', error);
    }
  },
};
