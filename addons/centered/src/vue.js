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
      return {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
        },
        innerStyle: {
          margin: 'auto',
        },
      };
    },
  };
}
