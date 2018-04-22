import moment from 'moment'
import React from 'react';
import { View } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { CoralHeader, CoralFooter, colors } from '../ui';
import { TestRecordScreen } from './TestRecordScreen';

import { VITAL_SIGNS, recordTypes } from '../utilities/recordTypes';

const backAction = NavigationActions.back();

export class AddVitalSignsRecordScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.key_info = [
        { "key": "Systolic",
          "title": "Blood Pressure (systolic)",
          "placeholder": "120",
          "high": 150,
          "low": 50,
          "type": "marker",
          "valueType": "magnitude",
        },
        { "key": "Diastolic",
          "title": "Blood Pressure (diastolic)",
          "placeholder":"80",
          "high": 100,
          "low": 20,
          "type": "marker",
          "valueType": "magnitude",
        },
        { "key": "BreathingRate",
          "title": "Respiratory Rate",
          "placeholder":"40",
          "high": 60,
          "low": 20,
          "type": "marker",
          "valueType": "magnitude",
        }
    ]

    this.state = {
      "Systolic" : { 
        "value": "",
        "error": ""
      },
      "Diastolic" : {
        "value": "",
        "error": ""
      },
      "BreathingRate" : {
        "value": "",
        "error": ""
      }
    };
  }


  onChangeValue(key, value) {
    let state = this.state;
    this.state[key].value = value;
    this.state[key].error = "";
    this.setState(state);
  }

  validateInputReportError(key_info) {
    val = this.state[key_info.key].value 
    if (val < key_info.low || val > key_info.high) {
      this.state[key_info.key].error = "Outside required range: (" + key_info.low + "," + key_info.high + ")";
      this.setState(this.state);
      return false;
    } 
    return true;
  }

  validateInput() {
    mapping = this.key_info.map((item) => {
      return this.validateInputReportError(item);
    })
    res = mapping.every(val => val === true);
    return res;
  }

  async addRecord() {
    if (!this.validateInput()) 
      return;

    let results = this.key_info.map((item) => {
      return {"key": item.key, 
              "title": item.title,
              "value": this.state[item.key].value,
              "type": item.type,
              "time" : new Date(),
              "valueType": item.valueType}
    })
    try {
      let record = await this.createRecordAndSaveMetadata(JSON.stringify(results), VITAL_SIGNS);
      this.props.navigation.state.params.onRecordAdded(record);
    } catch(e) {
      this.props.navigation.state.params.onRecordAddFailed();
    } finally {
      this.props.navigation.dispatch(backAction);
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title={`Add ${recordTypes[VITAL_SIGNS]}`} subtitle='Enter your results below.'/>

        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <Text h3 style={{textAlign: 'center', marginTop: 20}}>
            {recordTypes[VITAL_SIGNS]}
          </Text>
          <Text style={{textAlign: 'center'}}>
            Date: {moment().format('MMMM Do, YYYY')}
          </Text>

          <List containerStyle={{marginBottom: 20}}>
            { this.key_info.map((item) => (
              <View key={item.key+ '_view'} style={{flex:1}}>
                <ListItem
                  key={item.key}
                  title={item.title ? item.title : item.key}
                  titleStyle={{width:300}}
                  hideChevron={true}
                  textInput={true}
                  subtitle={this.state[item.key].error ? this.state[item.key].error : undefined}
                  subtitleStyle={{ color: 'red', width:300 }}
                  textInputPlaceholder={item.placeholder}
                  textInputValue={this.state[item.key].value}
                  textInputOnChangeText={(title) => this.onChangeValue(item.key, title)}
                  textInputKeyboardType='numeric'
                  textInputReturnKeyType={'done'}
                  textInputMaxLength={3}
                />
              </View>
              ))
            }
          </List>

          <View style={{ flex: 1}}>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.green}
                icon={{name: 'ios-add-circle', type: 'ionicon'}}
                title='Save'
                onPress={async () => this.addRecord()}
              />
            </View>
          </View>

          <View style={{ height: 200 }}/>
          
        </KeyboardAwareScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}
