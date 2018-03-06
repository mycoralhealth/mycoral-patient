import React, { Component } from 'react';
import { View, ScrollView, Modal, TouchableOpacity, Platform } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';
import { ImagePicker, FileSystem } from 'expo';

import { CoralHeader, CoralFooter, colors } from '../ui.js';
import { PHOTO_RECORD_TEST } from '../utilities/recordTypes';
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

  onRecordAddFailed() {
    this.setState({ modalVisible: true, uploadError: true });
  }

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true,
      aspect: [3, 4],
      quality: 0.2
    });

    this.handleImagePicked(pickerResult);
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
                  { (this.state.uploadError) ? 'Error uploading to IPFS' : 'New Record Added' }
                </Text>
                <View style={{ flex: 1, marginTop: 10, marginBottom: 70, alignSelf: 'center'}}>
                  <TouchableOpacity
                    style={{alignItems: 'center', width: 100, height: 100 }}>
                    <Icon 
                      name={(this.state.uploadError) ? 'wrench' : 'ios-medkit'} 
                      type={(this.state.uploadError) ? 'font-awesome' : 'ionicon'} 
                      size={100} 
                      color={(this.state.uploadError) ? colors.red : colors.green} 
                      style={{textAlign: 'center'}} />
                   </TouchableOpacity>
                </View>
                <Text style={{textAlign: 'center', marginTop: 30, padding: 20}}>
                  { (this.state.uploadError) ? 'Please verify that you have internet connection and Coral Health encryption keys.' : 'You can add more medical records or go back to the records list.' }
                </Text>

                <View style={{ flex: 1, marginTop: 20, width: 120, height: 40, alignSelf: 'center'}}>
                  <TouchableOpacity
                     style={{alignItems: 'center', backgroundColor: '#DDDDDD', padding: 5, width: 120, height: 30}}
                     onPress={this.hideModal.bind(this)}>
                     <Text> Close </Text>
                   </TouchableOpacity>
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
                onRecordAdded: this.onRecordAdded.bind(this),
                onRecordAddFailed: this.onRecordAddFailed.bind(this)
              })}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 20}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title='Add Genetic Test'
              onPress={() => this.props.navigation.navigate('AddGeneticTestRecord', {
                onRecordAdded: this.onRecordAdded.bind(this),
                onRecordAddFailed: this.onRecordAddFailed.bind(this)
              })}
            />
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(resetAction)} />
      </View>
    );
  }
}
