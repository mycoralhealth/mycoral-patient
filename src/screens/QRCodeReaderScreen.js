import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';

export class QRCodeReaderScreen extends Component {
  state = {
    hasCameraPermission: null,
    readBarcode: false
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
              title='Cancel'
              onPress={this.handleCancel}
            />
          </View>
        </View>
      );
    }
  }

  handleCancel = () => {
    this.props.navigation.state.params.onCancel();
    this.props.navigation.dispatch(NavigationActions.back());
  }

  handleBarCodeRead = ({ type, data }) => {
    if (this.state.readBarcode)
      return;

    this.setState({'readBarcode': true});

    this.props.navigation.state.params.onQRCodeScanned(type, data);
    this.props.navigation.dispatch(NavigationActions.back());

  }
}