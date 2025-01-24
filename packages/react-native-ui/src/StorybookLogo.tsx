import { Theme } from '@storybook/react-native-theming';
import { FC, isValidElement, ReactElement, useEffect, useMemo } from 'react';
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

function isElement(value: unknown): value is ReactElement {
  return isValidElement(value);
}

const BrandLogo: FC<{ theme: Theme }> = ({ theme }) => {
  const imageHasNoWidthOrHeight =
    typeof theme.brand.image === 'object' &&
    typeof theme.brand.image === 'object' &&
    'uri' in theme.brand.image &&
    (!('height' in theme.brand.image) || !('width' in theme.brand.image));

  useEffect(() => {
    if (imageHasNoWidthOrHeight) {
      console.warn(
        "STORYBOOK: When using a remote image as the brand logo, you must also set the width and height.\nFor example:  brand: { image: { uri: 'https://sb.com/img.png', height: 25, width: 25}}"
      );
    }
  }, [imageHasNoWidthOrHeight]);

  if (!theme.brand.image) {
    return null;
  }

  if (isElement(theme.brand.image)) {
    return theme.brand.image;
  }

  const image = (
    <Image
      source={theme.brand.image}
      resizeMode={theme.brand.resizeMode ?? 'contain'}
      style={imageHasNoWidthOrHeight ? { width: WIDTH, height: HEIGHT } : undefined}
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

const BrandTitle: FC<{ theme: Theme }> = ({ theme }) => {
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
    return title;
  }
};

export const StorybookLogo: FC<{ theme: Theme }> = ({ theme }) => {
  const image = useMemo(() => theme.brand?.image, [theme.brand?.image]);
  const title = useMemo(() => theme.brand?.title, [theme.brand?.title]);

  if (image) {
    return <BrandLogo theme={theme} />;
  } else if (title) {
    return <BrandTitle theme={theme} />;
  } else {
    return <NoBrandLogo theme={theme} />;
  }
};
