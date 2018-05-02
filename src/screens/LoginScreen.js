import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { AuthSession } from 'expo';
import { NavigationActions } from 'react-navigation';

import store from '../utilities/store';
import { colors, MessageIndicator } from '../ui';
import { CORALD_API } from '../const';

const auth0ClientId = 'u79wUql80IzN7AuLDqv3NIeC8XmtMEuq';
const auth0Domain = 'https://mycoralhealth.auth0.com';

function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function UnauthorizedException() {}

export class LoginScreen extends Component {
  state = {
    loggedIn: false,
    loading: false,
  }

  async componentDidMount() {
    // Load the existing accessToken (if any)
    // and call setState to trigger componentDidUpdate
    // and kick off our state machine
    let userInfo = await store.getUserInfo();
    if (userInfo) {
      this.setState({accessToken: userInfo.accessToken});
    } else {
      this.setState({accessToken: undefined});
    }
  }

  // componentDidUpdate performs state transitions for our state machine
  async componentDidUpdate() {

    if (this.state.loggedIn) {
      // Logged in: navigate to the app
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "MainTabs" })],
      });
      return this.props.navigation.dispatch(resetAction);
    }

    if (this.state.loading || this.state.error) {
      // Do nothing (the render function takes care of these states)
      return;
    }

    if (this.state.accessToken && !this.state.loading) {
      // We have an accessToken, but it needs to be validated
      this._getSession(this.state.accessToken);
      this.setState({loading: true});
      return;
    }

    // We don't have an accessToken, so we need to show the login dialog
    this._loginWithAuth0();
  }

  // Perform login with Auth0 to get an accessToken
  _loginWithAuth0 = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${auth0Domain}/authorize` + toQueryString({
        client_id: auth0ClientId,
        response_type: 'token',
        scope: 'openid profile',
        redirect_uri: redirectUrl,
      }),
    });

    if (result.type === 'success') {
      if (result.params.error) {
        // If an error was returned from Auth0
        this.setState({error: JSON.stringify(result.params)});
        return;
      }
      this.setState({accessToken: result.params.access_token});
    } else if (result.type === 'cancel') {
      this.setState({error: "User canceled"});
    } else if (result.type === 'error' && result.errorCode === 'login-declined') {
      this.setState({error: "User declined"});
    } else {
      this.setState({error: JSON.stringify(result)});
    }
  }

  // Validate accessToken and get user metadata via corald
  _getSession = async (accessToken) => {
    let response = await fetch(`${CORALD_API}/session`, {"headers": {"X-MyCoral-AccessToken": accessToken}})
    if (response.status === 200) {
      let userInfo = await response.json();
      userInfo.accessToken = accessToken;
      await store.setUserInfo(userInfo);
      this.setState({loggedIn: true});
    } else if (response.status === 401) {
      // Access token is invalid
      this.setState({loading: false, accessToken: undefined});
    } else {
      // Some other error
      this.setState({loading: false, error: response.statusText || "Connection failed"});
    }
  };

  render() {
    if (this.state.loading) {
      return(
        <View style={styles.container} centerContent={true}>
          <MessageIndicator message='Fetching user data...' />
        </View>
      );
    }

    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text>An error occurred while logging in:</Text>
          <Text style={styles.error}>{this.state.error}</Text>
          <Button
          backgroundColor={colors.green}
          color='white'
          icon={{name: 'ios-log-in', type: 'ionicon'}}
          title='Login'
          onPress={() => {this.setState({error: undefined});}}
        />
        </View>
      );
    }

    // Show an empty screen (this is shown behind the WebBrowser, for example)
    return (
      <View style={styles.container}></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: colors.gray,
    marginBottom: 20
  }
});
