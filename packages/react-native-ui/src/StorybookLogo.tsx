import { Theme } from '@storybook/react-native-theming';
import { FC, useMemo } from 'react';
import { Image, Linking, StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native';
import { DarkLogo } from './icon/DarkLogo';
import { Logo } from './icon/Logo';

const WIDTH = 125;
const HEIGHT = 25;

const NoBrandLogo: FC<{ theme: Theme }> = ({ theme }) =>
  theme.base === 'light' ? (
    <Logo height={HEIGHT} width={WIDTH} />
  ) : (
    <DarkLogo height={HEIGHT} width={WIDTH} />
  );

const BrandLogo: FC<{ theme: Theme & { brand: NonNullable<Theme['brand']> } }> = ({ theme }) => {
  const image = (
    <Image
      source={
        typeof theme.brand.image === 'string' ? { uri: theme.brand.image } : theme.brand.image
      }
      resizeMode="contain"
      style={{ height: HEIGHT, width: WIDTH }}
    />
  );

  if (theme.brand.url) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (theme.brand.url) Linking.openURL(theme.brand.url);
        }}
      >
        {image}
      </TouchableOpacity>
    );
  } else {
    return image;
  }
};

const BrandTitle: FC<{ theme: Theme & { brand: NonNullable<Theme['brand']> } }> = ({ theme }) => {
  const brandTitleStyle = useMemo<StyleProp<TextStyle>>(() => {
    return {
      width: WIDTH,
      height: HEIGHT,
      color: theme.color.defaultText,
      fontSize: theme.typography.size.m1,
    };
  }, [theme]);

  const title = (
    <Text style={brandTitleStyle} numberOfLines={1} ellipsizeMode="tail">
      {theme.brand.title}
    </Text>
  );

  if (theme.brand.url) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (theme.brand.url) Linking.openURL(theme.brand.url);
        }}
      >
        {title}
      </TouchableOpacity>
    );
  } else {
    title;
  }
};

export const StorybookLogo: FC<{ theme: Theme }> = ({ theme }) => {
  if (theme.brand.image) {
    return <BrandLogo theme={theme} />;
  } else if (theme.brand.title) {
    return <BrandTitle theme={theme} />;
  } else {
    return <NoBrandLogo theme={theme} />;
  }
};
