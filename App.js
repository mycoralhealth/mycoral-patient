import React from 'react';
import { View, Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Button, Icon, Text } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CoralHeader, colors } from './src/ui.js';

import { MyRecordsScreen } from './src/screens/MyRecordsScreen.js';
import { SharedRecordsScreen } from './src/screens/SharedRecordsScreen.js';
import { SettingsScreen } from './src/screens/SettingsScreen.js';



const App = TabNavigator({
  MyRecords: {
    screen: MyRecordsScreen,
    navigationOptions: {
      tabBarLabel: 'My Records',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-medkit' : 'ios-medkit-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Friends: {
    screen: SharedRecordsScreen,
    navigationOptions: {
      tabBarLabel: 'Shared Records',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-people' : 'ios-people-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-settings' : 'ios-settings-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },

});

export default App;


