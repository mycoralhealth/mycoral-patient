import moment from 'moment'
import React from 'react';
import { View } from 'react-native';
import { Button, List, ListItem, Text, CheckBox } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { TestRecordScreen } from './TestRecordScreen';

const backAction = NavigationActions.back();

export class AddGeneticTestRecordScreen extends TestRecordScreen {

  constructor(props) {
    super(props);

    this.state = {checked:[false, false]};
  }

  onChangeValue(index) {
    let state = this.state;
    this.state.checked[index] = !this.state.checked[index];
    this.setState(state);
  }

  addRecord() {
    let results = [
      {"key":"BRCA1", "value": (this.state.checked[0]) ? "positive" : "negative", "type":"gene", "valueType":"mutation"},
      {"key":"BRCA2", "value": (this.state.checked[1]) ? "positive" : "negative", "type":"gene", "valueType":"mutation"}
    ];

    let record = this.createRecord(this.props.navigation.state.params.recordsList, results, 'genetic');

    console.log(record);

    this.props.navigation.state.params.onRecordAdded(record);
    this.props.navigation.dispatch(backAction);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Genetic Test' subtitle='Enter your results below.'/>

        <Text h3 style={{textAlign: 'center', marginTop: 20}}>
          Genetic Test
        </Text>
        <Text style={{textAlign: 'center'}}>
          Date: {moment().format('MMMM Do, YYYY')}
        </Text>

        <List containerStyle={{marginBottom: 20}}>
          {
            [
              {"key":"BRCA1"},
              {"key":"BRCA2"}
            ].map((item, index) => (
              <ListItem
                key={item.key}
                title={
                  <CheckBox
                    title={item.key}
                    onPress={() => this.onChangeValue(index)}
                    checked={this.state.checked[index]}
                  />
                }
                hideChevron={true}
              />
            ))
          }
        </List>

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.green}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Save'
              onPress={() => this.addRecord()}
            />
          </View>
        </View>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}
