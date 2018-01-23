import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
const backAction = NavigationActions.back();

import { CoralHeader, colors } from '../ui.js';

const record = {
  "username":"123456",
  "email":"andy@mycoralhealth.com",
  "ethAddress":"0x8A09990601E7FF5CdccBEc6E9dd0684620a21a29",
  "IPFSaddr":"QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6",
  "testType":"Basic Blood Test",
  "date":"2017-10-02",
  "results": [
    {"key":"Cholesterol","value":"180"},
    {"key":"HbA1c","value":"6.0"},
    {"key":"hsCRP","value":"2.5"}
  ]
}


export class ViewRecordScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg  }}>
        <CoralHeader title='View Medical Record' subtitle='Your record has been decrypted below.'/>

        <Text h3 style={{textAlign: 'center', marginTop: 20}}>
          Basic Blood Test
        </Text>
        <Text style={{textAlign: 'center'}}>
          Date: Oct 2, 2017
        </Text>

        <List containerStyle={{marginBottom: 20}}>
          {
            record.results.map((item, i) => (
              <ListItem
                key={i}
                title={item.key}
                hideChevron={true}
                rightTitle={item.value}
                rightTitleStyle={{ color: 'black', fontSize: 20, fontFamily: 'Courier', fontWeight: 'bold'}}
              />
            ))
          }
        </List>

        <View>
          <Button
            style={{marginBottom: 10}}
            backgroundColor={colors.green}
            icon={{name: 'stethoscope', type: 'font-awesome'}}
            title='Request Health Tip'
            onPress={() => this.props.navigation.navigate('RequestHealthTip')}
          />
          <Button
            style={{marginBottom: 10}}
            backgroundColor={colors.gray}
            icon={{name: 'verified-user', type: 'material'}}
            title='Delegate Access'
            //onPress={() => this.props.navigation.navigate('TODO')}
          />
          <Button
            style={{ marginBottom: 20 }}
            backgroundColor={colors.red}
            icon={{name: 'ios-arrow-back', type: 'ionicon'}}
            title='Back'
            onPress={() => this.props.navigation.dispatch(backAction)}
          />
        </View>

      </View>
    );
  }
}