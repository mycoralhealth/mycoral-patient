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
    name: undefined,
  };

  _logout = async() => {
    this.setState({ "name": undefined });
  }

  _loginWithAuth0 = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log(`Redirect URL (add this to Auth0): ${redirectUrl}`);
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
      this.handleParams(result.params);
    }
  }

  handleParams = (responseObj) => {
    if (responseObj.error) {
      Alert.alert('Error', responseObj.error_description
        || 'something went wrong while logging in');
      return;
    }

    /*
    // Get user metadata directly from Auth0
    fetch(`${auth0Domain}/userinfo?access_token=${responseObj.access_token}`)
      .then(response => {
        if (response.status === 200) {
          response.json().then(parsedResponse => {
            console.log(parsedResponse);
            const { name, email, picture } = parsedResponse

            this.setState({ name });
          })
        }
        else {
          console.log('Something went wrong. ErrorCode: ', response.status);
        }
      })
     */

    // Get user metadata via our server
    fetch(`${coraldServer}/session`, {"headers": {"X-MyCoral-AccessToken": responseObj.access_token}})
      .then(response => {
        if (response.status === 200) {
          response.json().then(parsedResponse => {
            console.log(parsedResponse);
            const { name, picture } = parsedResponse

            this.setState({ name });
          })
        }
        else {
          console.log('Something went wrong. ErrorCode: ', response.status);
        }
      })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.name !== undefined ?
          <View>
            <Text style={styles.title}>Hi {this.state.name}!</Text>
            <Button
              title='Continue'
              onPress={() => this.props.navigation.navigate('MainTabs')}
              style={styles.continue}
            />
            <Button title="Logout" onPress={this._logout} />
          </View> :
          <View>
            <Button title="Login with Auth0" onPress={this._loginWithAuth0} />
          </View>
        }
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
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  continue: {
    marginBottom: 20
  }
});
