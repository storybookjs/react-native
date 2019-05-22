import styles from './styles';

export default function() {
  return {
    template: `
      <div :style="style">
        <div :style="innerStyle">
          <story/>
        </div>
      </div>
    `,
    data() {
      return styles;
    },
  };
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
