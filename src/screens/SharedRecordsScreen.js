import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import nextFrame from 'next-frame';

import { CoralHeader, colors, MessageModal } from '../ui';
import store from '../utilities/store';
import { keysExist, publicKeyPEM } from '../utilities/pki';
import ipfs from '../utilities/expo-ipfs';
import MessageIndicator from './MessageIndicator';

const friendList = [
  {
    name: 'Dr. Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    records: {value: "2 records"}
  },
  {
    name: 'Dr. Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    records: {value: "1 record"}
  }
];
export class SharedRecordsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true , modalVisible: false, contacts:[] };
  }

  async reloadRecords() {
    let contacts = await store.contacts();

    store.sharedRecords()
      .then((sharedRecords) => {
        let contactsArray = [];

        for (const [email, records] of Object.entries(sharedRecords)) { 
          var contact = contacts.find(function (c) { return c.name === email; });

          if (contact) {
            let recordArray = [];

            for (const [id, record] of Object.entries(records)) {
              recordArray.push({id, record});
            }            

            contactsArray.push({contact, records: recordArray});
          }
        }
        this.setState({ contacts: contactsArray, loading: false });
      });
  }

  onShareKeyUploadFailed() {
    this.setState({ modalVisible: true, uploadError: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    this.reloadRecords();

    if (this.state.loading) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.bg }}>
          <MessageIndicator message="Loading shared records..." />
        </View>
      );
    }

    if (this.state.creatingSharedKey) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.bg }}>
          <MessageIndicator message="Creating your shared key..." />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader title='Shared Medical Records' subtitle='You have shared your records with the people below.'/>
        <ScrollView style={{ flex: 1}}>
          <MessageModal
            visible={this.state.modalVisible}
            onClose={this.hideModal.bind(this)}
            error={this.state.uploadError}
            errorTitle='Error uploading to IPFS'
            title=''
            errorMessage='Please verify that you have internet connection and that your IPFS configuration is correct in Settings > Account.'
            message=''
            ionIcon='ios-medkit'
          />
          <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
            {
              this.state.contacts.map((entry) => (
                <ListItem
                  roundAvatar
                  avatar={{uri:entry.contact.picture}}
                  key={entry.contact.name}
                  title={entry.contact.nickname}
                  badge={{'value': `${entry.records.length} records`}}
                  chevronColor={colors.red}
                />
              ))
            }
          </List>
        </ScrollView>
        <View style={{ paddingBottom: 15, paddingTop: 15}}>
          <Button
            backgroundColor={colors.red}
            icon={{name: 'qrcode', type: 'font-awesome'}}
            title='Receive Records From Others'
            onPress={async () => {
              let keysCreated = await keysExist();
              if ( !keysCreated ) {
                Alert.alert(
                  'Coral Health Keys not present',
                  'Please create your Coral Health private and public keys by going to Settings > Account',
                  [
                    {text: 'OK', onPress: () => {} },
                  ],
                  { cancelable: true }
                )
              } else {
                try {
                  await nextFrame();
                  let sharedKey = await store.sharedPublickKey();

                  if ( !sharedKey ) {
                    await nextFrame();
                    let publicKey = await publicKeyPEM();

                    await nextFrame();
                    let keyHash = await ipfs.add(publicKey);

                    await nextFrame();
                    await store.setSharedPublicKey(keyHash);
                  }

                  await nextFrame();
                  let sharedInfo = await store.mySharedInfo();

                  console.log({sharedInfo});

                  this.props.navigation.navigate('QRCode', {
                    title:'Your Account QR Code',
                    subTitle: 'Show this to a friend or doctor to let them share or send you a medical record.',
                    shareMessage: 'This is my Coral Health medical record sharing public information. You can use this link to add me as a contact.',
                    data: sharedInfo, 
                    type: 'contact'});
                } catch (e) {
                  console.log('Error uploading to ipfs: ', e);
                  this.onShareKeyUploadFailed();
                }
              }
            }}
          />
        </View>
      </View>
    );
  }
}
