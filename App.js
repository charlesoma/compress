import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Camera, Permissions } from 'expo';


class Home extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Button style={styles.container} title={'Camera'} onPress={() => this.props.navigation.navigate('Camera')} />
      </View>
    );
  }
}

class CameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      isRecording: false,
      uri: 'none'
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { audio } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({ 
      hasCameraPermission: status === 'granted',
      hasAudioPermission: audio === 'granted'
    });
  }

  async record() {
    if (this.camera) {

    this.setState({
      isRecording: true,
    });
    await this.camera.recordAsync().then((file) => {
      this.setState({ uri: file.uri });
      console.log(this.state.uri);
    });
   }
  }

  stopRecording = async () => {
    if (this.camera) {
      this.camera.stopRecording();
      this.setState({
        isRecording: false,
      });
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={!this.state.isRecording ? this.record.bind(this) : this.stopRecording.bind(this)}
                >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {
                    (!this.state.isRecording)?
                      'Record' : 'Recording'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: Home,
    Camera: CameraPage
  }, {
    initialRouteName: 'Home'
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
