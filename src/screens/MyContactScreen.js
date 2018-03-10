import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, FormLabel, FormInput, Avatar, Button } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'

import { CoralHeader, CoralFooter, colors } from '../ui.js';

export class MyContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contact: this.props.navigation.state.params.contact
    }
  }

  onContactDeleted(contact) {
    this.props.navigation.state.params.onRemoveContact(contact);
    this.props.navigation.dispatch(NavigationActions.back());
  }

  render() {
    if (!this.state.contact.name) {
      return(
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg }}>
          <CoralHeader title='Your Contact Information' subtitle='Your contact email address and security Information'/>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1, marginBottom: 10, marginTop: 40}}>
              <Button
                backgroundColor={colors.darkerGray}
                icon={{name: 'trash-o', type: 'font-awesome'}}
                title='Delete'
                onPress={() => this.onContactDeleted(this.state.contact)}
              />
            </View>          
          </ScrollView>
          <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg }}>
        <CoralHeader title='Your Contact Information' subtitle='Your contact email address and security Information'/>

        <ScrollView style={{ flex: 1 }}>
          <View style={{alignSelf: 'center', marginTop: 20}}>
            <Avatar            
              large
              rounded
              source={{uri:this.state.contact.picture}}
            />
          </View>
          <Text h4 style={{textAlign: 'center', marginTop: 20, marginLeft: 20}}>
            Contact details
          </Text>
          <FormLabel>Email address</FormLabel>
          <FormInput 
            value={this.state.contact.name}
            keyboardType='email-address'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            editable={false}
            inputStyle={{color:colors.darkerGray}}/>

          <FormLabel>User name</FormLabel>
          <FormInput 
            value={this.state.contact.nickname}
            placeholder='someone'
            autoCapitalize='none'
            autoCorrect={false}
            inputStyle={{color:colors.darkerGray}}
            editable={false}
            returnKeyType='done'/>

          <FormLabel>Public key IPFS hash</FormLabel>
          <FormInput 
            value={this.state.contact.publicKeyHash}
            placeholder='someone'
            autoCapitalize='none'
            autoCorrect={false}
            inputStyle={{color:colors.darkerGray}}
            editable={false}
            returnKeyType='done'/>
          
          <View style={{ flex: 1, marginBottom: 10, marginTop: 10}}>
            <Button
              backgroundColor={colors.darkerGray}
              icon={{name: 'trash-o', type: 'font-awesome'}}
              title='Delete'
              onPress={() => this.onContactDeleted(this.state.contact)}
            />
          </View>          
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }
}
