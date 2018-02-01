import React from 'react';

import { View, ScrollView, Picker } from 'react-native';
import { List, ListItem, CheckBox } from 'react-native-elements'

import { CoralHeader, colors } from '../../ui.js';

export function RecordInputView(props){
  switch(props.recordType) {
    case 'basic heart':
      return <AddBloodTestRecord input={props.basicHeartRecordInput} onChange={props.onBloodTestRecordChange}/>;
    case 'genetic':
      return <AddGeneticTestRecord input={props.geneticRecordInput} onChange={props.onGeneticRecordChange}/>;
  }

  return <View></View>;
}

AddGeneticTestRecord = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg  }}>
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
                  onPress={() => props.onChange(item, index)}
                  checked={props.input.checked[index]}
                />
              }
              hideChevron={true}
            />
          ))
        }
      </List>
    </View>
  );
}

AddBloodTestRecord = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg  }}>
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
              textInputValue={props.input[item.key]}
              textInputOnChangeText={(title) => props.onChange(item.key, title)}
              textInputReturnKeyType={'done'}
            />
          ))
        }
      </List>
    </View>
  );
}
