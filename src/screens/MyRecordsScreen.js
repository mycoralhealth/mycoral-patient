import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements';

import { CoralHeader, colors } from '../ui.js';
import store from '../utilities/store';
import MessageIndicator from './MessageIndicator';
import cryptoHelpers from '../utilities/crypto_helpers';

const RecordListItem = (props) => {
  let record = props.record;

  if (!record.encrypted) {
    return (
      <ListItem
        title={record.name}
        rightTitle={moment(record.date).format('MMM Do, YYYY')}
        chevronColor={colors.red}
        leftIcon={{name:'ios-document', type:'ionicon', color: '#ddd'}}
        onPress={() => props.navigation.navigate('ViewRecord', {
          record,
          onRecordDeleted: props.onRecordDeleted
        })}
      />
    );
  } else {
    new Promise(async function(resolve) {
      let decryptionResult = await cryptoHelpers.decryptFile(record.results.uri);
      record.results.uri = decryptionResult.decryptedUri;

      props.onRecordDecrypted(record);
    });

    return (
      <ListItem
        avatar={<ActivityIndicator size="small" color={colors.gray} style={{marginRight: 10}} />} 
        chevronColor='#fff'
        title='Decrypting...'
      />
    );
  }
}

export class MyRecordsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { recordsList: [], loading: true };
  }

  /* We could load the data straight in the constructor
   * but this will set us on a way to eventually load from elsewhere.
   */
  componentDidMount() {
    store.records()
      .then((recordsList) => {
        this.setState({recordsList, loading: false}); 
      })
      .catch((e) => console.log(`Error fetching records from store (${e})`));      
  }

  newRecord(record) {
    store.addRecord(record)
      .then((recordsList) => this.setState({recordsList}))
      .catch((e) => console.log(`Error adding record to store (${e})`));
  }

  removeRecord(record) {
    store.removeRecord(record)
      .then((recordsList) => this.setState({recordsList}))
      .catch((e) => console.log(`Error removing record from store (${e})`));
  }

  recordDecrypted(record) {
    record.decrypted = true;
    this.setState({ recordsList: this.state.recordsList.map(function(r) { return (r.id === record.id) ? record : r; }) });
  }

  render() {
    if (this.state.loading) {
      return(
        <ScrollView centerContent={true}>
          <MessageIndicator message='Loading...' />
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
                  onRecordDecrypted={this.recordDecrypted.bind(this)}
                />
              ))
            }
          </List>
          <View style={{ flex: 1, marginBottom: 20}}>
            <Button
              backgroundColor={colors.red}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Record' 
              onPress={() => this.props.navigation.navigate('AddRecord', {
                onRecordAdded: this.newRecord.bind(this)
              })}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
