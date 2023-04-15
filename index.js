/**
 * @format
 */
import 'react-native-gesture-handler';
import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';



AppRegistry.registerComponent(appName, () => App);
