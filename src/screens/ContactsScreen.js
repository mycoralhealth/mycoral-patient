import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import nextFrame from 'next-frame';

import { CoralHeader, colors, CoralFooter, MessageIndicator } from '../ui';
import store from '../utilities/store';
import importHelpers from '../utilities/import_helpers';

export class ContactsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  async componentDidMount() {
    let contacts = await store.contacts();

    this.setState({ contacts, loading: false });
  }

  removeContact(contact) {
    store.removeContact(contact)
      .then(async (contacts) => {
        await nextFrame();
        this.setState({ contacts });
      })
      .catch((e) => console.log(`Error removing contact from store (${e})`));
  }

  onQRCodeContactScanned(type, data) {
    importHelpers.qrCodeContactHelper(data)
      .then((scanned) => {
        const {contacts} = scanned;
        if (contacts) {
          this.setState({ contacts });
        } else {
          Alert.alert(
            'QR Code Scan Error',
            "The QR Code you just scanned doesn't look like valid Coral Health shared contact record. Please make sure you are scanning the QR code shown on the Shared Records screen of your contact.",
            [
              {text: 'OK', onPress: () => {} },
            ],
            { cancelable: true }
          );
        }
      });
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
                  onPress={() => this.props.navigation.navigate('MyContact', {contact, onRemoveContact: this.removeContact.bind(this)})}
                />
              ))
            }
          </List>
        </ScrollView>

        <View style={{ paddingBottom: 15, paddingTop: 15}}>
          <Button
            backgroundColor={colors.green}
            icon={{name: 'qrcode', type: 'font-awesome'}}
            title='Add Contact from QR Code' 
            onPress={() => this.props.navigation.navigate('QRCodeReader', {onQRCodeScanned: this.onQRCodeContactScanned.bind(this)})}
          />
        </View>

        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }
}
