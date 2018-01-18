import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';

import { CoralHeader, colors } from '../ui.js';

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
export const SharedRecordsScreen = () => (
  <View style={{ flex: 1, backgroundColor: colors.bg }}>
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
            chevronColor={colors.red}
          />
        ))
      }
    </List>
    <Button
      backgroundColor={colors.red}
      icon={{name: 'qrcode', type: 'font-awesome'}}
      title='Show QR code' />
  </View>
);