import { createElement, render } from 'rax';
import DriverUniversal from 'driver-universal';
import { App } from './components/App/index';

render(<App />, null, {
  driver: DriverUniversal,
});
