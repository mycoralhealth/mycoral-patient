import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, FormLabel, FormInput, CheckBox } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import nextFrame from 'next-frame';

import { CoralHeader, CoralFooter, colors, MessageIndicator } from '../ui.js';

import { keysExist, generateKeyPair, invalidateKeyPair, probeCPUPower } from '../utilities/pki';
import store from '../utilities/store';

function Loading(props) {
  return (
    <MessageIndicator message="Loading info..." />
  );
}

function KeyInfo(props) {
  if (props.opInProgress) {
    return (
      <View style={{ flex: 1, marginTop: 20, marginBottom: 20, marginLeft: 10, marginRight: 10 }}>
        <MessageIndicator message={props.opInProgress.message} />
      </View>
    );
  }

  if (props.keysPresent) {
    return (
      <View style={{ flex: 1, marginBottom: 10, padding: 10, backgroundColor: 'white'}}>
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
      <View style={{ flex: 1, marginBottom: 10, padding: 10, backgroundColor: 'white'}}>
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

  async generateKeys() {
    this.setState({opInProgress:{message:'Generating keys, please wait this may take a while...'}});

    await nextFrame();
    let baseTime = await probeCPUPower();

    console.log({baseTime});

    this.setState({opInProgress:{message:`Generating keys, please wait this may take a while. Estimated ${moment.duration((baseTime * 50) + 60000).humanize()} ...`}});

    await nextFrame();
    await generateKeyPair();

    this.setState({ keysPresent:true, opInProgress: null });
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
          <View style={{ flex: 1 }}>
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
            inputStyle={{color:'black'}}
            onChangeText={(text) => this.updateEthAddress(text)}/>
          <View style={{ flex: 1, marginBottom: 10, marginTop: 5}}>
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
          <CheckBox
            center
            containerStyle={{backgroundColor: colors.bg}}
            title='Use custom server'
            checked={this.state.ipfsInfo.useCustom}
            onPress={() => this.updateIpfsInfo('useCustom', !this.state.ipfsInfo.useCustom)}
          />
          <View pointerEvents={this.state.ipfsInfo.useCustom ? 'auto' : 'none'}
              style={{opacity: this.state.ipfsInfo.useCustom ? 1.0 : 0.2}}>
            <FormLabel>IPFS protocol</FormLabel>
            <FormInput
              value={this.state.ipfsInfo.protocol}
              placeholder='http'
              returnKeyType='done'
              autoCapitalize='none'
              inputStyle={{color:'black'}}
              autoCorrect={false}
              onChangeText={(text) => this.updateIpfsInfo('protocol', text)}/>

            <FormLabel>IPFS address</FormLabel>
            <FormInput
              value={this.state.ipfsInfo.address}
              placeholder='localhost'
              autoCapitalize='none'
              returnKeyType='done'
              inputStyle={{color:'black'}}
              autoCorrect={false}
              onChangeText={(text) => this.updateIpfsInfo('address', text)}/>

            <FormLabel>IPFS port</FormLabel>
            <FormInput
              value={this.state.ipfsInfo.port}
              placeholder='50001'
              autoCapitalize='none'
              returnKeyType='done'
              keyboardType='numeric'
              inputStyle={{color:'black'}}
              autoCorrect={false}
              onChangeText={(text) => this.updateIpfsInfo('port', text)}/>

            <FormLabel>IPFS user name</FormLabel>
            <FormInput
              value={this.state.ipfsInfo.userName}
              placeholder='(optional)'
              autoCapitalize='none'
              returnKeyType='done'
              inputStyle={{color:'black'}}
              autoCorrect={false}
              onChangeText={(text) => this.updateIpfsInfo('userName', text)}/>

            <FormLabel>IPFS password</FormLabel>
            <FormInput
              value={this.state.ipfsInfo.password}
              placeholder='(optional)'
              autoCapitalize='none'
              returnKeyType='done'
              secureTextEntry={true}
              inputStyle={{color:'black'}}
              autoCorrect={false}
              onChangeText={(text) => this.updateIpfsInfo('password', text)}/>
          </View>

          <View style={{ height: 300 }}/>

        </KeyboardAwareScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(NavigationActions.back())}/>
      </View>
    );
  }
}
