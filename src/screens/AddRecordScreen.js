import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';

import { CoralHeader, colors } from '../ui.js';
import { blockchainAddress } from './common.js';

const backAction = NavigationActions.back();

export class AddRecordScreen extends Component {
  render() {
    const state = this.props.navigation.state;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Medical Record' subtitle='Present this QR code to your medical lab so they can upload your results to the blockchain'/>

        <ScrollView>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <QRCode
              value={blockchainAddress}
              size={300}
              bgColor='#333'
              fgColor={colors.bg}/>
          </View>

          <Text style={{ margin: 20, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)', textAlign:"center" }}>Or, upload your own record</Text>

          <Button
            style={{marginBottom: 10}}
            backgroundColor={colors.darkerGray}
            icon={{name: 'camera', type: 'font-awesome'}}
            title='Take photo of medical record' 
            onPress={() => this.props.navigation.navigate('Camera')}
          />
          <Button
            style={{marginBottom: 10}}
            backgroundColor={colors.green}
            icon={{name: 'heartbeat', type: 'font-awesome'}}
            title='Blood Test' 
            onPress={() => this.props.navigation.navigate('AddBloodTestRecord', {
              recordsList: this.props.navigation.state.params.recordsList, 
              onRecordAdded: this.props.navigation.state.params.onRecordAdded})}
          />

          <Button
            style={{marginBottom: 20}}
            backgroundColor={colors.gray}
            icon={{name: 'genderless', type: 'font-awesome'}}
            title='Genetic Test' 
            onPress={() => this.props.navigation.navigate('AddGeneticTestRecord', {
              recordsList: this.props.navigation.state.params.recordsList, 
              onRecordAdded: this.props.navigation.state.params.onRecordAdded})}
          />

          <Button
            style={{ marginBottom: 20 }}
            backgroundColor={colors.red}
            icon={{name: 'ios-arrow-back', type: 'ionicon'}}
            title='Back'
            onPress={() => this.props.navigation.dispatch(backAction)}
          />

        </ScrollView>

      </View>
    );
  }
}
