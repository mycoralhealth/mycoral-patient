import moment from 'moment'
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';
import { TestRecordScreen } from './TestRecordScreen';

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

    let record = this.createRecord(this.props.navigation.state.params.recordsList, results, 'blood test');

    this.props.navigation.state.params.onRecordAdded(record);
    this.props.navigation.dispatch(backAction);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Blood Test' subtitle='Enter your results below.'/>

        <ScrollView>
          <Text h3 style={{textAlign: 'center', marginTop: 20}}>
            Blood Test
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

          <View>
            <Button
              style={{marginBottom: 10}}
              backgroundColor={colors.green}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Record' 
              onPress={() => this.addRecord()}
            />
            <Button
              style={{ marginBottom: 20 }}
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
