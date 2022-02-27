import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OrientationType} from 'react-native-orientation-locker';
import {CameraDevice} from 'react-native-vision-camera';
import {globalStyles} from './globalStyles';
import constants from './layout';

export interface VIGCameraLensSelectorProps {
  orientation: OrientationType;
  avalCameras: (CameraDevice | undefined)[];
  selectedCamera: CameraDevice | undefined;
  setSelectedCamera: (camera: CameraDevice | undefined) => void;
}

const VIGCameraLensSelector: React.FC<VIGCameraLensSelectorProps> = ({
  avalCameras,
  selectedCamera,
  setSelectedCamera,
  orientation,
}) => {
  const selectCamera1 = () => {
    setSelectedCamera(avalCameras[0]);
  };

  const selectCamera2 = () => {
    setSelectedCamera(avalCameras[1]);
  };

  return avalCameras.length > 1 ? (
    <View style={[styles.camerasContainer]}>
      <TouchableOpacity
        testID={'selected-camera-1-btn'}
        onPress={selectCamera1}
        style={[
          selectedCamera === avalCameras[0]
            ? styles.slectedCamera
            : styles.camera,
        ]}>
        <Text
          style={[
            selectedCamera === avalCameras[0] ? styles.black : styles.white,
            styles.cameraText,
            globalStyles[orientation],
          ]}>
          STROMY 2
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID={'selected-camera-2-btn'}
        onPress={selectCamera2}
        style={[
          selectedCamera === avalCameras[1]
            ? styles.slectedCamera
            : styles.camera,
        ]}>
        <Text
          style={[
            selectedCamera === avalCameras[1] ? styles.black : styles.white,

            styles.cameraText,
            globalStyles[orientation],
          ]}>
          STROMy 3
        </Text>
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.defaultColors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camerasContainer: {
    padding: 4,
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    bottom: 0,
  },
  slectedCamera: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  camera: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  cameraText: {
    fontSize: 18,
    lineHeight: 18,
  },
  black: {
    color: constants.defaultColors.dark500,
  },
  white: {
    color: constants.defaultColors.light,
  },
});

export default VIGCameraLensSelector;
