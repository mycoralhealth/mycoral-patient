import React from "react";
import { List, ListItem, CheckBox } from "react-native-elements";

import { TestRecordScreen } from "./TestRecordScreen";

import { HAIR_TEST, recordTypes } from "../utilities/recordTypes";
import { AddRecordView } from "./AddRecordView";

const recordType = recordTypes[HAIR_TEST];

export class AddHairTestRecordScreen extends TestRecordScreen {
  constructor(props) {
    super(props);

    this.state = {
      numberCysts: "",
      baldness: false,
      baldnessFromDisease: false,
      opInProgress: false
    };
  }

  onChangeValue(key, value) {
    let state = this.state;
    this.state[key] = value;
    this.setState(state);
  }

  async addRecord() {
    this.setState({ opInProgress: true });

    let results = [
      {
        key: "Number of painful cysts",
        value: this.state["numberCysts"],
        type: "marker",
        valueType: "magnitude"
      },
      {
        key: "Baldness",
        value: this.state["baldness"] ? "Yes" : "No",
        type: "marker",
        valueType: "boolean"
      },
      {
        key: "Baldness from disease",
        value: this.state["baldnessFromDisease"] ? "Yes" : "No",
        type: "marker",
        valueType: "boolean"
      }
    ];
    this.saveResults(results, HAIR_TEST);
  }

  render() {
    return (
      <AddRecordView
        recordType={recordType}
        navigation={this.props.navigation}
        opInProgress={this.state.opInProgress}
        saveAction={async () => this.addRecord()}
      >
        <List containerStyle={{ marginBottom: 20 }}>
          {[
            {
              key: "numberCysts",
              title: "Number of painful cysts",
              placeholder: "0"
            }
          ].map(item => (
            <ListItem
              key={item.key}
              title={item.title}
              hideChevron={true}
              textInput={true}
              textInputPlaceholder={item.placeholder}
              textInputValue={this.state[item.key]}
              textInputOnChangeText={title =>
                this.onChangeValue(item.key, title)
              }
              textInputKeyboardType="numeric"
              textInputReturnKeyType={"done"}
            />
          ))}
          {[
            { key: "baldness", title: "Baldness", disabled: false },
            {
              key: "baldnessFromDisease",
              title: "Baldness from disease",
              disabled: !this.state.baldness
            }
          ].map(item => (
            <ListItem
              key={item.key}
              title={this._renderCheckBox(item)}
              hideChevron={true}
              disabled={item.disabled}
            />
          ))}
        </List>
      </AddRecordView>
    );
  }

  _renderCheckBox(item) {
    if (item.disabled) {
      return <CheckBox title={item.title} onPress={() => {}} checked={false} />;
    } else {
      return (
        <CheckBox
          title={item.title}
          onPress={() => this.onChangeValue(item.key, !this.state[item.key])}
          checked={this.state[item.key]}
        />
      );
    }
  }
}
