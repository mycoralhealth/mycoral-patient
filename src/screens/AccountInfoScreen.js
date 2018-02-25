import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Avatar, Text } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'

import { CoralHeader, CoralFooter, colors } from '../ui.js';

import { keysExist, generateKeyPair, invalidateKeyPair } from '../utilities/pki';

import MessageIndicator from './MessageIndicator';

function CheckingForKeys(props) {
  return (
    <MessageIndicator message="Checking for keys" />
  );
}

function KeyInfo(props) {
  if (props.opInProgress) {
    return <MessageIndicator message={props.opInProgress.message} />
  }

  if (props.keysPresent) {
    return (
      <View style={{ flex: 1, marginBottom: 10}}>
        <Text style={{padding: 20, textAlign: 'center'}}>
          Coral Health keys generated and in use.
        </Text>
        <View style={{ flex: 1, marginTop: 10}}>
          <Button
                backgroundColor={colors.gray}
                icon={{name: 'trash-o', type: 'font-awesome'}}
                title='Revoke Keys'
                onPress={() => props.revokeKeys()}
              />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, marginBottom: 10}}>
        <Text style={{padding: 20, textAlign: 'center'}}>
          Coral Health keys are not present. To use the app please generate your own personal keys.
        </Text>
        <View style={{ flex: 1, marginTop: 10}}>
          <Button
                backgroundColor={colors.green}
                icon={{name: 'ios-key', type: 'ionicon'}}
                title='Generate Keys'
                onPress={() => props.generateKeys()}
              />
        </View>
      </View>
    );
  }
}

function Keys(props) {
  if (props.checkedKeys) {
    return (
      <KeyInfo 
        keysPresent={props.keysPresent}
        opInProgress={props.opInProgress}
        generateKeys={props.generateKeys}
        revokeKeys={props.revokeKeys}
        />
    );
  } else {
    return <CheckingForKeys />;
  }
}

export class AccountInfoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keysPresent : false,
      checkedKeys: false,
      opInProgress: null
    };
  }

  generateKeys() {
    this.setState({opInProgress:{message:'Generating keys, please wait this may take a while...'}});
    generateKeyPair()
      .then(() => this.setState({keysPresent:true, opInProgress: null}));
  }

  revokeKeys() {
    this.setState({opInProgress:{message:'Revoking keys...'}});
    invalidateKeyPair()
      .then(() => this.setState({keysPresent:false, opInProgress: null}));
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg }}>
        <CoralHeader title='Your Account' subtitle='Security and blockchain settings'/>

        <ScrollView centerContent={true}>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Keys 
              checkedKeys={this.state.checkedKeys}
              keysPresent={this.state.keysPresent}
              generateKeys={this.generateKeys.bind(this)}
              revokeKeys={this.revokeKeys.bind(this)}
              opInProgress={this.state.opInProgress}
            />
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }

  componentDidMount() {
    keysExist()
      .then((keysPresent) => this.setState({ keysPresent, checkedKeys: true }));
  }
}
