import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
const backAction = NavigationActions.back();

import { CoralHeader, colors } from '../ui.js';

const doctorList = [
  {
    name: 'Dr. Isabela Moner',
    avatar_url: 'https://randomuser.me/api/portraits/women/65.jpg',
    institution: 'Alden General Hospital'
  },
  {
    name: 'Dr. Timothy Gunter',
    avatar_url: 'https://d3iw72m71ie81c.cloudfront.net/gaurav.JPG',
    institution: 'Chicago Hope'
  },
  {
    name: 'Dr. Lyle Kauffman',
    avatar_url: 'https://d3iw72m71ie81c.cloudfront.net/male-73.png',
    institution: 'Hilltop Hospital'
  },
  {
    name: 'Dr. Anna Faris',
    avatar_url: 'https://d3iw72m71ie81c.cloudfront.net/female-4.jpg',
    institution: 'Oxbridge General'
  },
  {
    name: 'Dr. Anthony Rapp',
    avatar_url: 'https://randomuser.me/api/portraits/men/97.jpg',
    institution: 'Kingdom Hospital'
  },
  {
    name: 'Dr. Daniel Webber',
    avatar_url: 'https://images.pexels.com/photos/428341/pexels-photo-428341.jpeg?h=350&auto=compress&cs=tinysrgb',
    institution: 'Saint Eligius Hospital'
  },
  {
    name: 'Dr. Scott Howard',
    avatar_url: 'https://randomuser.me/api/portraits/men/91.jpg',
    institution: 'Holby City Hospital'
  },
  {
    name: 'Dr. Sara Koivisto',
    avatar_url: 'https://d3iw72m71ie81c.cloudfront.net/female-83.jpg',
    institution: 'Princeton-Plainsboro Teaching Hospital'
  },
  {
    name: 'Dr. Damion Weir',
    avatar_url: 'https://randomuser.me/api/portraits/men/83.jpg',
    institution: 'Oxbridge General'
  }
];
export class RequestHealthTipScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CoralHeader title='Request Health Tip' subtitle='The following doctors offer health tips.'/>

        <ScrollView>
          <List containerStyle={{marginTop: 0, marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
            {
              doctorList.map((l, i) => (
                <ListItem
                  roundAvatar
                  avatar={{uri:l.avatar_url}}
                  key={i}
                  title={l.name}
                  subtitle={l.institution}
                  chevronColor={colors.red}
                  onPress={() => this.props.navigation.navigate('RequestHealthTipConfirm')}
                />
              ))
            }
          </List>

          <Button
            style={{ marginBottom: 20 }}
            backgroundColor={colors.red}
            icon={{name: 'ios-arrow-back', type: 'ionicon'}}
            title='Cancel'
            onPress={() => this.props.navigation.dispatch(backAction)}
          />
        </ScrollView>
      </View>
    );
  }
}
