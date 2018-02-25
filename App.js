import React from 'react';
import { View, Image, Platform } from 'react-native';
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { Button, Icon, Text } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Constants } from 'expo';

import { CoralHeader, colors } from './src/ui.js';

import { MyRecordsScreen } from './src/screens/MyRecordsScreen.js';
import { ViewRecordScreen } from './src/screens/ViewRecordScreen.js';
import { RequestHealthTipScreen } from './src/screens/RequestHealthTipScreen.js';
import { RequestHealthTipConfirmScreen } from './src/screens/RequestHealthTipConfirmScreen.js';
import { AddRecordScreen } from './src/screens/AddRecordScreen.js';
import { AddRecordManualScreen } from './src/screens/AddRecordManualScreen.js';
import { QRCodeReaderScreen } from './src/screens/QRCodeReaderScreen.js';
import { AddBloodTestRecordScreen } from './src/screens/AddBloodTestRecordScreen';
import { AddGeneticTestRecordScreen } from './src/screens/AddGeneticTestRecordScreen';
import { DelegateAccessScreen } from './src/screens/DelegateAccessScreen';
import { DelegateAccessEntryScreen } from './src/screens/DelegateAccessEntryScreen';
import { ViewImageScreen } from './src/screens/ViewImageScreen';

import { SharedRecordsScreen } from './src/screens/SharedRecordsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { QRCodeScreen } from './src/screens/QRCodeScreen';
import { AccountInfoScreen } from './src/screens/AccountInfoScreen';

/*import ipfs from './src/utilities/expo-ipfs';
import { FileSystem } from 'expo';

ipfs.add('This is a test for IPFS').then((hash) => {
  console.log(hash);
  ipfs.cat(hash).then((uri) => {
    console.log('Downloaded file uri', uri);
    FileSystem.readAsStringAsync(uri).then((text) => console.log(text));
  });
});
*/

const MyRecordsNavigator = StackNavigator({
  MyRecords: { screen: MyRecordsScreen },
  ViewRecord: { screen: ViewRecordScreen },
  RequestHealthTip: { screen: RequestHealthTipScreen },
  RequestHealthTipConfirm: { screen: RequestHealthTipConfirmScreen },
  DelegateAccess: { screen: DelegateAccessScreen },
  DelegateAccessEntry: { screen: DelegateAccessEntryScreen },
  AddRecord: { screen: AddRecordScreen },
  AddRecordManual: { screen: AddRecordManualScreen },
  AddBloodTestRecord: {screen: AddBloodTestRecordScreen},
  AddGeneticTestRecord: {screen: AddGeneticTestRecordScreen},
  ViewImage: { 
    screen: ViewImageScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Photo Record View',
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

const SettingsNavigator = StackNavigator({
  Settings: { screen: SettingsScreen },
  AccountInfo: { screen: AccountInfoScreen },
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
    screen: SettingsNavigator,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-settings' : 'ios-settings-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
      tabBarOnPress: ({ scene, jumpToIndex }) => resetStack(scene, jumpToIndex, navigation)
    }),
  }, 
},
{
  tabBarOptions:{
    style:{marginTop: (Platform.OS === 'ios') ? 0 : Constants.statusBarHeight}
  }
}
);

export default App;


