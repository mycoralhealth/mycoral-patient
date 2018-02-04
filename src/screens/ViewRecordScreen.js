import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';

const backAction = NavigationActions.back();

export class ViewRecordScreen extends Component {
  render() {
    const record = this.props.navigation.state.params.record;

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader title='View Medical Record' subtitle='Your record has been decrypted below.'/>

        <ScrollView style={{ flex: 1}}>
          <Text h3 style={{textAlign: 'center', marginTop: 20}}>
            {record.name}
          </Text>
          <Text style={{textAlign: 'center'}}>
            Date: {moment(record.date).format('MMMM Do, YYYY')}
          </Text>

          <List containerStyle={{marginBottom: 20}}>
            {
              record.results.map((item) => (
                <ListItem
                  key={item.key}
                  title={item.key}
                  hideChevron={true}
                  rightTitle={(item.value == '') ? ' ' : item.value}
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
              onPress={() => this.props.navigation.navigate('DelegateAccess', {record})}
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