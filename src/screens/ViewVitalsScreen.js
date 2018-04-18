import moment from 'moment';
import React, { Component } from 'react';
import { View, ScrollView, Platform, Dimensions } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { FileSystem } from 'expo';
import { LineChart } from 'react-native-chart-kit';
import { AsyncRenderComponent } from './AsyncRenderComponent';
import { CoralHeader, CoralFooter, colors, RecordDetails, MessageIndicator, logoutAction } from '../ui';
import { PHOTO_RECORD_TEST, VITAL_SIGNS } from '../utilities/recordTypes';
import cryptoHelpers from '../utilities/crypto_helpers';
import ipfs from '../utilities/expo-ipfs';
import store from '../utilities/store';


const backAction = NavigationActions.back();

export class ViewVitalsScreen extends AsyncRenderComponent {  
  constructor(props) {
    super(props);
    this.state = { recordInitialized: false, rate: [] };
  }

  generateRate() {
    var N = 10;
    this.rate = Array.apply(null, {length: N}).map(Number.call, Number);
  }

  componentDidMount() {
    this.generateRate();
    recordPromise = store.getKeyWithName(VITAL_SIGNS);
    recordPromise.then(async (records) => {
      for (var key in records) {
        let record = records[key];
        console.log(record);
        await ipfs.cat(record.hash)
        .then(async (response) => {
          const {uri, unauthorized} = response;
          if (unauthorized) {
            this.props.navigation.dispatch(await logoutAction(this.props.navigation));
            return;
          }

          cryptoHelpers.decryptFile(uri, record.encryptionInfo.key, record.encryptionInfo.iv)
            .then((decryptionResult) => {
              FileSystem.readAsStringAsync(decryptionResult.decryptedUri)
                .then((decryptedData) => {
                  console.log(this.state);
                  let data = JSON.parse(decryptedData);
                  for (var i in data) {
                    console.log(data[i]);
                    if (data[i].key === "BreathingRate") {
                      console.log("State ");
                      console.log(this.state);
                      let state = this.state;
                      state.rate.push(data[i].value);  
                      this.setStateAsync(state);
                      console.log(this.state);
                    }
                  }})
                FileSystem.deleteAsync(decryptionResult.decryptedUri, { idempotent: true });
                });
            })
        .catch((e) => {
          console.log(e);
        }); 
      }
    console.log(this.state.rate);}).then(console.log(this.state));
    this.setState(this.state);

  }


  render() {

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }} ref='main'>
        <CoralHeader title='View Medical Record' subtitle='Your record has been decrypted below.'/>

        <ScrollView style={{ flex: 1}}>
          <LineChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [{
                data: [20,45]
              }]
            }}
            width={Dimensions.get('window').width} // from react-native
            height={450}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}