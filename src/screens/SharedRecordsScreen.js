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

    this.state = { loading: true , modalVisible: false };
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  onShareKeyUploadFailed() {
    this.setState({ modalVisible: true, uploadError: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  render() {

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
              friendList.map((l, i) => (
                <ListItem
                  roundAvatar
                  avatar={{uri:l.avatar_url}}
                  key={i}
                  title={l.name}
                  badge={l.records}
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

                    sharedKey = keyHash;
                  }

                  await nextFrame();
                  let sharedInfo = await store.mySharedInfo();

                  console.log({sharedInfo});

                  this.props.navigation.navigate('QRCode', {data: sharedInfo});
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
