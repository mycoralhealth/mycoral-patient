import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
const backAction = NavigationActions.back();

import { CoralHeader, colors } from '../ui.js';
import doctorList from '../data/doctors.json';

export class RequestHealthTipScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader title='Request Health Tip' subtitle='The following doctors offer health tips.'/>
        <ScrollView>
          <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
            {
              doctorList.map((l, i) => (
                <ListItem
                  roundAvatar
                  avatar={{uri:l.avatar_url}}
                  key={i}
                  title={l.name}
                  subtitle={l.institution}
                  chevronColor={colors.red}
                  onPress={() => this.props.navigation.navigate('RequestHealthTipConfirm')}
                />
              ))
            }
          </List>

          <Button
            style={{ marginBottom: 20 }}
            backgroundColor={colors.red}
            icon={{name: 'ios-arrow-back', type: 'ionicon'}}
            title='Cancel'
            onPress={() => this.props.navigation.dispatch(backAction)}
          />
        </ScrollView>
      </View>
    );
  }
}
