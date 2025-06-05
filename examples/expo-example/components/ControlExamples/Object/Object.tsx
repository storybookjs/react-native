import { Text, View } from 'react-native';

export interface Props {
  filmInfo: { title: string; releaseYear: number; genre: string };
}

export const Movie = ({ filmInfo }: Props) => (
  <View>
    <Text>title: {filmInfo.title}</Text>
    <Text>release year: {filmInfo.releaseYear} </Text>
    <Text>genre: {filmInfo.genre}</Text>
  </View>
);
