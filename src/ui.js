import React, { Component } from 'react';
import { View, Image, Platform, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button, Icon, List, ListItem } from 'react-native-elements';
import { PHOTO_RECORD_TEST } from './utilities/recordTypes';
import { NavigationActions, SafeAreaView } from 'react-navigation';


import store from './utilities/store';
import { cleanUpRecordsCache } from './screens/MyRecordsScreen';

export const colors = {
  'bg': '#eee',
  'gray': '#999',
  'darkerGray': '#666',
  'lighterGray': '#aaa',
  'green': '#1db495',
  'red': '#f10d34',
  'white': '#fff'
}

export const logoutAction = async (navigation) => {
  await store.setUserInfo(null);
  cleanUpRecordsCache();

  const { navigate } = navigation;
  const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login', params: { logout: true }})
      ],
      key: null 
    });

  return resetAction;
}

export class CoralHeader extends React.Component {
  render() {
    return (
      <SafeAreaView forceInset={{top:'always'}}>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.green, borderTopWidth: 1, borderTopColor: colors.green, marginTop: (Platform.OS === 'ios') ? 20 : 0}}>
          <View style={{ backgroundColor: 'white', width: 80, height: 80, justifyContent: 'center'}}>
            <Image style={{ width: 80, height: 80 }} source={require('../assets/corner-logo.png')} />
          </View>
          <View style={{ backgroundColor: colors.green, height: 80, padding: 20, flex: 1, justifyContent: 'center'}}>
            <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>{this.props.title}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', textAlign: "center" }}>{this.props.subtitle}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export class CoralFooter extends React.Component {
  render() {
    return (
      <View style={{ paddingBottom: 15, paddingTop: 15}}>
        <Button
          backgroundColor={colors.red}
          icon={{name: 'ios-arrow-back', type: 'ionicon'}}
          title='Back'
          onPress={this.props.backAction}
        />
      </View>
    );
  }
}

export class LogoutFooter extends React.Component {
  render() {
    return (
      <View style={{ paddingBottom: 15, paddingTop: 15}}>
        <Button
          backgroundColor={colors.gray}
          icon={{name: 'ios-log-out', type: 'ionicon'}}
          title='Log-Out'
          onPress={this.props.backAction}
        />
      </View>
    );
  }
}

export class MessageModal extends Component {
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={this.props.onClose}
        visible={this.props.visible} >
        <View style={{marginTop: 25, alignItems: 'center'}}>
          <View style={{ flex: 1 }}>
            <Text h3 style={{textAlign: 'center', marginTop: 20}}>
              { (this.props.error) ? this.props.errorTitle : this.props.title }
            </Text>
            <View style={{ flex: 1, marginTop: 10, marginBottom: 70, alignSelf: 'center'}}>
              <TouchableOpacity
                style={{alignItems: 'center', width: 100, height: 100 }}>
                <Icon 
                  name={(this.props.error) ? 'wrench' : this.props.ionIcon} 
                  type={(this.props.error) ? 'font-awesome' : 'ionicon'} 
                  size={100} 
                  color={(this.props.error) ? colors.red : colors.green} 
                  style={{textAlign: 'center'}} />
               </TouchableOpacity>
            </View>
            <Text style={{textAlign: 'center', marginTop: 30, padding: 20}}>
              { (this.props.error) ? this.props.errorMessage : this.props.message }
            </Text>

            <View style={{ flex: 1, marginTop: 20, width: 120, height: 40, alignSelf: 'center'}}>
              <TouchableOpacity
                 style={{alignItems: 'center', backgroundColor: '#DDDDDD', padding: 5, width: 120, height: 30}}
                 onPress={this.props.onClose}>
                 <Text> Close </Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export const MessageIndicator = (props) => {
  return (
    <View>
      <Text style={{textAlign: 'center'}}>{props.message}</Text>
      <ActivityIndicator size="large" color={colors.green} style={{marginTop: 10}}/>
    </View>
  );
}

export const RecordDetails = (props) => {
  if (!props.recordInitialized) {
    return (<View style={{ flex: 1, marginBottom: 40, marginTop: 20}} />);
  }

  if (props.record.error) {
    return (
      <View style={{ flex: 1, marginBottom: 20, marginTop: 20}} />
    );
  }

  if (props.decrypting) {
    return (
      <View style={{ flex: 1, marginBottom: 40, marginTop: 20}}>
        <MessageIndicator message="Decrypting record..." />
      </View>
    ); 
  }

  if (props.record.downloadError) {
    return (
      <View style={{ flex: 1, marginBottom: 40, marginTop: 20}}>
        <Text style={{textAlign: 'center', color: colors.red}}>
          Error downloading file from IPFS. Please check your internet connection.
        </Text>
      </View>
    );
  }

  if (props.record.metadata.testType === PHOTO_RECORD_TEST) {
    return (
      <View style={{ flex: 1, marginBottom: 40, marginTop: 20}}>
        <Button
          backgroundColor={colors.white}
          color='#000'
          icon={{name: 'ios-image', type: 'ionicon', color:'#000'}}
          title='View Photo Record'
          onPress={() => {
            let url = `data:image/jpeg;base64,${props.record.results.imgData}`;

            props.navigation.navigate('ViewImage', { images: [{ url }] })
          }}
        />
      </View>
    );
  } else {
    return (
      <List containerStyle={{marginBottom: 20}}>
        {
          props.record.results.map((item) => (
            <ListItem
              key={item.key}
              title={item.key}
              hideChevron={true}
              rightTitle={(item.value == '') ? ' ' : item.value}
              rightTitleStyle={{ color: 'black', fontSize: 20, fontFamily: (Platform.OS === 'ios') ? 'Courier' : 'monospace', fontWeight: 'bold'}}
            />
          ))
        }
      </List>
    );
  }
}
