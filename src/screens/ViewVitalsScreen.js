import moment from 'moment';
import React, { Component } from 'react';
import { Alert, View, ScrollView, Platform, Dimensions } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { FileSystem } from 'expo';
import { VictoryLine, VictoryTheme, VictoryChart, VictoryAxis } from "victory-native";
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
    this.dates = this.props.navigation.state.params.dates;
    this.state = {
      records: [],
      recordsFetched: false,
      processedRecords: 0,
      filteredRecords: 0,
      values: { "BreathingRate": [], "Systolic": [], "Diastolic": [] },
      labels: []
    };
    store.getKeyWithName(VITAL_SIGNS).then((records) => {
      this.state.records = records;
      this.state.recordsFetched = true
    });
  }

  checkEmptyRecordsFilter() {
    if ((this.state.processedRecords == Object.keys(this.state.records).length) && (this.state.filteredRecords == 0)) {
      Alert.alert(
        "Invalid Dates",
        "No records were found between the specified dates.", [
          { text: "OK", onPress: () => this.props.navigation.dispatch(backAction) }
        ]
      )
    }
  }

  componentDidMount() {
    var processedRecords = 0;
    recordPromise = store.getKeyWithName(VITAL_SIGNS);
    recordPromise.then(async(records) => {
      let recordKeys = Object.keys(records);
      recordKeys.sort(function(a, b) {
        return a - b;
      })
      recordKeys.map((key) => {
          for (var i = 0; i < recordKeys.length; i++) {
            let record = records[key];
            var recordTime = new Date(record.time);
            if (recordTime < this.dates.datestart || recordTime > this.dates.dateend) {
              this.state.processedRecords += 1;
              this.checkEmptyRecordsFilter();
              continue;
            }
            ipfs.cat(record.hash)
              .then(async(response) => {
                const { uri, unauthorized } = response;
                if (unauthorized) {
                  this.props.navigation.dispatch(await logoutAction(this.props.navigation));
                  return;
                }
                cryptoHelpers.decryptFile(uri, record.encryptionInfo.key, record.encryptionInfo.iv)
                  .then((decryptionResult) => {
                    FileSystem.readAsStringAsync(decryptionResult.decryptedUri)
                      .then((decryptedData) => {
                        let data = JSON.parse(decryptedData);
                        var wasLabelSet = false;
                        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
                        for (var i in data) {
                          let recordData = data[i]
                          let dataTime = (new Date(recordData.time));
                          this.state.values[recordData.key].push({
                            "x": months[dataTime.getMonth()] +
                              "-" + dataTime.getDate() +
                              " " + dataTime.getHours() +
                              ":" + dataTime.getMinutes(),
                            "y": parseInt(recordData.value)
                          })
                        }
                        let state = this.state;
                        state.processedRecords += 1;
                        state.filteredRecords += 1;
                        this.setState(state);
                      })
                    FileSystem.deleteAsync(decryptionResult.decryptedUri, { idempotent: true });
                    console.log(this.state);
                  });
              })
          }
        })
        .then(() => {
          this.state.loading = false;
        })
    });
  }



  render() {
    if (!this.state.recordsFetched || (this.state.processedRecords != Object.keys(this.state.records).length)) {
      return ( 
        <View style = { { flex: 1, backgroundColor: colors.bg } } ref = 'main'>
          <CoralHeader title = 'Vital Signs Graph' subtitle = 'Generating your vital signs graph.' />
          <View style = {{ flex: 1, marginBottom: 40, marginTop: 20 }}>
            <MessageIndicator message = "Constructing graph..." />
          </View> 
          <CoralFooter backAction = {
            () => this.props.navigation.dispatch(backAction)
          }/> 
        </View>
      );
    } else {
      return ( 
        <View style = { { flex: 1, backgroundColor: colors.bg } } ref = 'main'>
          <CoralHeader title = 'Vital Signs Graph'
                       subtitle = 'The vital signs graph for the provided time frame.' />
          <ScrollView horizontal = { true } >
            <VictoryChart theme = { VictoryTheme.material } width = { Math.max(Dimensions.get('window').width, this.state.processedRecords * 100) }>
            <VictoryAxis style = { { ticks: { padding: 0 } } } standalone = { false } tickFormat = {
                                                                                        (x) => {
                                                                                            return x;
                                                                                        }}
            /> 
            <VictoryAxis dependentAxis orientation = "left" />
            <VictoryLine  style = {{
                            data: { stroke: colors.grey }
                            }}
                          standalone = { false } data = { this.state.values["BreathingRate"] }
            /> 
            <VictoryLine  style = {{
                            data: { stroke: colors.green }
                            }}
                          standalone = { false } data = { this.state.values["Systolic"] }
            /> 
            <VictoryLine  style = {{
                            data: { stroke: colors.red }
                            }}
                           standalone = { false } data = { this.state.values["Diastolic"] }
            /> 
            </VictoryChart> 
          </ScrollView> 
          <CoralFooter backAction = {
                        () => this.props.navigation.dispatch(backAction)
                      }
          /> 
        </View>
      );
    }
  }
}