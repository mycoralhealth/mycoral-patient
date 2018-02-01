import moment from 'moment'
import React, { Component } from 'react';
import { View, ScrollView, Picker } from 'react-native';
import { Button, List, ListItem, Text, CheckBox } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';
import { RecordInputView } from './components/RecordInputView';
import { recordTypes } from './recordTypes.js';

const backAction = NavigationActions.back();


export class AddRecordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRecord : null,
      selectedRecordType: 'none',
      geneticTestInput: {checked:[false, false]},
      basicHeartRecordInput: {"Cholesterol":"", "HbA1c":"", "hsCRP":""}
    };
  }

  geneticTestInputChanged(item, index) {
    let checked = this.state.geneticTestInput.checked;
    checked[index] = !checked[index];
    this.setState({geneticTestInput: {checked}});
  }

  bloodTestInputChanged(key, value) {
    let bloodTestState = this.state.basicHeartRecordInput;
    bloodTestState[key] = value;
    this.setState({basicHeartRecordInput:bloodTestState});
  }

  addRecord() {
    if (!(this.state.selectedRecordType in recordTypes)) {
      return;
    }

    let results = [];

    switch(this.state.selectedRecordType) {
      case 'basic heart':
        results = [
          {"key": "Cholesterol", "value": this.state.basicHeartRecordInput['Cholesterol'], "type":"marker", "valueType":"magnitude"}, 
          {"key": "HbA1c", "value": this.state.basicHeartRecordInput['HbA1c'], "type":"marker", "valueType":"magnitude"},
          {"key": "hsCRP", "value": this.state.basicHeartRecordInput['hsCRP'], "type":"marker", "valueType":"magnitude"}
        ];
        break;
      case 'genetic':
        results = [
          {"key":"BRCA1", "value": (this.state.geneticTestInput.checked[0]) ? "positive" : "negative", "type":"gene", "valueType":"mutation"},
          {"key":"BRCA2", "value": (this.state.geneticTestInput.checked[1]) ? "positive" : "negative", "type":"gene", "valueType":"mutation"}
        ];
        break;
    }

    let record = {
      "record_id": "NR" + this.props.navigation.state.params.recordsList.length,
      "username":"123456",
      "email":"andy@mycoralhealth.com",
      "ethAddress":"0x8A09990601E7FF5CdccBEc6E9dd0684620a21a29",
      "IPFSaddr":"QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6",
      "testType":this.state.selectedRecordType,
      "name": recordTypes[this.state.selectedRecordType],
      "date": moment().format("YYYY-MM-DD"),
      "results":results
    };

    console.log(record);

    this.props.navigation.state.params.onRecordAdded(record);

    this.props.navigation.dispatch(backAction);
  }

  onQRCodeScanned(type, data) {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    // Set state
  }

  render() {
    const state = this.props.navigation.state;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Medical Record' subtitle='Scan QR code or enter a record manually.'/>

        <ScrollView>
          <Button
            style={{marginBottom: 10, marginTop: 20}}
            backgroundColor={colors.gray}
            icon={{name: 'qrcode', type: 'font-awesome'}}
            title='Scan QR code'
            onPress={() => this.props.navigation.navigate('QRCodeReader', {onQRCodeScanned: this.onQRCodeScanned.bind(this)})}
          />

          <Text style={{ margin: 20, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)', textAlign:"center" }}>Or enter record manually</Text>

          <Picker
            style={{height: 64}} itemStyle={{height: 44}}
            selectedValue={this.state.selectedRecordType}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedRecordType: itemValue})}>
            <Picker.Item label="Select Record Type" value="none" />
            <Picker.Item label="Basic Heart Metrics" value="basic heart" />
            <Picker.Item label="Genetic" value="genetic" />
          </Picker>

          <RecordInputView 
            recordType={this.state.selectedRecordType} 
            geneticRecordInput={this.state.geneticTestInput}
            onGeneticRecordChange={this.geneticTestInputChanged.bind(this)} 
            basicHeartRecordInput={this.state.basicHeartRecordInput}
            onBloodTestRecordChange={this.bloodTestInputChanged.bind(this)}/>

          <Button
            style={{marginBottom: 10}}
            backgroundColor={colors.green}
            icon={{name: 'ios-add-circle', type: 'ionicon'}}
            title='Add record' 
            onPress={() => this.addRecord()}
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