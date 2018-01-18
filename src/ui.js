import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-elements';

export const colors = {
  'bg': '#eee',
  'green': '#1db495',
  'red': '#f10d34'
}

export class CoralHeader extends React.Component {
  render() {
    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.green, borderTopWidth: 1, borderTopColor: colors.green, marginTop: 20}}>
        <View style={{ backgroundColor: 'white', width: 80, height: 80, justifyContent: 'center'}}>
          <Image style={{ width: 80, height: 80 }} source={require('../assets/corner-logo.png')} />
        </View>
        <View style={{ backgroundColor: colors.green, height: 80, padding: 20, flex: 1, justifyContent: 'center'}}>
          <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>{this.props.title}</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', textAlign: "center" }}>{this.props.subtitle}</Text>
        </View>
      </View>
    );
  }
}