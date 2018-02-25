import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';

import { CoralHeader, colors } from '../ui.js';
import store from '../utilities/store';

export class MyRecordsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { recordsList: [] };
  }

  /* We could load the data straight in the constructor
   * but this will set us on a way to eventually load from elsewhere.
   */
  componentDidMount() {
    store.records()
      .then((recordsList) => {this.setState({recordsList}); console.log('Records: ',recordsList);})
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader style={{ flex: 1}} title='My Medical Records' subtitle='View your records on the blockchain.'/>

        <ScrollView style={{ flex: 1}}>
          <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
            {
              this.state.recordsList.map((record) => (
                <ListItem
                  key={record.id}
                  title={record.name}
                  rightTitle={moment(record.date).format('MMM Do, YYYY')}
                  chevronColor={colors.red}
                  leftIcon={{name:'ios-document', type:'ionicon', color: '#ddd'}}
                  onPress={() => this.props.navigation.navigate('ViewRecord', {
                    record,
                    onRecordDeleted: this.removeRecord.bind(this)
                  })}
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
