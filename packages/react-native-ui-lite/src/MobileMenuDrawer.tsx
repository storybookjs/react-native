import { useTheme } from '@storybook/react-native-theming';
import { forwardRef, memo, ReactNode, useImperativeHandle, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import { useSelectedNode } from './SelectedNodeProvider';

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
}

export interface MobileMenuDrawerRef {
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const MobileMenuDrawer = memo(
  forwardRef<MobileMenuDrawerRef, MobileMenuDrawerProps>(({ children }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollToSelectedNode, scrollRef } = useSelectedNode();
    const { height } = useWindowDimensions();
    useImperativeHandle(ref, () => ({
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          scrollToSelectedNode();
          setMobileMenuOpen(true);
        } else {
          Keyboard.dismiss();
          setMobileMenuOpen(false);
        }
      },
    }));
    const theme = useTheme();
    const bgColorStyle = useMemo(() => {
      return {
        marginTop: 'auto',
        backgroundColor: theme.background.content,
        height: height,
        width: '100%',
        overflow: 'hidden',
      } satisfies StyleProp<ViewStyle>;
    }, [height, theme.background.content]);

    return (
      <Modal
        visible={mobileMenuOpen}
        style={bgColorStyle}
        animationType="slide"
        transparent
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <SafeAreaView style={{ justifyContent: 'flex-end', flex: 1 }}>
            <View
              style={{ flex: 1, borderBottomColor: theme.appBorderColor, borderBottomWidth: 1 }}
            >
              <Pressable style={{ flex: 1 }} onPress={() => setMobileMenuOpen(false)}></Pressable>
            </View>

            <View style={{ height: '65%' }}>
              <ScrollView
                ref={scrollRef}
                keyboardShouldPersistTaps="handled"
                style={{
                  flex: 1,
                  paddingBottom: 150,
                  paddingTop: 24,
                  alignSelf: 'flex-end',
                  width: '100%',
                  backgroundColor: theme.background.content,
                }}
              >
                {children}
              </ScrollView>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    );
  })
);
