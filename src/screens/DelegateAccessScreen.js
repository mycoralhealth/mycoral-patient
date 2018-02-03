import moment from 'moment';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';

export class DelegateAccessScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {accessDelegated: false};
  }

  onQRCodeScanned(type, data) {
    // Dummy for now
    console.log(`Code scanned ${type} with data ${data}`);
    this.setState({accessDelegated:true})
  }

  onManualEntry(data) {
    this.setState({accessDelegated:true})    
  }

  onCancel() {
    this.setState({accessDelegated:false})    
  }

  render() {
    const record = this.props.navigation.state.params.record;

    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg  }}>
        <CoralHeader title='Share Record' subtitle='Scan the QR code or enter the blockchain address of the person you'd like to share this record with'/>

        <Text h3 style={{textAlign: 'center', marginTop: 20}}>
          {record.name}
        </Text>
        <Text style={{textAlign: 'center'}}>
          Date: {moment(record.date).format('MMMM Do, YYYY')}
        </Text>

        <View style={{ backgroundColor: (this.state.accessDelegated) ? colors.darkerGray : null }}>
          <Text h4 style={{textAlign: 'center', color: colors.white, margin: 10}}>
            {(this.state.accessDelegated) ? 'Record Shared' : ''}
          </Text>
        </View>

        <View>
          <Button
            style={{marginBottom: 10}}
            backgroundColor={colors.green}
            icon={{name: 'qrcode', type: 'font-awesome'}}
            title='Scan Recipient's QR Code'
            onPress={() => this.props.navigation.navigate('QRCodeReader', {onQRCodeScanned: this.onQRCodeScanned.bind(this), onCancel: this.onCancel.bind(this)})}
          />
          <Button
            style={{marginBottom: 10}}
            backgroundColor={colors.gray}
            icon={{name: 'terminal', type: 'font-awesome'}}
            title='Enter Recipients Address'
            onPress={() => this.props.navigation.navigate('DelegateAccessEntry', {onManualEntry: this.onManualEntry.bind(this), onCancel: this.onCancel.bind(this)})}
          />
          <Button
            style={{ marginBottom: 20 }}
            backgroundColor={colors.red}
            icon={{name: 'ios-arrow-back', type: 'ionicon'}}
            title='Back'
            onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
          />
        </View>

      </View>
    );
  }
}
