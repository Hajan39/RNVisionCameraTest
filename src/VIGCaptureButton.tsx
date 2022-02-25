import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import constants from './layout';

export interface VIGCaptureButtonProps {
  takePicture: () => void;
}

const VIGCaptureButton: React.FC<VIGCaptureButtonProps> = props => {
  return (
    <View style={styles.pressIconRow}>
      <TouchableOpacity
        testID="capture-button"
        onPress={props.takePicture}
        style={styles.capture}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pressIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#000',
    borderColor: 'rgba(255,255,255,0.7)',
    borderWidth: 3,
    borderRadius: 99,
    width: constants.window.width * 0.15,
    height: constants.window.width * 0.15,
    alignSelf: 'center',
    margin: 17,
  },
});

export default VIGCaptureButton;
