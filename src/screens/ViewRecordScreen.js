import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { FileSystem } from 'expo';

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { PHOTO_RECORD_TEST } from './common';

const backAction = NavigationActions.back();

const RecordDetails = (props) => {
  console.log('Record type', props.record.testType);

  if (props.record.testType === PHOTO_RECORD_TEST) {
    return (
      <View style={{ flex: 1, marginBottom: 40, marginTop: 20}}>
        <Button
          backgroundColor={colors.white}
          color='#000'
          icon={{name: 'ios-image', type: 'ionicon', color:'#000'}}
          title='View Photo Record'
          onPress={async () => {
            let url = props.record.decryptedData;
            if (props.record.decryptedData) {
              let imgData = await FileSystem.readAsStringAsync(props.record.results.uri);
              url = `data:image/jpeg;base64,${imgData}`;
            }
            props.navigation.navigate('ViewImage', { images: [{ url }] })
          }}
        />
      </View>
    );
  } else {
    return (
      <List containerStyle={{marginBottom: 20}}>
        {
          props.record.results.map((item) => (
            <ListItem
              key={item.key}
              title={item.key}
              hideChevron={true}
              rightTitle={(item.value == '') ? ' ' : item.value}
              rightTitleStyle={{ color: 'black', fontSize: 20, fontFamily: (Platform.OS === 'ios') ? 'Courier' : 'monospace', fontWeight: 'bold'}}
            />
          ))
        }
      </List>
    );
  }
}

export class ViewRecordScreen extends Component {
  onRecordDeleted(record) {
    this.props.navigation.state.params.onRecordDeleted(record);
    this.props.navigation.dispatch(backAction);
  }

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

          <RecordDetails record={record} navigation={this.props.navigation} />

          <View style={{ flex: 1}}>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.green}
                icon={{name: 'stethoscope', type: 'font-awesome'}}
                title='Request Health Tip'
                onPress={() => this.props.navigation.navigate('RequestHealthTip')}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.gray}
                icon={{name: 'verified-user', type: 'material'}}
                title='Access Sharing'
                onPress={() => this.props.navigation.navigate('DelegateAccess', {record})}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 10, marginTop: 10}}>
              <Button
                backgroundColor={colors.darkerGray}
                icon={{name: 'trash-o', type: 'font-awesome'}}
                title='Delete'
                onPress={() => this.onRecordDeleted(record)}
              />
            </View>
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}