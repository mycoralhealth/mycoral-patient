import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';
import DropdownAlert from 'react-native-dropdownalert';

import { CoralHeader, colors } from '../ui.js';
import { blockchainAddress } from './common.js';

const backAction = NavigationActions.back();

export class AddRecordScreen extends Component {
  onRecordAdded(record) {
    this.props.navigation.state.params.onRecordAdded(record);
    this.dropdown.alertWithType('info', 'New Record Added', 'You can add more medical records or go back to the records list.');
  }

  onRecordUploaded(record) {
    this.dropdown.alertWithType('info', 'New Photo Record Uploaded', 'You can add more medical records or go back to the records list.');
  }

  render() {
    const state = this.props.navigation.state;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Medical Record' subtitle='Show this QR code to your lab or doctor to allow them to add your medical records to the blockchain'/>

        <ScrollView>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <QRCode
              value={blockchainAddress}
              size={300}
              bgColor='#333'
              fgColor={colors.bg}/>
          </View>

          <Text style={{ margin: 20, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)', textAlign:"center" }}>Or, add records yourself</Text>

          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.darkerGray}
              icon={{name: 'camera', type: 'font-awesome'}}
              title='Add Records By Camera' 
              onPress={() => this.props.navigation.navigate('Camera', {onRecordUploaded: this.onRecordUploaded.bind(this)})}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.green}
              icon={{name: 'heartbeat', type: 'font-awesome'}}
              title='Add Blood Test' 
              onPress={() => this.props.navigation.navigate('AddBloodTestRecord', {
                recordsList: this.props.navigation.state.params.recordsList, 
                onRecordAdded: this.onRecordAdded.bind(this)})}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 20}}>          
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'genderless', type: 'font-awesome'}}
              title='Add Genetic Test' 
              onPress={() => this.props.navigation.navigate('AddGeneticTestRecord', {
                recordsList: this.props.navigation.state.params.recordsList, 
                onRecordAdded: this.onRecordAdded.bind(this)})}
            />
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
        <DropdownAlert 
          ref={ref => this.dropdown = ref} 
          infoColor={colors.darkerGray}
        />
      </View>
    );
  }
}
