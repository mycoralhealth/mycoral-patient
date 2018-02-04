import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';
import { blockchainAddress } from './common';


const backAction = NavigationActions.back();

export class QRCodeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Your Account QR Code' subtitle="Show this to any labs or doctors that you'd like to share your full medical records with."/>

        <ScrollView style={{ flex: 1}}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <QRCode
              value={blockchainAddress}
              size={300}
              bgColor='#333'
              fgColor={colors.bg}/>
            <Text style={{ margin: 20, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)' }}>{blockchainAddress}</Text>
          </View>
          <View style={{ flex: 1, marginBottom: 20}}>
            <Button
              backgroundColor={colors.red}
              icon={{name: 'ios-arrow-back', type: 'ionicon'}}
              title='Back'
              onPress={() => this.props.navigation.dispatch(backAction)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
