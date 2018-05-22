import React, { Component } from "react";
import { View } from "react-native";

import { CoralHeader, CoralFooter, colors } from "../ui";

/**
 * Scaffolding component for this various application records screens.
 * @param {String} title The title of this screen.
 * @param {String} subtitle The subtitle of this screen.
 * @param {Object} backAction Method to call on back event.
 */
export class MyRecordsScaffold extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader title={this.props.title} subtitle={this.props.subtitle} />
        {this.props.children}
        <CoralFooter backAction={this.props.backAction} />
      </View>
    );
  }
}
