import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';
import DropdownAlert from 'react-native-dropdownalert';

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { blockchainAddress } from './common.js';

const backAction = NavigationActions.back();

export class AddRecordManualScreen extends Component {
  onRecordAdded(record) {
    this.props.navigation.state.params.onRecordAdded(record);
    this.dropdown.alertWithType('info', 'New Record Added', 'You can add more medical records or go back to the records list.');
  }

  onRecordUploaded(record) {
    this.dropdown.alertWithType('info', 'New Photo Record Uploaded', 'You can add more medical records or go back to the records list.');
  }

  render() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'MyRecords'})
      ]
    });

    const state = this.props.navigation.state;

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Medical Record' subtitle='Add your medical record to the blockchain.'/>

        <ScrollView centerContent={true}>
          <Text style={{padding: 20}}>
            Upload your own medical record to the blockchain by taking a photo, or filling out a questionaire.
          </Text>

          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.darkerGray}
              icon={{name: 'camera', type: 'font-awesome'}}
              title='Add Photo Record'
              onPress={() => this.props.navigation.navigate('Camera', {onRecordUploaded: this.onRecordUploaded.bind(this)})}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Blood Test'
              onPress={() => this.props.navigation.navigate('AddBloodTestRecord', {
                recordsList: this.props.navigation.state.params.recordsList,
                onRecordAdded: this.onRecordAdded.bind(this)})}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 20}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Genetic Test'
              onPress={() => this.props.navigation.navigate('AddGeneticTestRecord', {
                recordsList: this.props.navigation.state.params.recordsList,
                onRecordAdded: this.onRecordAdded.bind(this)})}
            />
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(resetAction)}/>
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          infoColor={colors.darkerGray}
        />
      </View>
    );
  }
}
