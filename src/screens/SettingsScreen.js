import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import { CoralHeader, LogoutFooter, colors, logoutAction } from '../ui';
import version from '../../version.json';

export class SettingsScreen extends Component {
  
  menuAction(menuItem) {
    if (menuItem.screen) {
      this.props.navigation.navigate(menuItem.screen);
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Account Settings' subtitle={version.version}/>

        <ScrollView style={{ flex: 1 }}>
          <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
            {
              [
                {"icon":"user-circle", "title":"Profile", "screen": "Profile", color: colors.green },
                {"icon":"user-secret", "title":"Account", "screen": "AccountInfo", color: colors.green},
                {"icon":"users", "title":"Contacts", "screen": "Contacts", color: colors.green},
                {"icon":"bell", "title":"Notifications"}
              ].map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  chevronColor={colors.red}
                  leftIcon={{name:item.icon, type:'font-awesome', color: item.color, style:{ width: 30, textAlign: 'center' }}}
                  onPress={() => this.menuAction(item)}
                />
              ))
            }
          </List>
        </ScrollView>

        <LogoutFooter backAction={async () => {
          this.props.navigation.dispatch(await logoutAction(this.props.navigation));
          }}/>
      </View>
    )
  }
}
