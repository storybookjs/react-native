import React, { ReactNode, useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

type StoryKindName = string;
// type CategoryName = string;
type StoryName = string;

export interface StoryItem {
  name: StoryName;
  kind: StoryKindName;
}

export interface StorySectionListProps {
  storyItems: StoryItem[];
}

// interface StoryCategory {
//   title: CategoryName;
//   data: StoryItem[];
// }

// interface ListItemStory {
//   title: StoryKindName;
//   storyNames: StoryName[];
// }
// interface ListItemCategory {
//   title: CategoryName;
//   stories: ListItemStory[];
// }
const NO_CATEGORY = 'NO_CATEGORY';
const NO_CATEGORY_LABEL = 'No category';

interface Category {
  category: string;
  storyKinds: Array<{ name: string; stories: string[] }>;
}
// type StoryList = Array<ListItemStory | ListItemCategory>;
// type StoryMap = { [key: string]: ListItemStory | StoryCategory };
export const x: Category[] = [
  { category: NO_CATEGORY, storyKinds: [{ name: 'kind', stories: ['name1', 'name2'] }] },
  { category: 'xyz', storyKinds: [{ name: 'abc', stories: ['name 3', 'name4'] }] },
];

const Expandable = ({
  children,
  title,
  containerStyle,
  titleStyle,
}: {
  children: ReactNode | ReactNode[];
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}) => {
  const [visible, setVisible] = useState(false);
  const display = visible ? 'flex' : 'none';
  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={() => setVisible(!visible)}>
        <Text style={[styles.title, titleStyle]}>y{title}</Text>
      </TouchableOpacity>

      <View style={[styles.childContainer, { display }]}>{children}</View>
    </View>
  );
};

export const StorySectionList = ({ storyItems }: StorySectionListProps) => {
  console.log({ storyItemsLength: storyItems.length });
  // const categories: string[] = storyItems.reduce((acc: string[], { kind }: StoryItem) => {
  //   if (kind.includes('/')) {
  //     return [...acc, kind.split('/')[0]];
  //   }
  //   return acc;
  // }, []);

  // const uniqueCategories = Array.from(new Set(categories));
  // if (uniqueCategories.length > 0) {
  //   storyItems.reduce((acc, categories)=>{

  //   })
  //   console.log({ uniqueCategories });
  // }
  // const storyMap = storyItems.reduce((acc: StoryMap, { name, kind }: StoryItem) => {
  //   if (kind.includes('/')) {
  //     const [category, kindName] = kind.split('/');
  //     const categoryKey = `#category-${category}`; // to avoid issues with matching category and story names
  //     const data = acc[categoryKey] ? acc[categoryKey].data : [];

  //     return {
  //       ...acc,
  //       [categoryKey]: {
  //         title: category,
  //         data: [...data, { kind: kindName, name: name }],
  //       },
  //     };
  //   }
  //   console.log({ kind });
  //   if (acc[kind]) {
  //     return {
  //       ...acc,
  //       [kind]: { title: kind, data: [...acc[kind].data, story] },
  //     };
  //   }

  //   return {
  //     ...acc,
  //     [kind]: { title: kind, data: [story] },
  //   };
  // }, {});

  // const data: StoryList[] = Object.values(storyMap);
  // const data: StoryList = [];
  // console.log({ data: data[0].data });

  const renderItem = ({ item }: ListRenderItemInfo<Category>) => {
    return (
      <Expandable
        containerStyle={styles.itemContainer}
        title={item.category === NO_CATEGORY ? NO_CATEGORY_LABEL : item.category}
      >
        {item.storyKinds.map((kind, i) => (
          <Expandable title={kind.name} key={`${kind.name}-${i}`} titleStyle={styles.subTitle}>
            {kind.stories.map((story, index) => (
              <TouchableOpacity key={`${story}-${index}`}>
                <Text>{story}</Text>
              </TouchableOpacity>
            ))}
          </Expandable>
        ))}
      </Expandable>
    );
  };

  return (
    <FlatList
      data={x}
      keyExtractor={(item: Category, index) => {
        const s = `${item.category}-${item.storyKinds.length}-${index}`;
        console.log({ s });
        return s;
      }}
      renderItem={renderItem}
    />
  );
};

export const styles = StyleSheet.create({
  subTitle: { fontSize: 14, fontWeight: '600' },
  itemContainer: { marginLeft: 4 },
  title: { fontWeight: 'bold', fontSize: 16 },
  childContainer: { marginLeft: 8 },
});
