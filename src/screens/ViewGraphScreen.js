import React, { Component } from 'react';
import { Alert, View, ScrollView, Platform, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { FileSystem } from 'expo';
import { VictoryLine, VictoryTheme, VictoryChart, VictoryAxis } from "victory-native";
import { AsyncRenderComponent } from './AsyncRenderComponent';
import { CoralHeader, CoralFooter, colors, MessageIndicator, logoutAction } from '../ui';
import { recordTypes } from '../utilities/recordTypes';
import cryptoHelpers from '../utilities/crypto_helpers';
import ipfs from '../utilities/expo-ipfs';
import store from '../utilities/store';


const backAction = NavigationActions.back();

export class ViewGraphScreen extends AsyncRenderComponent {
  constructor(props) {
    super(props);
    this.dates = this.props.navigation.state.params.dates;
    this.recordType = this.props.navigation.state.params.recordType;
    this.state = {
      availableColors: [colors.grey, colors.green, colors.red],
      recordRenderInfo: {},
      records: [],
      recordsFetched: false,
      processedRecords: 0,
      filteredRecords: 0,
      values: {}
    };

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

  getMonthDayTimeString(date) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return (months[date.getMonth()] +
            "-" + date.getDate() +
            " " + date.getHours() +
            ":" + date.getMinutes())
  }

  populateDataValues(recordData) {
    let dataTime = (new Date(recordData.time));
    if (this.state.values[recordData.key] == null) {
      this.state.values[recordData.key] = [];
    }
    if (this.state.recordRenderInfo[recordData.key] == null) {
      this.state.recordRenderInfo[recordData.key] = {
        color: this.state.availableColors.pop(),
        visible: true,
      }
    }
    this.state.values[recordData.key].push({
      "x": this.getMonthDayTimeString(dataTime),
      "y": parseInt(recordData.value)
    })
  }

  componentDidMount() {
    store.getKeyWithName(this.recordType).then((records) => {
      if (records == null) {
        Alert.alert(
          "No records found",
          "No records of the chosen type were found.", [
            { text: "OK", onPress: () => this.props.navigation.dispatch(backAction) }
          ]
        );
      } else {
        this.state.records = records;
        this.state.recordsFetched = true;
      }
      let recordKeys = Object.keys(records);
      recordKeys.sort(function(a, b) {
        return a - b;
      })
      recordKeys.map((key) => {
        let record = records[key];
        var recordTime = new Date(record.time);
        if (recordTime < this.dates.datestart || recordTime > this.dates.dateend) {
          this.state.processedRecords += 1;
          this.checkEmptyRecordsFilter();
          return;
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
                    for (var i in data) {
                      this.populateDataValues(data[i]);
                    }  
                    let state = this.state;
                    state.processedRecords += 1;
                    state.filteredRecords += 1;
                    this.setState(state);
                  })
                FileSystem.deleteAsync(decryptionResult.decryptedUri, { idempotent: true });
              });
            })
        })
    });
  }



  render() {
    if (!this.state.recordsFetched || (this.state.processedRecords != Object.keys(this.state.records).length)) {
      return ( 
        <View style = { { flex: 1, backgroundColor: colors.bg } } ref = 'main'>
          <CoralHeader title = {recordTypes[this.recordType] + ' Chart'} subtitle = {'Generating your ' + recordTypes[this.recordType] + ' chart.'} />
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
          <CoralHeader title = {recordTypes[this.recordType] + ' Chart'} subtitle = {recordTypes[this.recordType] + ' chart for your selected timeline.'} />
          <ScrollView horizontal = { true } >
            <VictoryChart theme = { VictoryTheme.material } width = { Math.max(Dimensions.get('window').width, this.state.processedRecords * 100) }>
            <VictoryAxis  style = { { ticks: { padding: 0 } } } 
                          standalone = { false } tickFormat = {
                                                 (x) => {
                                                    return x;
                                                 }}
            /> 
            <VictoryAxis dependentAxis orientation = "left" />
            <VictoryLine  style = {{
                                   data: { stroke: this.state.recordRenderInfo["BreathingRate"].color }
                                }}
                                standalone = { false } 
                                data = { this.state.values["BreathingRate"] }
                  /> 
            {
              Object.keys(this.state.recordRenderInfo).map((renderInfoKey) => {
                let renderInfo = this.state.recordRenderInfo[renderInfoKey];
                console.log(renderInfo);
                if (renderInfo.visible) {
                  console.log("rendering...");
                  console.log(this.state.values[renderInfo.key]);
                  return (
                    <VictoryLine  key = {renderInfoKey}  
                                  style = {{
                                    data: { stroke: renderInfo.color }
                                  }}
                                  standalone = { false } 
                                  data = { this.state.values[renderInfoKey] }
                  />)
                }
              })
            }
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