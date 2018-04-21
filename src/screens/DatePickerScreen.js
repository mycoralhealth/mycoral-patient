import moment from 'moment';
import React, { Component } from 'react';
import { Alert, View, ScrollView, Platform, Dimensions, StyleSheet } from 'react-native';
import { Button, List, ListItem, Text } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { AsyncRenderComponent } from './AsyncRenderComponent';
import RNPickerSelect from 'react-native-picker-select';
import { CoralHeader, CoralFooter, colors, RecordDetails, MessageIndicator, logoutAction } from '../ui';
import DatePicker from 'react-native-datepicker'
import { VITAL_SIGNS } from '../utilities/recordTypes';


const backAction = NavigationActions.back();

export class DatePickerScreen extends AsyncRenderComponent {  
  constructor(props) {
    super(props);
    this.graphList = [
      {
        label: {VITAL_SIGNS},
        value: {VITAL_SIGNS},
      }
    ]
    this.state = { graphType: {VITAL_SIGNS}, datestart: "2018-01-01", dateend:"2018-01-01"};
  }

  render() {

    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg  }}>
        <CoralHeader title='View Vitals Graph' subtitle='Select the dates of interest below.'/>
         
         <List containerStyle={{marginBottom: 20}}>
        
          <ListItem
          rightIcon={ 
            <DatePicker
              style={{width:200, backgroundColor: colors.white}}
              date={this.state.datestart}
              mode="date"
              placeholder=""
              showIcon={false}
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => {this.setState({datestart: date, dateend: this.state.dateend})}}
            />}
            title="Start Date"
            chevronColor='#fff'
          />
          <ListItem
          rightIcon={ 
            <DatePicker
              style={{width:200, backgroundColor: colors.white}}
              date={this.state.dateend}
              mode="date"
              placeholder=""
              format="YYYY-MM-DD"
              showIcon={false}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => {this.setState({dateend: date, datestart: this.state.datestart})}}
            />}
            title="End Date"
            chevronColor='#fff'
          />
          </List>
          <View style={{ flex: 1, marginBottom: 10}}>
            <Button
              disabled={this.state.opInProgress}
              backgroundColor={colors.green}
              icon={{name: 'ios-add-circle', type: 'ionicon'}}
              title={this.props.navigation.state.params.buttonText}
              onPress={() => this.props.navigation.state.params.onButtonPress(this.state)}
            />
          </View>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}



const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
  },
})