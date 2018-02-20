import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Avatar, Text } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { ActivityIndicator } from 'react-native';

import { keysExist, generateKeyPair } from '../utilities/pki';


//invalidateKeyPair().then(() => generateKeyPair());

function CheckingForKeys(props) {
  return (
    <View>
      <Text h4>Checking for keys</Text>
      <ActivityIndicator size="large" color={colors.green} style={{marginTop: 10}}/>
    </View>
  );
}

function KeyInfo(props) {
  return (
    <Text h4>Keys</Text>
  );
}

function Keys(props) {
  if (props.checkedKeys) {
    return <KeyInfo />;
  } else {
    return <CheckingForKeys />;
  }
}

export class AccountInfoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keysPresent : false,
      checkedKeys: false
    };
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
            />
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }

  componentDidMount() {
    keysExist()
      .then((keysPresent) => this.setState({ keysPresent, checkedKeys: false }));
  }
}
