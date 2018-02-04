import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { CoralHeader, colors } from '../ui.js';
import { blockchainAddress } from './common';

export class DelegateAccessEntryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {'address':''};
  }

  handleDone = () => { 
    this.props.navigation.state.params.onManualEntry(this.state.address);
    this.props.navigation.dispatch(NavigationActions.back());
  }

  handleCancel = () => {
    this.props.navigation.state.params.onCancel();
    this.props.navigation.dispatch(NavigationActions.back());
  }

  render() {    
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Share Record' subtitle="Enter the blockchain address of the person you'd like to share this record with"/>

        <KeyboardAwareScrollView style={{ flex: 1}}>
          <View>
            <Text h4 style={{textAlign: 'center', marginTop: 20}}>
              Enter Recipient's Blockchain Address
            </Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, paddingHorizontal: 10}}
              onChangeText={(text) => this.setState({address: text})}
              placeholder={blockchainAddress}
              returnKeyType='done'
              value={this.state.address}
            />
          </View>

          <View>
            <Button
              style={{marginBottom: 10}}
              backgroundColor={colors.green}
              icon={{name: 'check', type: 'font-awesome'}}
              title='Share Record'
              onPress={this.handleDone}
            />
            <Button
              style={{ marginBottom: 20 }}
              backgroundColor={colors.red}
              icon={{name: 'ios-arrow-back', type: 'ionicon'}}
              title='Back'
              onPress={this.handleCancel}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

}
