import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, FormLabel, FormInput } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { CoralHeader, CoralFooter, colors } from '../ui.js';

import { keysExist, generateKeyPair, invalidateKeyPair } from '../utilities/pki';
import store from '../utilities/store';

import MessageIndicator from './MessageIndicator';

function Loading(props) {
  return (
    <MessageIndicator message="Loading info..." />
  );
}

function KeyInfo(props) {
  if (props.opInProgress) {
    return <MessageIndicator message={props.opInProgress.message} />
  }

  if (props.keysPresent) {
    return (
      <View style={{ flex: 1, marginBottom: 10, backgroundColor: 'white'}}>
        <Text style={{padding: 20, textAlign: 'center'}}>
          Coral Health keys generated and in use.
        </Text>
        <View style={{ flex: 1, marginTop: 10, marginBottom: 20}}>
          <Button
                backgroundColor={colors.gray}
                icon={{name: 'trash-o', type: 'font-awesome'}}
                title='Revoke Keys'
                onPress={() => props.revokeKeys()}
              />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, marginBottom: 10, backgroundColor: 'white'}}>
        <Text style={{padding: 20, textAlign: 'center'}}>
          Coral Health keys are not present. To use the app please generate your own personal keys.
        </Text>
        <View style={{ flex: 1, marginTop: 10, marginBottom: 20}}>
          <Button
                backgroundColor={colors.green}
                icon={{name: 'ios-key', type: 'ionicon'}}
                title='Generate Keys'
                onPress={() => props.generateKeys()}
              />
        </View>
      </View>
    );
  }
}

export class AccountInfoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }

  async componentDidMount() {
    let ethAddress = await store.getEthAddress();
    let ipfsInfo = await store.getIPFSProvider();
    let keysPresent = await keysExist();

    this.setState({
      keysPresent,
      loading: false,
      opInProgress: null,
      ethAddress,
      ipfsInfo
    });
  }

  generateKeys() {
    this.setState({opInProgress:{message:'Generating keys, please wait this may take a while...'}});
    generateKeyPair()
      .then(() => this.setState({keysPresent:true, opInProgress: null}));
  }

  revokeKeys() {
    this.setState({opInProgress:{message:'Revoking keys...'}});
    invalidateKeyPair()
      .then(() => this.setState({keysPresent:false, opInProgress: null}));
  }

  updateEthAddress(ethAddress) {
    this.setState({ethAddress});
    store.setEthAddress(ethAddress);
  }

  updateIpfsInfo(field, text) {
    let ipfsInfo = this.state.ipfsInfo;
    ipfsInfo[field] = text;

    this.setState({ipfsInfo});
    store.setIPFSProvider(ipfsInfo);
  }

  onQRCodeETHScanned(type, data) {
    this.updateEthAddress(data);
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.bg }}>
          <Loading />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg }}>
        <CoralHeader title='Your Account' subtitle='Security, IPFS and blockchain settings'/>

        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <KeyInfo 
              keysPresent={this.state.keysPresent}
              generateKeys={this.generateKeys.bind(this)}
              revokeKeys={this.revokeKeys.bind(this)}
              opInProgress={this.state.opInProgress}
            />
          </View>
          <Text h4 style={{textAlign: 'left', marginTop: 20, marginLeft: 20}}>
            Blockchain info
          </Text>
          <FormLabel>Blockchain ETH address</FormLabel>
          <FormInput 
            value={this.state.ethAddress}
            placeholder='0x8A09990601E7FF5Cdcc...'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={(text) => this.updateEthAddress(text)}/>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              backgroundColor={colors.darkerGray}
              icon={{name: 'qrcode', type: 'font-awesome'}}
              title="Scan from QR Code"
              onPress={() => this.props.navigation.navigate('QRCodeReader', {onQRCodeScanned: this.onQRCodeETHScanned.bind(this)})}
            />
          </View>

          <Text h4 style={{textAlign: 'left', marginTop: 20, marginLeft: 20}}>
            IPFS settings
          </Text>
          <FormLabel>IPFS protocol</FormLabel>
          <FormInput 
            value={this.state.ipfsInfo.protocol}
            placeholder='http'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={(text) => this.updateIpfsInfo('protocol', text)}/>

          <FormLabel>IPFS address</FormLabel>
          <FormInput 
            value={this.state.ipfsInfo.address}
            placeholder='localhost'
            autoCapitalize='none'
            returnKeyType='done'
            autoCorrect={false}
            onChangeText={(text) => this.updateIpfsInfo('address', text)}/>

          <FormLabel>IPFS port</FormLabel>
          <FormInput 
            value={this.state.ipfsInfo.port}
            placeholder='50001'
            autoCapitalize='none'
            returnKeyType='done'
            keyboardType='numeric'
            autoCorrect={false}
            onChangeText={(text) => this.updateIpfsInfo('port', text)}/>

          <FormLabel>IPFS user name</FormLabel>
          <FormInput 
            value={this.state.ipfsInfo.userName}
            placeholder='(optional)'
            autoCapitalize='none'
            returnKeyType='done'
            autoCorrect={false}
            onChangeText={(text) => this.updateIpfsInfo('userName', text)}/>

          <FormLabel>IPFS password</FormLabel>
          <FormInput 
            value={this.state.ipfsInfo.password}
            placeholder='(optional)'
            autoCapitalize='none'
            returnKeyType='done'
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={(text) => this.updateIpfsInfo('password', text)}/>

          <View style={{ height: 100 }}/>

        </KeyboardAwareScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }
}
