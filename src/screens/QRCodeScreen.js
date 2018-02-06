import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import { NavigationActions } from 'react-navigation';

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { blockchainAddress } from './common';


const backAction = NavigationActions.back();

export class QRCodeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Your Account QR Code' subtitle="Show this to a friend or doctor to let them share or send you a medical record."/>

        <ScrollView style={{ flex: 1}} centerContent={true}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
            <QRCode
              value={blockchainAddress}
              size={300}
              bgColor='#333'
              fgColor={colors.bg}/>
            <Text style={{ margin: 20, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)' }}>{blockchainAddress}</Text>
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}
