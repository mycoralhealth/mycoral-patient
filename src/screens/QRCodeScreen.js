import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import { NavigationActions } from 'react-navigation';

import { CoralHeader, CoralFooter, colors } from '../ui';
import store from '../utilities/store';
import MessageIndicator from './MessageIndicator';

const backAction = NavigationActions.back();

function QRCodeDisplay(props) {
  if (props.loading) {
    return (
      <MessageIndicator message="Loading..." />
    );
  }

  if (props.ethAddress) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
        <QRCode
          value={props.ethAddress}
          size={300}
          bgColor='#333'
          fgColor={colors.bg}/>
        <Text style={{ margin: 20, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)' }}>{props.ethAddress}</Text>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
        <Text style={{ padding: 20, color: colors.red}}>
          You haven't setup your blockchain ETH address. Please complete the setup process in Settings > Account.
        </Text>
      </View>
    );
  }
}

export class QRCodeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ethAddress: null, loading: true };
  }

  async componentDidMount() {
    let ethAddress = await store.getEthAddress();

    this.setState({ ethAddress, loading: false });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Your Account QR Code' subtitle="Show this to a friend or doctor to let them share or send you a medical record."/>

        <ScrollView style={{ flex: 1}}>
          <QRCodeDisplay
            ethAddress={this.state.ethAddress}
            loading={this.state.loading}
          />
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}
