import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Avatar, Text } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'

import { CoralHeader, CoralFooter, colors } from '../ui.js';

export class RequestHealthTipConfirmScreen extends React.Component {
  render() {
    const doctor = this.props.navigation.state.params.doctor;

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'MyRecords'})
      ]
    });

    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg }}>
        <CoralHeader title='Request Health Tip' subtitle='Your request has been sent.'/>

        <ScrollView centerContent={true}>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Avatar
              large
              rounded
              source={{uri:doctor.avatar_url}}
            />
            <Text h4>{doctor.name}</Text>
            <Text>{doctor.institution}</Text>

            <Text style={{ margin: 40 }}>
              {doctor.name} will review your medical record and send you a personalized health tip within 24 hours.
            </Text>
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(resetAction)}/>
      </View>
    );
  }
}