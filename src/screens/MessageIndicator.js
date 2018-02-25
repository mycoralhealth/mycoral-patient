import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';

import { colors } from '../ui.js';

export default function MessageIndicator(props) {
  return (
    <View>
      <Text style={{textAlign: 'center'}}>{props.message}</Text>
      <ActivityIndicator size="large" color={colors.green} style={{marginTop: 10}}/>
    </View>
  );
}
