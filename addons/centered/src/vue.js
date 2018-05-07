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
