import React from 'react';
import { View, Text, ScrollView, Share } from 'react-native';
import { Button } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import { NavigationActions } from 'react-navigation';
import { Constants } from 'expo';


import { CoralHeader, CoralFooter, colors } from '../ui';
import MessageIndicator from './MessageIndicator';

const backAction = NavigationActions.back();

function QRCodeDisplay(props) {
  if (props.loading) {
    return (
      <MessageIndicator message="Loading..." />
    );
  }

  if (props.data) {
    return (
      <View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
          <QRCode
            value={props.data}
            size={300}
            bgColor='#333'
            fgColor={colors.bg}/>
        </View>
        <View style={{ flex: 1, marginTop: 20, marginBottom: 20}}>
          <Button
            backgroundColor={colors.darkerGray}
            icon={{name: 'ios-share', type: 'ionicon'}}
            title='Share' 
            onPress={() => {props.onShareData()}}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
        <Text style={{ padding: 20, color: colors.red}}>
          You haven't setup your account info. Please complete the setup process in Settings > Account.
        </Text>
      </View>
    );
  }
}

export class QRCodeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: null, loading: true };
  }

  componentDidMount() {
    const data = this.props.navigation.state.params.data;
    const type = this.props.navigation.state.params.type;

    this.setState({ data, type, loading: false });
  }

  shareData() {
    Share.share({
        message: this.props.navigation.state.params.shareMessage,
        url: `${Constants.linkingUri}?type=${encodeURIComponent(this.state.type)}&data=${encodeURIComponent(this.state.data)}`,
        title: 'Medical Record Sharing'
      }, {
        // Android only:
        dialogTitle: 'Coral Health',
      });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg  }}>
        <CoralHeader title={this.props.navigation.state.params.title} subtitle={this.props.navigation.state.params.subTitle} />

        <ScrollView style={{ flex: 1}}>
          <QRCodeDisplay
            data={this.state.data}
            loading={this.state.loading}
            onShareData={this.shareData.bind(this)}
          />
        </ScrollView>
        <CoralFooter backAction={() => this.props.navigation.dispatch(backAction)}/>
      </View>
    );
  }
}
