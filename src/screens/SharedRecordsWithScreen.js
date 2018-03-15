import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { Button, List, ListItem, Text, Avatar } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import nextFrame from 'next-frame';

import { CoralHeader, colors, CoralFooter, MessageIndicator } from '../ui';
import store from '../utilities/store';
import cryptoHelpers from '../utilities/crypto_helpers';

const RecordListItem = (props) => {
  let record = props.record;

  if (record.decrypted) {
    return (
      <ListItem
        title={ (record.error) ? 'Decryption Error' : record.metadata.name }
        rightTitle={ (record.error) ? null : moment(record.metadata.date).format('MMM Do, YYYY') }
        chevronColor={colors.red}
        leftIcon={{ 
          style: { width: 30, textAlign: 'center' }, 
          name: (record.error) ? 'ios-key' : 'ios-document', 
          type: 'ionicon', 
          color: (record.error) ? colors.red : '#ddd' }
        }
        onPress={() => props.navigation.navigate('ViewSharedRecord', { 
          record,
          onRecordDeleted: props.onRecordDeleted
          }) 
        }
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

export class SharedRecordsWithScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { recordsList: this.props.navigation.state.params.records, contact: this.props.navigation.state.params.contact };
  }

  componentDidMount() {
    this.decryptRecords(this.state.recordsList);
  }

  removeRecord(record) {
    let newRecords = this.state.recordsList.filter((r) => (record.id !== r.id))
    this.setState({ recordsList: newRecords });

    store.removeSharedRecord(this.state.contact.name, record)
      .catch((e) => console.log(`Error removing shared record from store (${e})`));

    this.props.navigation.state.params.onRecordsChanged();

    if (newRecords.length === 0) {
      this.props.navigation.dispatch(NavigationActions.back());  
    }
  }

  async decryptRecords(recordsList) {
    let that = this;
    let myRecords = await store.records();

    let realRecords = [];

    for (let entry of recordsList) {
      let realRecord = null;

      if (!this.state.contact.external) {
        realRecord = myRecords.find((r) => (r.id === entry.id));
      } else {
        realRecord = entry.record;
      }


      if (realRecord) {
        realRecord.sharedHash = entry.record.sharedHash;
        realRecord.contact = this.state.contact;

        realRecords.push(realRecord);
      } else {
        entry.decrypted = true;
        entry.error = true;
        realRecords.push(entry);
      }
    }
    
    this.setState({ recordsList: realRecords });

    for (let record of realRecords) {
      if (!record.error) {
        await nextFrame();
        await this.decryptRecord(record);
        this.setState({ recordsList: realRecords });
      }
    }
  }

  async decryptRecord(record) {

    console.log('Decrypting record');
    console.log({record});

    try {
      let decryptedResult = await cryptoHelpers.decryptMetadata(record.metadata, record.encryptionInfo.key, record.encryptionInfo.iv);
      record.metadata = decryptedResult.metadata;
    } catch (e) {
      console.log('Error decrypting record', e);
      record.error = true;      
    } finally {
      record.decrypted = true;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader style={{ flex: 1}} title='Shared Medical Records' subtitle={`Your shared medical records with ${this.state.contact.nickname}.`}/>

        <ScrollView style={{ flex: 1}}>
          <View style={{alignSelf: 'center', marginTop: 20}}>
            <Avatar            
              large
              rounded
              source={{uri:this.state.contact.picture}}
            />
          </View>
          <Text style={{textAlign: 'center', marginTop: 20, color: colors.darkerGray }}>
            Shared with contact
          </Text>
          <Text h4 style={{textAlign: 'center', marginTop: 10, marginBottom: 30}}>
            {this.state.contact.name}
          </Text>
          <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
            {
              this.state.recordsList.map((record) => (
                <RecordListItem
                  key={record.id}
                  record={record}
                  onRecordDeleted={this.removeRecord.bind(this)}
                  navigation={this.props.navigation}
                />
              ))
            }
          </List>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }
}
