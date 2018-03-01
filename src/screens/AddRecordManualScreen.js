import React, { Component } from 'react';
import { View, ScrollView, Modal, TouchableHighlight } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';
import { ImagePicker, FileSystem } from 'expo';

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { blockchainAddress, PHOTO_RECORD_TEST } from './common';
import MessageIndicator from './MessageIndicator';
import ipfs from '../utilities/expo-ipfs';
import { TestRecordScreen } from './TestRecordScreen';
import cryptoHelpers from '../utilities/crypto_helpers';

export class AddRecordManualScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.state = { uploadingImage: false, modalVisible: false };
  }

  onRecordAdded(record) {
    this.props.navigation.state.params.onRecordAdded(record);
    this.setState({ modalVisible: true });
  }

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
    });

    this.handleImagePicked(pickerResult);
  }

  pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
    });

    this.handleImagePicked(pickerResult);
  }

  handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploadingImage: true });

      if (!pickerResult.cancelled) {
        let record = await this.createRecord(pickerResult.base64, PHOTO_RECORD_TEST);

        FileSystem.deleteAsync(pickerResult.uri, { idempotent: true });

        this.onRecordAdded(record);
      }
    } catch (e) {
      console.log({ e });
    } finally {
      this.setState({ uploadingImage: false });
    }
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'MyRecords' })
      ]
    });

    const state = this.props.navigation.state;

    if (this.state.uploadingImage) {
      return (
        <ScrollView centerContent={true}>
          <MessageIndicator message='Encrypting and uploading your photo record' />
        </ScrollView>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Medical Record' subtitle='Add your medical record to the blockchain.'/>

        <ScrollView centerContent={true}>
          <Modal
            animationType="slide"
            transparent={false}
            onRequestClose={this.hideModal.bind(this)}
            visible={this.state.modalVisible} >
            <View style={{marginTop: 25, alignItems: 'center'}}>
              <View style={{ flex: 1 }}>
                <Text h3 style={{textAlign: 'center', marginTop: 20}}>
                  New Record Added
                </Text>
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  You can add more medical records or go back to the records list.
                </Text>

                <View style={{ flex: 1, marginTop: 20, width: 180, height: 40, alignSelf: 'center'}}>
                  <Button
                    backgroundColor={colors.lighterGray}
                    title='Close'
                    onPress={this.hideModal.bind(this)}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Text style={{padding: 20}}>
            Upload your own medical record to the blockchain by taking a photo, or filling out a questionaire.
          </Text>

          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.darkerGray}
              icon={{name: 'ios-camera', type: 'ionicon'}}
              title='Add Photo Record'
              onPress={() => this.takePhoto()}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.darkerGray}
              icon={{name: 'ios-image', type: 'ionicon'}}
              title='Add From Photo Library'
              onPress={() => this.pickImage()}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Blood Test'
              onPress={() => this.props.navigation.navigate('AddBloodTestRecord', {
                onRecordAdded: this.onRecordAdded.bind(this)})}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 20}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Genetic Test'
              onPress={() => this.props.navigation.navigate('AddGeneticTestRecord', {
                onRecordAdded: this.onRecordAdded.bind(this)})}
            />
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(resetAction)} />
      </View>
    );
  }
}
