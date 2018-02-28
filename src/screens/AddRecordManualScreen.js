import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';
import DropdownAlert from 'react-native-dropdownalert';
import { ImagePicker } from 'expo';

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { blockchainAddress, PHOTO_RECORD_TEST } from './common';
import MessageIndicator from './MessageIndicator';
import ipfs from '../utilities/expo-ipfs';
import { TestRecordScreen } from './TestRecordScreen';
import cryptoHelpers from '../utilities/crypto_helpers';

export class AddRecordManualScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.state = { uploadingImage: false };
  }

  onRecordAdded(record) {
    this.props.navigation.state.params.onRecordAdded(record);
    this.dropdown.alertWithType('info', 'New Record Added', 'You can add more medical records or go back to the records list.');
  }

  takePhoto = async () => {
    this.dropdown.close();

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
    });

    this.handleImagePicked(pickerResult);
  }

  pickImage = async () => {
    this.dropdown.close();

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
    });

    this.handleImagePicked(pickerResult);
  }

  handleImagePicked = async (pickerResult) => {
    let uploadResponse;

    try {
      this.setState({ uploadingImage: true });

      if (!pickerResult.cancelled) {
        let metadata = this.createRecordMetadata(PHOTO_RECORD_TEST);

        let encryptedInfo = await cryptoHelpers.encryptFile(pickerResult.uri, pickerResult.base64, metadata);

        uploadResponse = await ipfs.add(encryptedInfo.uri);

        console.log({uploadResponse});

        this.addPhotoRecord(uploadResponse, encryptedInfo);
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ e });
    } finally {
      this.setState({ uploadingImage: false });
    }
  }

  addPhotoRecord(hash, encryptedInfo) {
    let results = { uri: encryptedInfo.uri, hash };

    let record = this.createEncryptedRecord(encryptedInfo.encryptedMetadata, results, { key: encryptedInfo.encryptedKey, iv: encryptedInfo.encryptedIv });

    this.setState({ uploadingImage: false });
    this.onRecordAdded(record);
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
        <CoralFooter backAction={() => {     
            this.dropdown.close();
            this.props.navigation.dispatch(resetAction)
          }} />
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          infoColor={colors.darkerGray}
        />
      </View>
    );
  }
}
