import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { CoralHeader, CoralFooter, colors } from '../ui.js';
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
        <CoralHeader title='Share Record' subtitle="Share this record with another user."/>

        <KeyboardAwareScrollView style={{ flex: 1}} centerContent={true}>
          <View>
            <Text h4 style={{textAlign: 'center', marginTop: 20}}>
              Enter Recipient's Address
            </Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, paddingHorizontal: 10}}
              onChangeText={(text) => this.setState({address: text})}
              placeholder={blockchainAddress}
              returnKeyType='done'
              value={this.state.address}
            />
          </View>

          <View style={{flex: 1}}>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.green}
                icon={{name: 'check', type: 'font-awesome'}}
                title='Share Record'
                onPress={this.handleDone}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <CoralFooter backAction={this.handleCancel}/>
      </View>
    );
  }

}
