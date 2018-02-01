import moment from 'moment';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';

import { CoralHeader, colors } from '../ui.js';
import recordsList from '../data/results.json';

export class MyRecordsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { recordsList: [] };
  }

  /* We could load the data straight in the constructor
   * but this will set us on a way to eventually load from elsewhere.
   */
  componentDidMount() {
    this.setState({recordsList});
  }

  newRecord(record) {
    let recordsList = this.state.recordsList;
    recordsList.push(record);
    this.setState({recordsList});
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader title='My Medical Records' subtitle='View your records on the blockchain.'/>

        <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
          {
            this.state.recordsList.map((record) => (
              <ListItem
                key={record.record_id}
                title={record.name}
                rightTitle={moment(record.date).format('MMM Do, YYYY')}
                chevronColor={colors.red}
                leftIcon={{name:'ios-document', type:'ionicon', color: '#ddd'}}
                onPress={() => this.props.navigation.navigate('ViewRecord', {record})}
              />
            ))
          }
        </List>
        <Button
          backgroundColor={colors.red}
          icon={{name: 'ios-add-circle', type: 'ionicon'}}
          title='Add record' 
          onPress={() => this.props.navigation.navigate('AddRecord', {recordsList: recordsList, onRecordAdded: this.newRecord.bind(this)})}
        />
      </View>
    );
  }
}