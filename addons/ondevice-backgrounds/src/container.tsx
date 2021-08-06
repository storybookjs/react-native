import React, { ReactNode, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from './constants';
import { Channel } from './BackgroundPanel';

interface ContainerProps {
  initialBackground: string;
  channel: Channel;
  children: ReactNode;
}

const Container = ({ initialBackground, channel, children }: ContainerProps) => {
  const [background, setBackground] = useState(initialBackground || '');

  useEffect(() => {
    channel.on(Constants.UPDATE_BACKGROUND, setBackground);
    return () => {
      channel.removeListener(Constants.UPDATE_BACKGROUND, setBackground);
    };
  }, [channel]);

  return (
    <View style={[styles.container, background && { backgroundColor: background }]}>
      {children}
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
});
