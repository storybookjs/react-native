import { Portal } from '@gorhom/portal';
import { Modal, ModalProps, Platform, View } from 'react-native';

const modalSupported = Platform.OS !== 'macos';

export const ModalPortal = ({
  children,
  visible,
  usePortal,
  ...props
}: ModalProps & { usePortal?: boolean }) => {
  if (modalSupported && !usePortal) {
    return (
      <Modal visible={visible} {...props}>
        {children}
      </Modal>
    );
  }

  if (!visible) return null;

  return (
    <Portal hostName="storybook-lite-ui-root">
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        {children}
      </View>
    </Portal>
  );
};
