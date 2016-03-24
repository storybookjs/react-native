import renderUI from './ui/admin';
import {watchData, getData} from './data';

watchData(data => {
  renderUI(data);
});
renderUI(getData());
