import React from 'react';
import { View, Image } from 'react-native';
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { Button, Icon, Text } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CoralHeader, colors } from './src/ui.js';

import { MyRecordsScreen } from './src/screens/MyRecordsScreen.js';
import { ViewRecordScreen } from './src/screens/ViewRecordScreen.js';
import { RequestHealthTipScreen } from './src/screens/RequestHealthTipScreen.js';
import { RequestHealthTipConfirmScreen } from './src/screens/RequestHealthTipConfirmScreen.js';
import { AddRecordScreen } from './src/screens/AddRecordScreen.js';
import { QRCodeReaderScreen } from './src/screens/QRCodeReaderScreen.js';
import { AddBloodTestRecordScreen } from './src/screens/AddBloodTestRecordScreen';
import { AddGeneticTestRecordScreen } from './src/screens/AddGeneticTestRecordScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { DelegateAccessScreen } from './src/screens/DelegateAccessScreen';
import { DelegateAccessEntryScreen } from './src/screens/DelegateAccessEntryScreen';

import { SharedRecordsScreen } from './src/screens/SharedRecordsScreen.js';
import { SettingsScreen } from './src/screens/SettingsScreen.js';
import { QRCodeScreen } from './src/screens/QRCodeScreen.js';

const MyRecordsNavigator = StackNavigator({
  MyRecords: { screen: MyRecordsScreen },
  ViewRecord: { screen: ViewRecordScreen },
  RequestHealthTip: { screen: RequestHealthTipScreen },
  RequestHealthTipConfirm: { screen: RequestHealthTipConfirmScreen },
  DelegateAccess: { screen: DelegateAccessScreen },
  DelegateAccessEntry: { screen: DelegateAccessEntryScreen },
  AddRecord: { screen: AddRecordScreen },
  AddBloodTestRecord: {screen: AddBloodTestRecordScreen},
  AddGeneticTestRecord: {screen: AddGeneticTestRecordScreen},
  Camera: { 
    screen: CameraScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Camera',
      tabBarVisible: false
    })
  },
  QRCodeReader: { 
    screen: QRCodeReaderScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'QR Code',
      tabBarVisible: false
    })
  }
},{
  headerMode: 'none'
});

const SharedRecordsNavigator = StackNavigator({
  SharedRecords: { screen: SharedRecordsScreen },
  QRCode: { screen: QRCodeScreen },
},{
  headerMode: 'none'
});

const resetStack = (scene, jumpToIndex, navigation) => {
  const { route, focused, index } = scene;
  if (!focused && (route.index > 0)) {
    const { routeName, key } = route.routes[1]
    navigation.dispatch(NavigationActions.back({ key }))
  } else {
    jumpToIndex(index);
  }
};

const App = TabNavigator({
  MyRecords: {
    screen: MyRecordsNavigator,
    navigationOptions: ({ navigation }) => ( {
      tabBarLabel: 'My Records',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-medkit' : 'ios-medkit-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
      tabBarOnPress: ({ scene, jumpToIndex }) => resetStack(scene, jumpToIndex, navigation)
    }),
  },
  Friends: {
    screen: SharedRecordsNavigator,
    navigationOptions: ({ navigation }) => ( {
      tabBarLabel: 'Shared Records',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-people' : 'ios-people-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
      tabBarOnPress: ({ scene, jumpToIndex }) => resetStack(scene, jumpToIndex, navigation)
    }),
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


