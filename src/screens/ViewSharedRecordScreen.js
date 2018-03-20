import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { FileSystem } from 'expo';

import { AsyncRenderComponent } from './AsyncRenderComponent';
import { CoralHeader, CoralFooter, colors, MessageIndicator, RecordDetails } from '../ui';
import { PHOTO_RECORD_TEST } from '../utilities/recordTypes';
import cryptoHelpers from '../utilities/crypto_helpers';
import ipfs from '../utilities/expo-ipfs';
import store from '../utilities/store';

const backAction = NavigationActions.back();

export class ViewSharedRecordScreen extends AsyncRenderComponent {  
  constructor(props) {
    super(props);
    this.state = { recordInitialized: false };
  }

  onRecordDeleted(record) {
    this.props.navigation.state.params.onRecordDeleted(record);
    this.props.navigation.dispatch(backAction);
  }

  componentDidMount() {
    const record = this.props.navigation.state.params.record;

    if (record.results) {
      this.setState({ recordInitialized: true });
    } else if (record.hash && !record.error) {
      this.setState({ recordInitialized: true, decrypting: true });
      record.downloadError = false;
      ipfs.cat(record.hash)
        .then((uri) => {
          cryptoHelpers.decryptFile(uri, record.encryptionInfo.key, record.encryptionInfo.iv)
            .then((decryptionResult) => {
              FileSystem.readAsStringAsync(decryptionResult.decryptedUri)
                .then((decryptedData) => {
                  if (record.metadata.testType === PHOTO_RECORD_TEST) {
                    record.results = { imgData: decryptedData };
                  } else {
                    record.results = JSON.parse(decryptedData);
                  }
                  this.setStateAsync({ decrypting: false });
                  FileSystem.deleteAsync(decryptionResult.decryptedUri, { idempotent: true });
                });
            });
          })
        .catch((e) => {
          record.downloadError = true;
          this.setStateAsync({ decrypting: false });
        });          
    }
  }

  render() {
    const record = this.props.navigation.state.params.record;

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }} ref='main'>
        <CoralHeader title='View Medical Record' subtitle='Your record has been decrypted below.'/>

        <ScrollView style={{ flex: 1}}>
          <Text h3 style={{textAlign: 'center', marginTop: 20}}>
            {(record.error) ? 'Decryption error' : record.metadata.name }
          </Text>
          <Text style={{textAlign: 'center', marginTop: 5}}>
            {(record.error) ? 'Encryption keys missing or corrupted' : `Date: ${moment(record.metadata.date).format('MMMM Do, YYYY')}`}
          </Text>

          <RecordDetails 
            record={record} 
            recordInitialized={this.state.recordInitialized}
            decrypting={this.state.decrypting}
            navigation={this.props.navigation} />

          <View style={(record.error || record.externalContact) ? {height: 0, opacity: 0} : { flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.gray}
              icon={{name: 'verified-user', type: 'material'}}
              title='Sharing Information'
              onPress={() => {
                store.sharedRecordInfo(record.sharedHash)
                  .then((data) => {
                    this.props.navigation.navigate('QRCode', {
                      title:'Your Shared Record QR Code',
                      subTitle: 'Show this to a friend or doctor to let them add your medical record.',
                      shareMessage: 'I\'m sharing my medical record with you. Please import this record by using the Coral Health app.',
                      data, 
                      type: 'record'});
                  });
              }}
            />
          </View>
          <View style={{ flex: 1}}>
            <View style={{ flex: 1, marginBottom: 10, marginTop: 20}}>
              <Button
                backgroundColor={colors.darkerGray}
                icon={{name: 'trash-o', type: 'font-awesome'}}
                title='Delete'
                onPress={() => this.onRecordDeleted(record)}
              />
            </View>
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}