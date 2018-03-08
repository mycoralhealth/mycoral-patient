import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { AuthSession } from 'expo';

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

    if (this.state.name === undefined) {
      console.log("No name, doing login");
      this._loginWithAuth0();
    } else {
      console.log("already logged in");
      this.continueToApp();
    }

  }

  continueToApp() {
    this.props.navigation.navigate('MainTabs');
  }

  _logout = async() => {
    // FIXME: This should logout from Auth0 too
    this.setState({ "name": undefined });
  }

  _loginWithAuth0 = async () => {
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
    }
  }

  // Get user metadata via corald
  getUserInfo = (responseObj) => {

    fetch(`${coraldServer}/session`, {"headers": {"X-MyCoral-AccessToken": responseObj.access_token}})
      .then(response => {
        if (response.status === 200) {
          response.json().then(parsedResponse => {
            console.log(parsedResponse);
            const { name, picture } = parsedResponse

            this.setState({ name });
            this.continueToApp();
          })
        }
        else {
          Alert.alert('Corald Error' + response.status, response.body || 'Connection failed');
        }
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Button title="Login with Auth0" onPress={this._loginWithAuth0} />
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
