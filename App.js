import React from 'react';
import { View, Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Button, Icon, Text } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

const coralBG = '#eee';
const coralGreen = '#1db495';
const coralRed = '#f10d34';

class CoralHeader extends React.Component {
  render() {
    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: coralGreen, borderTopWidth: 1, borderTopColor: coralGreen, marginTop: 20}}>
        <View style={{ backgroundColor: 'white', width: 80, height: 80, justifyContent: 'center'}}>
          <Image style={{ width: 80, height: 80 }} source={require('./assets/corner-logo.png')} />
        </View>
        <View style={{ backgroundColor: coralGreen, height: 80, padding: 20, flex: 1, justifyContent: 'center'}}>
          <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>{this.props.title}</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', textAlign: "center" }}>{this.props.subtitle}</Text>
        </View>
      </View>
    );
  }
}

const recordList = [
  {
    name: 'Basic Heart Metrics',
    date: '2017-07-01'
  },
  {
    name: 'Genetic',
    date: '2016-11-20'
  },
  {
    name: 'Blood',
    date: '2016-10-29'
  }
];
const MyRecordsScreen = () => (
  <View style={{ flex: 1, backgroundColor: coralBG }}>
    <CoralHeader title='My Medical Records' subtitle='View your records on the blockchain.'/>

    <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
      {
        recordList.map((l, i) => (
          <ListItem
            key={i}
            title={l.name}
            rightTitle={l.date}
            chevronColor={coralRed}
            leftIcon={{name:'ios-document', type:'ionicon', color: '#ddd'}}
          />
        ))
      }
    </List>
    <Button
      backgroundColor={coralRed}
      icon={{name: 'ios-add-circle', type: 'ionicon'}}
      title='Add record' />
  </View>
);

const friendList = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    records: {value: "2 records"}
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    records: {value: "1 record"}
  }
];
const SharedRecordsScreen = () => (
  <View style={{ flex: 1, backgroundColor: coralBG }}>
    <CoralHeader title='Shared Medical Records' subtitle='Users below have delagated access to you.'/>
    <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
      {
        friendList.map((l, i) => (
          <ListItem
            roundAvatar
            avatar={{uri:l.avatar_url}}
            key={i}
            title={l.name}
            badge={l.records}
            chevronColor={coralRed}
          />
        ))
      }
    </List>
    <Button
      backgroundColor={coralRed}
      icon={{name: 'qrcode', type: 'font-awesome'}}
      title='Show QR code' />
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, backgroundColor: coralBG  }}>
    <CoralHeader title='Account Settings' subtitle='Configure blockchain account settings.'/>


  </View>
);

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


