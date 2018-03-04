import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, FormLabel, FormInput } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { CoralHeader, CoralFooter, colors } from '../ui.js';

import store from '../utilities/store';

import MessageIndicator from './MessageIndicator';

function Loading(props) {
  return (
    <MessageIndicator message="Loading info..." />
  );
}

export class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }

  async componentDidMount() {
    let userName = await store.getUserName();
    let email = await store.getEmail();

    this.setState({
      loading: false,
      userName,
      email
    });
  }

  updateUserName(userName) {
    this.setState({ userName });
    store.setUserName(userName);
  }

  updateEmail(email) {
    this.setState({ email });
    store.setEmail(email);
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.bg }}>
          <Loading />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg }}>
        <CoralHeader title='User Profile' subtitle='Your email address and identity settings'/>

        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <Text h4 style={{textAlign: 'left', marginTop: 20, marginLeft: 20}}>
            Profile details
          </Text>
          <FormLabel>Email address</FormLabel>
          <FormInput 
            value={this.state.email}
            keyboardType='email-address'
            returnKeyType='done'
            autoCapitalize='none'
            placeholder='someone@example.com'
            onChangeText={(text) => this.updateEmail(text)}/>
          <FormLabel>User name</FormLabel>
          <FormInput 
            value={this.state.userName}
            placeholder='someone'
            autoCapitalize='none'
            returnKeyType='done'
            onChangeText={(text) => this.updateUserName(text)}/>
          <View style={{ height: 100 }}/>

        </KeyboardAwareScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }
}
