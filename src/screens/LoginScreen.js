import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { AuthSession } from 'expo';

import store from '../utilities/store';
import { colors, MessageIndicator } from '../ui';

const auth0ClientId = 'u79wUql80IzN7AuLDqv3NIeC8XmtMEuq';
const auth0Domain = 'https://mycoralhealth.auth0.com';
const coraldServer = 'https://api.mycoralhealth.com/v0';

function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export class LoginScreen extends Component {
  state = {
    name: undefined
  }

  constructor(props) {
    super(props);

    if (this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.logout) {
      this.state = {needsLogin: true};
    }
  }

  async componentDidMount() {
    if (!this.state.needsLogin) {
      let userInfo = await store.getUserInfo();

      this.setState({userInfo});

      if (!this.state.userInfo) {
        console.log("No name, doing login");
        this._loginWithAuth0();
      } else {
        console.log("already logged in");
        this.continueToApp();
      }
    }
  }

  continueToApp() {
    this.props.navigation.navigate('MainTabs');
  }

  _loginWithAuth0 = async () => {
    this.setState({needsLogin: false});
    
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log(`Redirect URL: ${redirectUrl}`);
    const result = await AuthSession.startAsync({
      authUrl: `${auth0Domain}/authorize` + toQueryString({
        client_id: auth0ClientId,
        response_type: 'token',
        scope: 'openid profile',
        redirect_uri: redirectUrl,
      }),
    });

    console.log(result);

    if (result.type === 'success') {
      if (result.params.error) {
        Alert.alert('Error', result.params.error_description
          || 'something went wrong while logging in');
        return;
      }

      this.getUserInfo(result.params);
    } else {
      this.setState({needsLogin: true});
    }
  }

  // Get user metadata via corald
  getUserInfo = (responseObj) => {

    fetch(`${coraldServer}/session`, {"headers": {"X-MyCoral-AccessToken": responseObj.access_token}})
      .then(response => {
        if (response.status === 200) {
          response.json().then(async (userInfo) => {
            console.log(userInfo);
            
            userInfo.accessToken = responseObj.access_token;

            await store.setUserInfo(userInfo);

            this.setState({ userInfo });

            this.continueToApp();
          })
        }
        else {
          Alert.alert('Corald Error' + response.status, response.body || 'Connection failed');
        }
      })
  }

  render() {
    if (!this.state.needsLogin) {
      return (
        <View style={styles.container}>
          <MessageIndicator message='Logging in...' />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: 'white', width: 206, height: 100, marginBottom: 20, justifyContent: 'center'}}>
          <Image style={{ width: 206, height: 100 }} source={require('../../assets/logo.png')} />
        </View>
        <Text style={{textAlign: 'center', marginBottom: 20, marginLeft: 20, marginRight: 20}}>
          You are logged-out of My Coral Health
        </Text>
        <View>
          <Button 
            backgroundColor={colors.green}
            title="Login with Auth0" 
            onPress={this._loginWithAuth0} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
