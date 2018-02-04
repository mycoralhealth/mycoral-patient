import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';

import { CoralHeader, colors } from '../ui.js';

export class DelegateAccessScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {accessDelegated: false};
  }

  onQRCodeScanned(type, data) {
    // Dummy for now
    console.log(`Code scanned ${type} with data ${data}`);
    this.showSharedAlert();
  }

  onManualEntry(data) {
    this.showSharedAlert();    
  }

  onCancel() {
    this.setState({accessDelegated:false})    
  }

  showSharedAlert() {
    this.dropdown.alertWithType('info', 'Record Shared', 'You can share the record with more people or go back.');
  }

  render() {
    const record = this.props.navigation.state.params.record;

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Share Record' subtitle="Scan the QR code or enter the blockchain address of the person you'd like to share this record with"/>

        <ScrollView style={{ flex:1 }}>
          <Text h3 style={{textAlign: 'center', marginTop: 20}}>
            {record.name}
          </Text>
          <Text style={{textAlign: 'center'}}>
            Date: {moment(record.date).format('MMMM Do, YYYY')}
          </Text>

          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.green}
                icon={{name: 'qrcode', type: 'font-awesome'}}
                title="Scan Recipient's QR Code"
                onPress={() => this.props.navigation.navigate('QRCodeReader', {onQRCodeScanned: this.onQRCodeScanned.bind(this), onCancel: this.onCancel.bind(this)})}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.gray}
                icon={{name: 'terminal', type: 'font-awesome'}}
                title="Enter Recipient's Address"
                onPress={() => this.props.navigation.navigate('DelegateAccessEntry', {onManualEntry: this.onManualEntry.bind(this), onCancel: this.onCancel.bind(this)})}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 20}}>
              <Button
                backgroundColor={colors.red}
                icon={{name: 'ios-arrow-back', type: 'ionicon'}}
                title='Back'
                onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
              />
            </View>
          </View>
        </ScrollView>
        <DropdownAlert 
          ref={ref => this.dropdown = ref} 
          infoColor={colors.darkerGray}
        />
      </View>
    );
  }
}
