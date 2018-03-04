import React, { Component } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import { NavigationActions } from 'react-navigation';

import { colors } from '../ui.js';

export class ViewImageScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ImageViewer 
          imageUrls={this.props.navigation.state.params.images} 
          renderIndicator={() => {return null}}
        />
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.darkerGray,
    padding: 10
  }
})