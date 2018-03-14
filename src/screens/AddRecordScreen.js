import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';

import { CoralHeader, CoralFooter, colors, MessageIndicator} from '../ui';
import store from '../utilities/store';

const backAction = NavigationActions.back();

function QRCodeView(props) {
  if (!props.loaded) {
    return (
      <View style={{height: 20}}/>
    );
  }

  if (props.ethAddress) {
    return (
      <View style={{flex: 1}}>
        <Text style={{padding: 20, color: 'black'}}>
          Show this QR code to your lab or doctor to allow them to add your medical record from their device.
        </Text>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
          <QRCode
            value={props.ethAddress}
            size={300}
            bgColor='#333'
            fgColor={colors.bg}/>
        </View>
      </View>
    );
  } else {
    return (
      <Text style={{padding: 20, color: colors.red}}>
        Please setup your blockchain ETH address in Settings > Account to get a QR code you can show to your lab or doctor, so they can add your medical record from their device.
      </Text>
    );
  }

}

export class AddRecordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { ethAddress:'', loaded: false };
  }

  onRecordAdded(record) {
    this.props.navigation.state.params.onRecordAdded(record);
  }

  async componentDidMount() {
    let ethAddress = await store.getEthAddress();
    this.setState({ ethAddress, loaded: true });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.bg }}>
          <MessageIndicator message='Loading...' />
        </View>
      );
    }

    const state = this.props.navigation.state;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Medical Record' subtitle='Add your medical record to the blockchain.'/>
        <ScrollView>
          <QRCodeView
            ethAddress={this.state.ethAddress}
            loaded={this.state.loaded}
          />

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
