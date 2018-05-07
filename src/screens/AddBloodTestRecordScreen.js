import moment from 'moment'
import React from 'react';
import { View } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { colors } from '../ui';
import { TestRecordScreen } from './TestRecordScreen';

import { BLOOD_TEST, recordTypes } from '../utilities/recordTypes';
import {MyRecordsScaffold} from "./MyRecordsScaffold";

const backAction = NavigationActions.back();

export class AddBloodTestRecordScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.state = {
      "Cholesterol" : "",
      "HbA1c" : "",
      "hsCRP" : "",
      "opInProgress": false
    };
  }

  onChangeValue(key, value) {
    let state = this.state;
    this.state[key] = value;
    this.setState(state);
  }

  async addRecord() {
    this.setState({opInProgress: true});
    
    let results = [
      {"key": "Cholesterol", "value": this.state['Cholesterol'], "type":"marker", "valueType":"magnitude"},
      {"key": "HbA1c", "value": this.state['HbA1c'], "type":"marker", "valueType":"magnitude"},
      {"key": "hsCRP", "value": this.state['hsCRP'], "type":"marker", "valueType":"magnitude"}
    ];

    try {
      let record = await this.createRecord(JSON.stringify(results), BLOOD_TEST);
      this.props.navigation.state.params.onRecordAdded(record);
    } catch(e) {
      this.props.navigation.state.params.onRecordAddFailed();
    } finally {
      this.props.navigation.dispatch(backAction);
    }
  }

  render() {
    return (
      <MyRecordsScaffold
        title={`Add ${recordTypes[BLOOD_TEST]}`}
        subtitle='Enter your results below.'
        backAction={() => this.props.navigation.dispatch(backAction)}>
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
                  textInputKeyboardType='numeric'
                  textInputReturnKeyType={'done'}
                />
              ))
            }
          </List>

          <View style={{ flex: 1}}>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                disabled={this.state.opInProgress}
                backgroundColor={colors.green}
                icon={{name: 'ios-add-circle', type: 'ionicon'}}
                title='Save'
                onPress={async () => this.addRecord()}
              />
            </View>
          </View>

          <View style={{ height: 200 }}/>
          
        </KeyboardAwareScrollView>
      </MyRecordsScaffold>
    );
  }
}
