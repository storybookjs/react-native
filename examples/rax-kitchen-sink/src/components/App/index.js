import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import styles from './index.stylesheet';

const App = () => (
  <View style={styles.app}>
    <View style={styles.appHeader}>
      <Text style={styles.appBanner}>Welcome to Rax</Text>
    </View>
    <Text style={styles.appIntro}>
      To get started, edit src/components/App.js and save to reload.
    </Text>
  </View>
);

export default App;
