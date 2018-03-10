import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import nextFrame from 'next-frame';

import { CoralHeader, colors } from '../ui';
import store from '../utilities/store';
import MessageIndicator from './MessageIndicator';

export class ContactsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  async componentDidMount() {
    let contacts = await store.contacts();

    this.setState({ contacts, loading: false });
  }

  onQRCodeContactScanned(type, data) {
    let invalidCode = !store.isSharedInfoData(data);
    if (!invalidCode) {
      try {
        let contact = store.decodeSharedInfoData(data);
        console.log({contact});

        store.addContact(contact)
          .then(async (contacts) => {
            await nextFrame();
            this.setState({ contacts });
          })
          .catch((e) => console.log(`Error adding contact to store (${e})`));
      } catch (e) {
        invalidCode = true;
      }
    }

    if (invalidCode) {
      Alert.alert(
        'QR Code Scan Error',
        "The QR Code you just scanned doesn't look like valid Coral Health shared record. Please make sure you are scanning the QR code shown on the Shared Records screen of your contact.",
        [
          {text: 'OK', onPress: () => {} },
        ],
        { cancelable: true }
      );
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.bg }}>
          <MessageIndicator message="Loading contacts..." />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader title='Your Medical Contacts' subtitle='You can share your records with the people below.'/>
        <ScrollView style={{ flex: 1}}>
          <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
            {
              this.state.contacts.map((contact) => (
                <ListItem
                  roundAvatar
                  avatar={{uri:contact.picture}}
                  key={contact.name}
                  title={`${contact.nickname} [${contact.name}]`}
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
            title='Add Contact from QR Code' 
            onPress={() => this.props.navigation.navigate('QRCodeReader', {onQRCodeScanned: this.onQRCodeContactScanned.bind(this)})}
          />
        </View>

      </View>
    );
  }
}
