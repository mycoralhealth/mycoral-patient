import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import nextFrame from 'next-frame';

import { CoralHeader, colors, CoralFooter } from '../ui';
import store from '../utilities/store';
import MessageIndicator from './MessageIndicator';

export class DelegationContactsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  async componentDidMount() {
    let contacts = await store.contacts();

    this.setState({ contacts, loading: false });
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
                  chevronColor='#fff'
                  onPress={() => { 
                    this.props.navigation.state.params.onContactSelected(contact);
                    this.props.navigation.dispatch(NavigationActions.back());
                  }}
                />
              ))
            }
          </List>
        </ScrollView>

        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>

      </View>
    );
  }
}
