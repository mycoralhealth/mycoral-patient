import React from 'react';
import { View } from 'react-native';

import { CoralHeader, colors } from '../ui.js';


export const SettingsScreen = () => (
  <View style={{ flex: 1, backgroundColor: colors.bg  }}>
    <CoralHeader title='Account Settings' subtitle='Configure blockchain account settings.'/>


  </View>
);