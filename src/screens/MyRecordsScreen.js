import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements';
import nextFrame from 'next-frame';

import { CoralHeader, colors } from '../ui';
import store from '../utilities/store';
import MessageIndicator from './MessageIndicator';
import cryptoHelpers from '../utilities/crypto_helpers';

const RecordListItem = (props) => {
  let record = props.record;

  if (!record.encrypted) {
    return (
      <ListItem
        title={ (record.error) ? 'Decryption Error' : record.metadata.name }
        rightTitle={ (record.error) ? null : moment(record.metadata.date).format('MMM Do, YYYY') }
        chevronColor={colors.red}
        leftIcon={{ 
          style: { width: 30, textAlign: 'center' }, 
          name: (record.error) ? 'ios-key' : 'ios-document', 
          type: 'ionicon', 
          color: (record.error) ? colors.red : '#ddd' }}
        onPress={() => props.navigation.navigate('ViewRecord', {
          record,
          onRecordDeleted: props.onRecordDeleted
        })}
      />
    );
  } else {
    return (
      <ListItem
        avatar={<ActivityIndicator size="small" color={colors.gray} style={{marginRight: 10}} />} 
        chevronColor='#fff'
        title='Decrypting...'
      />
    );
  }
}

let cachedRecords = [];

export class MyRecordsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { recordsList: cachedRecords, loading: true };
  }

  componentDidMount() {
    this.loadAndDecryptRecords();
  }

  async loadAndDecryptRecords() {
    if (!cachedRecords || cachedRecords.length === 0) {
      cachedRecords = await store.records();
    }
    this.setState({recordsList: cachedRecords, loading: false});
    this.decryptRecords(cachedRecords);
  }

  async decryptRecords(recordsList) {
    let that = this;

    for (let record of recordsList) {
      if (record.encrypted) {
        await nextFrame();
        await this.decryptRecord(record);
        this.setState({ recordsList });
      }      
    }
  }

  async decryptRecord(record) {
    try {
      let decryptedResult = await cryptoHelpers.decryptMetadata(record.metadata, record.encryptionInfo.key, record.encryptionInfo.iv);
      record.metadata = decryptedResult.metadata;
      record.encrypted = false;
    } catch (e) {
      record.encrypted = false;
      record.error = true;
    }
  }

  newRecord(record) {
    store.addRecord(record)
      .then(async () => {
        cachedRecords = [...cachedRecords, record];
        await nextFrame();
        this.setState({ recordsList: cachedRecords });
      })
      .catch((e) => console.log(`Error adding record to store (${e})`));
  }

  removeRecord(record) {
    cachedRecords = cachedRecords.filter((r) => (record.id !== r.id))
    this.setState({ recordsList: cachedRecords });

    store.removeRecord(record)
      .catch((e) => console.log(`Error removing record from store (${e})`));
  }

  render() {
    if (this.state.loading) {
      return(
        <ScrollView centerContent={true}>
          <MessageIndicator message='Loading data...' />
        </ScrollView>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader style={{ flex: 1}} title='My Medical Records' subtitle='View your records on the blockchain.'/>

        <ScrollView style={{ flex: 1}}>
          <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
            {
              this.state.recordsList.map((record) => (
                <RecordListItem
                  key={record.id}
                  record={record}
                  navigation={this.props.navigation}
                  onRecordDeleted={this.removeRecord.bind(this)}
                />
              ))
            }
          </List>
          <View style={{ flex: 1, marginBottom: 20}}>
            <Button
              backgroundColor={colors.red}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Record' 
              onPress={() => this.props.navigation.navigate('AddRecord', {onRecordAdded: this.newRecord.bind(this)})}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
