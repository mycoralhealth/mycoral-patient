import React from "react";
import { List, ListItem, CheckBox } from "react-native-elements";

import { TestRecordScreen } from "./TestRecordScreen";

import { GENETIC_TEST, recordTypes } from "../utilities/recordTypes";
import { AddRecordView } from "./AddRecordView";

export class AddGeneticTestRecordScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.state = { checked: [false, false], opInProgress: false };
  }

  onChangeValue(index) {
    let state = this.state;
    this.state.checked[index] = !this.state.checked[index];
    this.setState(state);
  }

  async addRecord() {
    this.setState({ opInProgress: true });

    let results = [
      {
        key: "BRCA1",
        value: this.state.checked[0] ? "positive" : "negative",
        type: "gene",
        valueType: "mutation"
      },
      {
        key: "BRCA2",
        value: this.state.checked[1] ? "positive" : "negative",
        type: "gene",
        valueType: "mutation"
      }
    ];
    this.saveResults(results, GENETIC_TEST);
  }

  render() {
    return (
      <AddRecordView
        recordType={recordTypes[GENETIC_TEST]}
        navigation={this.props.navigation}
        opInProgress={this.state.opInProgress}
        saveAction={async () => this.addRecord()}
      >
        <List containerStyle={{ marginBottom: 20 }}>
          {[{ key: "BRCA1" }, { key: "BRCA2" }].map((item, index) => (
            <ListItem
              key={item.key}
              title={
                <CheckBox
                  title={item.key}
                  onPress={() => this.onChangeValue(index)}
                  checked={this.state.checked[index]}
                />
              }
              hideChevron={true}
            />
          ))}
        </List>
      </AddRecordView>
    );
  }
}
