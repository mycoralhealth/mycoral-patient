import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { blockchainAddress } from './common.js';

const backAction = NavigationActions.back();

export class AddRecordScreen extends Component {
  onRecordAdded(record) {
    this.props.navigation.state.params.onRecordAdded(record);
  }

  render() {
    const state = this.props.navigation.state;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Medical Record' subtitle='Add your medical record to the blockchain.'/>
        <ScrollView>
          <Text style={{padding: 20}}>
            Show this QR code to your lab or doctor to allow them to add your medical record from their device.
          </Text>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
            <QRCode
              value={blockchainAddress}
              size={300}
              bgColor='#333'
              fgColor={colors.bg}/>
          </View>

          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.green}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Record Manually'
              onPress={() => this.props.navigation.navigate('AddRecordManual', {
                onRecordAdded: this.onRecordAdded.bind(this)
              })}
            />
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}
