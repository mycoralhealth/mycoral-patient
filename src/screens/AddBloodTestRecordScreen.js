import moment from 'moment'
import React from 'react';
import { View } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { TestRecordScreen } from './TestRecordScreen';

import { BLOOD_TEST, recordTypes } from './common';

const backAction = NavigationActions.back();

export class AddBloodTestRecordScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.state = {
      "Cholesterol" : "",
      "HbA1c" : "",
      "hsCRP" : ""
    };
  }

  onChangeValue(key, value) {
    let state = this.state;
    this.state[key] = value;
    this.setState(state);
  }

  addRecord() {
    let results = [
      {"key": "Cholesterol", "value": this.state['Cholesterol'], "type":"marker", "valueType":"magnitude"},
      {"key": "HbA1c", "value": this.state['HbA1c'], "type":"marker", "valueType":"magnitude"},
      {"key": "hsCRP", "value": this.state['hsCRP'], "type":"marker", "valueType":"magnitude"}
    ];

    let record = this.createRecord(results, BLOOD_TEST);

    this.props.navigation.state.params.onRecordAdded(record);
    this.props.navigation.dispatch(backAction);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title={`Add ${recordTypes[BLOOD_TEST]}`} subtitle='Enter your results below.'/>

        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <Text h3 style={{textAlign: 'center', marginTop: 20}}>
            {recordTypes[BLOOD_TEST]}
          </Text>
          <Text style={{textAlign: 'center'}}>
            Date: {moment().format('MMMM Do, YYYY')}
          </Text>

          <List containerStyle={{marginBottom: 20}}>
            {
              [
                {"key":"Cholesterol","placeholder":"180"},
                {"key":"HbA1c","placeholder":"6.0"},
                {"key":"hsCRP","placeholder":"2.5"}
              ].map((item, index) => (

                <ListItem
                  key={item.key}
                  title={item.key}
                  hideChevron={true}
                  textInput={true}
                  textInputPlaceholder={item.placeholder}
                  textInputValue={this.state[item.key]}
                  textInputOnChangeText={(title) => this.onChangeValue(item.key, title)}
                  textInputReturnKeyType={'done'}
                />
              ))
            }
          </List>

          <View style={{ flex: 1}}>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.green}
                icon={{name: 'ios-add-circle', type: 'ionicon'}}
                title='Save'
                onPress={() => this.addRecord()}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}
