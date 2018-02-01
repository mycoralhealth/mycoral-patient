import React, { Component } from 'react';
import { View } from 'react-native';
import { List, ListItem, CheckBox } from 'react-native-elements'

import { CoralHeader, colors } from '../ui.js';


AddGeneticTestRecord = (props) => {
    this.state = { checked: [ false, false ]};


    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg  }}>
        <List containerStyle={{marginBottom: 20}}>
          {
            [
              {"key":"BRCA1", "value":"positive"},
              {"key":"BRCA2", "value":"negative"}
            ].map((item, index) => (
              <ListItem
                key={item.key}
                title={
                  <CheckBox
                    title={item.key}
                    onPress={() => {
                      let checked = this.state.checked;
                      checked[index] = !checked[index];
                      this.setState({checked: checked});
                    }}
                    checked={this.state.checked[index]}
                  />
                }
                hideChevron={true}
              />
            ))
          }
        </List>
      </View>
    );
}


export default AddGeneticTestRecord;