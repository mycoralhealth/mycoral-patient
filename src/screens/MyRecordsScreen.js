import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';

import { CoralHeader, colors } from '../ui.js';

const recordList = [
  {
    name: 'Basic Heart Metrics',
    date: '2017-07-01'
  },
  {
    name: 'Genetic',
    date: '2016-11-20'
  },
  {
    name: 'Blood',
    date: '2016-10-29'
  }
];
export class MyRecordsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader title='My Medical Records' subtitle='View your records on the blockchain.'/>

        <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
          {
            recordList.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                rightTitle={l.date}
                chevronColor={colors.red}
                leftIcon={{name:'ios-document', type:'ionicon', color: '#ddd'}}
                onPress={() => this.props.navigation.navigate('ViewRecord')}
              />
            ))
          }
        </List>
        <Button
          backgroundColor={colors.red}
          icon={{name: 'ios-add-circle', type: 'ionicon'}}
          title='Add record' />
      </View>
    );
  }
}