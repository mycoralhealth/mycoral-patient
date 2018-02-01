import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';
const backAction = NavigationActions.back();

export class QRCodeReaderScreen extends Component {
  state = {
    hasCameraPermission: null,
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeRead={this.handleBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end'}}>
            <Button
              style={{flex: 1}}
              title='Cancel Scan'
              onPress={() => this.props.navigation.dispatch(backAction)}
            />
          </View>
        </View>
      );
    }
  }

  handleBarCodeRead = ({ type, data }) => {
    this.props.navigation.state.params.onQRCodeScanned(type, data);
    this.props.navigation.dispatch(backAction);
  }
}