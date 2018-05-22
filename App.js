import React, { Component } from 'react';
import { View, Image, Platform } from 'react-native';
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { Button, Icon, Text } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Constants } from 'expo';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';

import { CoralHeader, colors } from './src/ui.js';

import reducers from './src/reducers';

import { LoginScreen } from './src/screens/LoginScreen.js';
import { MyRecordsScreen } from './src/screens/MyRecordsScreen.js';
import { ViewRecordScreen } from './src/screens/ViewRecordScreen.js';
import { ViewGraphScreen } from './src/screens/ViewGraphScreen.js';
import { RequestHealthTipScreen } from './src/screens/RequestHealthTipScreen.js';
import { RequestHealthTipConfirmScreen } from './src/screens/RequestHealthTipConfirmScreen.js';
import {CheckInsuranceScreen} from "./src/screens/CheckInsuranceScreen";
import { AddRecordScreen } from './src/screens/AddRecordScreen.js';
import { AddRecordManualScreen } from './src/screens/AddRecordManualScreen.js';
import { QRCodeReaderScreen } from './src/screens/QRCodeReaderScreen.js';
import { AddBloodTestRecordScreen } from './src/screens/AddBloodTestRecordScreen';
import { AddGeneticTestRecordScreen } from './src/screens/AddGeneticTestRecordScreen';
import { AddVitalSignsRecordScreen } from './src/screens/AddVitalSignsRecordScreen';
import {AddHairTestRecordScreen} from "./src/screens/AddHairTestRecordScreen";
import { DelegateAccessScreen } from './src/screens/DelegateAccessScreen';
import { DelegationContactsScreen } from './src/screens/DelegationContactsScreen';
import { ViewImageScreen } from './src/screens/ViewImageScreen';

import { SharedRecordsScreen } from './src/screens/SharedRecordsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { QRCodeScreen } from './src/screens/QRCodeScreen';
import { AccountInfoScreen } from './src/screens/AccountInfoScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ContactsScreen } from './src/screens/ContactsScreen';
import { MyContactScreen } from './src/screens/MyContactScreen';
import { SharedRecordsWithScreen } from './src/screens/SharedRecordsWithScreen';
import { ViewSharedRecordScreen } from './src/screens/ViewSharedRecordScreen';
import { GraphGeneratorScreen } from './src/screens/GraphGeneratorScreen';

const MyRecordsNavigator = StackNavigator({
  MyRecords: { screen: MyRecordsScreen },
  ViewRecord: { screen: ViewRecordScreen },
  ViewGraph: { screen: ViewGraphScreen },
  GraphGenerator: { screen: GraphGeneratorScreen },
  RequestHealthTip: { screen: RequestHealthTipScreen },
  RequestHealthTipConfirm: { screen: RequestHealthTipConfirmScreen },
  CheckInsurance: {screen: CheckInsuranceScreen},
  DelegateAccess: { screen: DelegateAccessScreen },
  DelegationContacts: { screen: DelegationContactsScreen },
  AddRecord: { screen: AddRecordScreen },
  AddRecordManual: { screen: AddRecordManualScreen },
  AddBloodTestRecord: {screen: AddBloodTestRecordScreen},
  AddGeneticTestRecord: {screen: AddGeneticTestRecordScreen},
  AddVitalSignsRecord: {screen: AddVitalSignsRecordScreen},
  AddHairTestRecord: {screen: AddHairTestRecordScreen},
  QRCode: { screen: QRCodeScreen },
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
  SharedRecordsWith: { screen: SharedRecordsWithScreen },
  QRCode: { screen: QRCodeScreen },
  ViewSharedRecord: { screen: ViewSharedRecordScreen },
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

const SettingsNavigator = StackNavigator({
  Settings: { screen: SettingsScreen },
  AccountInfo: { screen: AccountInfoScreen },
  Profile: { screen: ProfileScreen },
  Contacts: { screen: ContactsScreen },
  MyContact: { screen: MyContactScreen },
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

function resetStack(navigation, routes) {
  if (routes.length > 1) {
    const { routeName } = routes[0];
    navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    }));
  }
}

const MainTabs = TabNavigator({
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
      tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
        resetStack(navigation, previousScene.routes);
        jumpToIndex(scene.index);
      }
    }),
  },
  MySharedRecords: {
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
      tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
        resetStack(navigation, previousScene.routes);
        jumpToIndex(scene.index);
      }
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
      tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
        resetStack(navigation, previousScene.routes);
        jumpToIndex(scene.index);
      }
    }),
  },
},
{
  tabBarOptions:{
    style:{marginTop: (Platform.OS === 'ios') ? 0 : Constants.statusBarHeight}
  }
}
);

const App = StackNavigator({
  Login: { screen: LoginScreen },
  MainTabs: { screen: MainTabs }
},{
  headerMode: 'none'
});

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

export default class ReduxWrapper extends Component {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <App />
      </Provider>
    );
  }  
}
//export default App;


