import React, { Component } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import moment from "moment/moment";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../ui";
import { MyRecordsScaffold } from "./MyRecordsScaffold";

const backAction = NavigationActions.back();

export class AddRecordView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MyRecordsScaffold
        title={`Add ${this.props.recordType}`}
        subtitle="Enter your results below."
        backAction={() => this.props.navigation.dispatch(backAction)}
      >
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <Text h3 style={{ textAlign: "center", marginTop: 20 }}>
            {this.props.recordType}
          </Text>
          <Text style={{ textAlign: "center" }}>
            Date: {moment().format("MMMM Do, YYYY")}
          </Text>
          {this.props.children}
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, marginBottom: 10 }}>
              <Button
                disabled={this.props.opInProgress}
                backgroundColor={colors.green}
                icon={{ name: "ios-add-circle", type: "ionicon" }}
                title="Save"
                onPress={this.props.saveAction}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </MyRecordsScaffold>
    );
  }
}
