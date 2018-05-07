import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { colors } from "../ui.js";
import { TestRecordScreen } from "./TestRecordScreen";

import { HAIR_TEST, recordTypes } from "../utilities/recordTypes";
import { MyRecordsScaffold } from "./MyRecordsScaffold";

const backAction = NavigationActions.back();
const recordType = recordTypes(HAIR_TEST);

export class AddHairTestRecordScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.state = {
      "Number of painful cysts": 0,
      "Baldness": false,
      "Baldness from disease": false
    };
  }

  render() {
    return (
      <MyRecordsScaffold
        title={`Add ${recordType}`}
        subtitle="Enter your results below."
        backAction={()=>this.props.navigation.dispatch(backAction)}
      >
        <KeyboardAwareScrollView>

        </KeyboardAwareScrollView>
      </MyRecordsScaffold>
    )
  }
}
