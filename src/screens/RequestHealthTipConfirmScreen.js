import React from 'react';
import { View } from 'react-native';
import { Button, Avatar, Text } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'
const backAction = NavigationActions.back({})

import { CoralHeader, colors } from '../ui.js';


export class RequestHealthTipConfirmScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg }}>
        <CoralHeader title='Request Health Tip' subtitle='Your request has been sent.'/>

        <View style={{ alignItems: 'center' }}>
          <Avatar
            large
            rounded
            source={{uri: "https://randomuser.me/api/portraits/men/97.jpg"}}
          />
          <Text h4>Dr. Anthony Rapp</Text>
          <Text>Kingdom Hospital</Text>

          <Text style={{ margin: 20 }}>
            Dr. Rapp will review your medical record and send you a personalized health tip within 24 hours.
          </Text>
        </View>

        <Button
          style={{ marginBottom: 20 }}
          backgroundColor={colors.red}
          icon={{name: 'ios-arrow-back', type: 'ionicon'}}
          title='Home'
          onPress={() => this.props.navigation.dispatch(backAction)}
        />

      </View>
    );
  }
}