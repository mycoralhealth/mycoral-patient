import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { FileSystem } from 'expo';
import nextFrame from 'next-frame';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CoralHeader, CoralFooter, colors, MessageIndicator } from '../ui';
import ipfs from '../utilities/expo-ipfs';
import store from '../utilities/store';
import importHelpers from '../utilities/import_helpers';
import cryptoHelpers from '../utilities/crypto_helpers';

import { newSharedRecord } from '../actions/index.js';

class DelegateAccessScreenUnwrapped extends Component {
  constructor(props) {
    super(props);

    this.state = {accessDelegated: false, producingRecord: false};
  }

  onQRCodeScanned(type, data) {
    importHelpers.qrCodeContactHelper(data)
      .then((scanned) => {
        const { contact } = scanned;
        if (contact) {
          this.onContactSelected(contact);
        } else {
          Alert.alert(
            'QR Code Scan Error',
            "The QR Code you just scanned doesn't look like valid Coral Health shared record. Please make sure you are scanning the QR code shown on the Shared Records screen of your contact.",
            [
              {text: 'OK', onPress: () => {} },
            ],
            { cancelable: true }
          );
        }
      });
  }

  onContactSelected(contact) {
    this.setState({ producingRecord:true });
    const navigation = this.props.navigation;
    const record = navigation.state.params.record;

    new Promise(function(resolve, reject) {

      ipfs.cat(contact.publicKeyHash)
        .then(async (publicKeyUri) => {
          let publicKeyPem = await FileSystem.readAsStringAsync(publicKeyUri);

          await FileSystem.deleteAsync(publicKeyUri, { idempotent: true });

          await nextFrame();
          ipfs.cat(record.hash)
            .then(async (dataUri) => {
              await nextFrame();
              let { decryptedUri } = await cryptoHelpers.decryptFile(dataUri, record.encryptionInfo.key, record.encryptionInfo.iv);

              let data = await FileSystem.readAsStringAsync(decryptedUri);
              await FileSystem.deleteAsync(decryptedUri, { idempotent: true });

              await nextFrame();
              let encryptedInfo = await cryptoHelpers.encryptFile(data, record.metadata, publicKeyPem);

              await nextFrame();
              let hash = await ipfs.add(encryptedInfo.uri);

              await FileSystem.deleteAsync(encryptedInfo.uri, { idempotent: true });

              let sharedRecord = { 
                id: record.id, 
                hash, 
                metadata: encryptedInfo.encryptedMetadata, 
                encryptionInfo: { key: encryptedInfo.encryptedKey, iv: encryptedInfo.encryptedIv }
              };

              console.log({ sharedRecord });

              let sharedInfo = store.thirdPartySharedRecordInfo(sharedRecord);

              await nextFrame();
              let sharedRecordHash = await ipfs.add(sharedInfo);

              sharedRecord.sharedHash = sharedRecordHash;

              await nextFrame();
              await store.shareRecord(contact.name, sharedRecord);

              resolve({sharedRecordHash, sharedRecord});
            });
        });
    }).then((entity) => { 
      const { sharedRecord, sharedRecordHash } = entity;

      this.setState({ producingRecord:false });

      this.props.newSharedRecord(sharedRecord);

      store.sharedRecordInfo(sharedRecordHash)
        .then((data) => {
          navigation.navigate('QRCode', {
            title:'Your Shared Record QR Code',
            subTitle: 'Show this to a friend or doctor to let them add your medical record.',
            shareMessage: 'I\'m sharing my medical record with you. Please import this record by using the Coral Health app.',
            data, 
            type: 'record'});
        });
 
    }).catch((e) => { console.log('Error re-encrypting record for a contact', e) });
  }

  showSharedAlert() {
    
  }

  render() {

    if (this.state.producingRecord) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.bg }}>
          <MessageIndicator message="Encrypting record for use by your third party. Please wait..." />
        </View>
      ); 
    }

    const record = this.props.navigation.state.params.record;

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title='Share Record' subtitle="Share this record with another user."/>

        <ScrollView style={{ flex:1 }}>
          <Text h3 style={{textAlign: 'center', marginTop: 20}}>
            {record.metadata.name}
          </Text>
          <Text style={{textAlign: 'center'}}>
            Date: {moment(record.metadata.date).format('MMMM Do, YYYY')}
          </Text>
          <Text style={{padding: 20}}>
            The decryption key for this medical record will be shared with the recipient, giving them full access to view this record.
          </Text>

          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.green}
                icon={{name: 'qrcode', type: 'font-awesome'}}
                title="Scan Recipient's QR Code"
                onPress={() => this.props.navigation.navigate('QRCodeReader', {onQRCodeScanned: this.onQRCodeScanned.bind(this)})}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 10}}>
              <Button
                backgroundColor={colors.gray}
                icon={{name: 'users', type: 'font-awesome'}}
                title="Select from your Contacts"
                onPress={() => this.props.navigation.navigate('DelegationContacts', {onContactSelected: this.onContactSelected.bind(this)})}
              />
            </View>
          </View>
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ newSharedRecord }, dispatch);
}

export const DelegateAccessScreen = connect(null, mapDispatchToProps)(DelegateAccessScreenUnwrapped);
