import React, { Component } from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { MyRecordsScaffold } from "./MyRecordsScaffold";
import RNPickerSelect from "react-native-picker-select";
import { colors } from "../ui";

const backAction = NavigationActions.back();
const screenStages = {
  form: 1,
  results: 2
};

import insuranceInfo from "../data/insuranceInfo.json";
const _infoMapper = datas => {
  tempMap = {};
  datas.forEach(data => {
    tempMap[data.key] = data.name;
  });
  return tempMap;
};

const companyMap = _infoMapper(insuranceInfo["companies"]);
const procedureMap = _infoMapper(insuranceInfo["procedures"]);

export class CheckInsuranceScreen extends Component {
  constructor(props) {
    super(props);
    this.record = {};
    this.props.navigation.state.params.record.results.forEach(record => {
      this.record[record.key] = record.value;
    });
    this.state = {
      stage: screenStages.form,
      company: "",
      procedure: "",
      approved: false
    };
  }

  render() {
    return (
      <MyRecordsScaffold
        title="Check Insurance Approval"
        subtitle="Select a company and a procedure."
        backAction={() => this.props.navigation.dispatch(backAction)}
      >
        <ScrollView style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
          {this._renderBody()}
        </ScrollView>
      </MyRecordsScaffold>
    );
  }

  _renderBody() {
    switch (this.state.stage) {
      case screenStages.form:
        return this._renderSelectForm();
      case screenStages.results:
        return this._renderApprovalDetails();
    }
  }

  _renderSelectForm() {
    return (
      <View>
        <Text h4 style={styles.centerText}>
          {"Select the procedure for which you want insurance approval"}
        </Text>
        {CheckInsuranceScreen._renderPicker({
          type: "procedure",
          choice: this.state.procedure,
          choices: insuranceInfo.procedures,
          onChangeValue: value => this.setState({ procedure: value })
        })}
        <Text h4 style={styles.centerText}>
          {"Select insurance company"}
        </Text>
        {CheckInsuranceScreen._renderPicker({
          type: "company",
          choice: this.state.company,
          choices: insuranceInfo.companies,
          onChangeValue: value => this.setState({ company: value })
        })}
        <View style={{ marginTop: 20 }}>
          <Button
            backgroundColor={colors.green}
            icon={{ name: "ios-add-circle", type: "ionicon" }}
            title="Submit"
            onPress={() => this._checkApproval(this.record)}
          />
        </View>
      </View>
    );
  }

  static _renderPicker(props) {
    return (
      <RNPickerSelect
        //style={styles.picker}
        style={{ backgroundColor: colors.white }}
        placeholder={{
          label: "Select a " + props.type + ". . .",
          value: ""
        }}
        value={props.choice}
        onValueChange={props.onChangeValue}
        items={props.choices.map((choice, i) => ({
          label: choice.name,
          value: choice.key
        }))}
      />
    );
  }

  _renderApprovalDetails() {
    return (
      <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
        {(() => {
          if (this.state.approved) {
            return (
              <Image
                style={styles.approvalImage}
                source={require("../../assets/icons8-checkmark-500.png")}
              />
            );
          } else {
            return (
              <Image
                style={styles.approvalImage}
                source={require("../../assets/icons8-cancel-512.png")}
              />
            );
          }
        }).call()}
        <Text h4 style={styles.centerText}>{this._generateApprovalText()}</Text>
      </View>
    );
  }

  _checkApproval(record) {
    // Get the static approval information.
    const approvalInfo =
      insuranceInfo.approvals[this.state.procedure][this.state.company];
    let approved = false;

    // Reduce the static info with the procedure criterion.
    switch (this.state.procedure) {
      case "laserHairRemoval":
        approved = record["Number of painful cysts"] > 1 && approvalInfo;
        break;
      case "hairTransplant":
        approved = record["Baldness from disease"] && approvalInfo;
        break;
    }
    this.setState({ approved: approved, stage: screenStages.results });
  }

  _generateApprovalText() {
    const approved = this.state.approved;
    var approvalText =
      "According to " + companyMap[this.state.company] + "’s medical policy, ";
    approvalText = approvalText + "you" + (!approved ? " do not " : " ");
    approvalText =
      approvalText + "qualify for " + procedureMap[this.state.procedure] + ".";
    return approvalText;
  }
}

const styles = StyleSheet.create({
  approvalImage: {
    width: 200,
    height: 200
  },
  centerText: {
    textAlign: "center",
    marginTop: 20
  }
});
