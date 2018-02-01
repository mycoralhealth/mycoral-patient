import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';

const backAction = NavigationActions.back();

export class AddRecordScreen extends Component {
  constructor(props) {
  	super(props);

  	this.state = {'currentRecord' : null};
  }

  currentRecordView() {
  	return (<View></View>);
  }

  render() {
    const state = this.props.navigation.state;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Medical Record' subtitle='Scan QR code or enter a record manually.'/>

        <ScrollView>
          <Button
            style={{marginBottom: 10, marginTop: 20}}
            backgroundColor={colors.gray}
            icon={{name: 'qrcode', type: 'font-awesome'}}
		    title='Scan QR code'
            onPress={() => this.props.navigation.navigate('QRCodeReader')}
          />

        <Text style={{ margin: 20, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)', textAlign:"center" }}>Or enter record manually</Text>

        <Button
          style={{ marginBottom: 20 }}
          backgroundColor={colors.red}
          icon={{name: 'ios-arrow-back', type: 'ionicon'}}
          title='Back'
          onPress={() => this.props.navigation.dispatch(backAction)}
        />

        </ScrollView>

      </View>
    );
  }
}