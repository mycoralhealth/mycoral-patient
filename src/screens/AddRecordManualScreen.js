import React, { Component } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';
import { ImagePicker, FileSystem } from 'expo';

import { colors, MessageModal, MessageIndicator } from '../ui.js';
import { PHOTO_RECORD_TEST } from '../utilities/recordTypes';
import { TestRecordScreen } from './TestRecordScreen';
import cryptoHelpers from '../utilities/crypto_helpers';
import {MyRecordsScaffold} from "./MyRecordsScaffold";

export class AddRecordManualScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.state = { uploadingImage: false, modalVisible: false };
  }

  onRecordAdded(record) {
    this.props.navigation.state.params.onRecordAdded(record);
    this.setState({ modalVisible: true });
  }

  onRecordAddFailed() {
    this.setState({ modalVisible: true, uploadError: true });
  }

  takePhoto = async () => {
    try {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        base64: true,
        aspect: [3, 4],
        quality: 0.2
      });
      this.handleImagePicked(pickerResult);
    } catch (e) {
    }
  }

  pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      aspect: [3, 4],
      quality: 0.2
    });

    this.handleImagePicked(pickerResult);
  }

  handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploadingImage: true, uploadError: false });

      if (!pickerResult.cancelled) {
        let record = await this.createRecord(pickerResult.base64, PHOTO_RECORD_TEST);

        FileSystem.deleteAsync(pickerResult.uri, { idempotent: true });

        this.onRecordAdded(record);
      }
    } catch (e) {
      console.log({ e });
      this.onRecordAddFailed();
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
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.bg }}>
          <MessageIndicator message='Encrypting and uploading your photo record' />
        </View>
      );
    }

    return (
      <MyRecordsScaffold title='Add Medical Record' subtitle='Add your medical record to the blockchain.' backAction={() => this.props.navigation.dispatch(resetAction)}>
        <ScrollView centerContent={true}>
          <MessageModal
            visible={this.state.modalVisible}
            onClose={this.hideModal.bind(this)}
            error={this.state.uploadError}
            errorTitle='Error uploading to IPFS'
            title='New Record Added'
            errorMessage='Please verify that you have internet connection and Coral Health encryption keys.'
            message='You can add more medical records or go back to the records list.'
            ionIcon='ios-medkit'
          />
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
              onPress={() => this.props.navigation.navigate({key:'AddBloodTestRecordKey', routeName: 'AddBloodTestRecord', params: {
                onRecordAdded: this.onRecordAdded.bind(this),
                onRecordAddFailed: this.onRecordAddFailed.bind(this)
              }})}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Genetic Test'
              onPress={() => this.props.navigation.navigate({key:'AddGeneticTestRecordKey', routeName: 'AddGeneticTestRecord', params: {
                onRecordAdded: this.onRecordAdded.bind(this),
                onRecordAddFailed: this.onRecordAddFailed.bind(this)
              }})}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Vital Signs'
              onPress={() => this.props.navigation.navigate({key: 'AddVitalSignsRecordKey', routeName: 'AddVitalSignsRecord', params: {
                onRecordAdded: this.onRecordAdded.bind(this),
                onRecordAddFailed: this.onRecordAddFailed.bind(this)
              }})}
            />
          </View>
					<View style={{ flex: 1, marginBottom: 20}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Hair Test'
              onPress={() => this.props.navigation.navigate({key: 'AddHairTestRecordKey', routeName: 'AddHairTestRecord', params: {
                onRecordAdded: this.onRecordAdded.bind(this),
                onRecordAddFailed: this.onRecordAddFailed.bind(this)
              }})}
            />
          </View>
        </ScrollView>
      </MyRecordsScaffold>
    );
  }
}
