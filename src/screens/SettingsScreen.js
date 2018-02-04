import React from 'react';
import { View } from 'react-native';
import { List, ListItem } from 'react-native-elements'


import { CoralHeader, colors } from '../ui.js';

doNothing = (menuItem) => {
  alert(`${menuItem.title} activated. This is a demo.`);
}

export const SettingsScreen = () => (
  <View style={{ flex: 1, backgroundColor: colors.bg  }}>
    <CoralHeader title='Account Settings' subtitle=''/>

    <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
      {
        [
          {"icon":"user", "title":"Profile"},
          {"icon":"paint-brush", "title":"Appearance"},
          {"icon":"bell", "title":"Notifications"},
          {"icon":"circle", "title":"Account"}
        ].map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            chevronColor={colors.red}
            leftIcon={{name:item.icon, type:'font-awesome', color: '#ddd'}}
            onPress={() => doNothing(item)}
          />
        ))
      }
    </List>
  </View>
);
