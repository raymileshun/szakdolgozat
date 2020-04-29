/**
 * @format
 */

import {AppRegistry} from 'react-native';
import EntryPoint from './EntryPoint';
import {name as appName} from './app.json';
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => EntryPoint);
