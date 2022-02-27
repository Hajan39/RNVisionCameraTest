import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  HandlerStateChangeEventPayload,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  Camera,
  CameraDevice,
  CameraRuntimeError,
} from 'react-native-vision-camera';
import {globalStyles} from '../constants/globalStyles';
import constants from '../constants/layout';
import {transformFocusCoordinates} from '../functions/cameraFunctions';

let poiTime: NodeJS.Timeout | undefined;

export interface VIGCameraProps {
  cameraRef: React.RefObject<Camera> | undefined;
  device?: CameraDevice;
  torch: boolean;
  selectedRatio: number[];
  flashMode: 'auto' | 'off' | 'on';
  currentZoom: number;
  takingPicture: boolean;
}

const VIGCamera: React.FC<VIGCameraProps> = ({
  cameraRef,
  device,
  torch,
  selectedRatio,
  currentZoom,
  takingPicture,
  flashMode,
}) => {
  const [isActive, setIsActive] = useState<boolean>(true);

  const [pointOfInterest, setPointOfInterest] =
    useState<{x: number; y: number}>();
  const [imageWidth, imageHeight] = selectedRatio;
  const isAppForeground = useIsFocused();

  useEffect(() => {
    setIsActive(false);
    const timeout = setTimeout(() => {
      setIsActive(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, [selectedRatio]);

  const wh = useMemo(
    () => ({
      width: constants.window.width,
      height: (constants.window.width / imageHeight) * imageWidth,
      marginTop:
        (constants.window.height -
          (constants.window.width / imageHeight) * imageWidth) /
        2,
    }),
    [imageHeight, imageWidth],
  );

  const onTouch = (
    e: Readonly<HandlerStateChangeEventPayload & TapGestureHandlerEventPayload>,
  ) => {
    setPointOfInterest({x: e.x, y: e.y});
    const [x, y] = transformFocusCoordinates(e.x, e.y, wh.width, wh.height);
    cameraRef?.current?.focus({x, y});

    poiTime && clearTimeout(poiTime);
    poiTime = setTimeout(() => {
      setPointOfInterest(undefined);
    }, 3000);
  };

  const onError = useCallback((error: CameraRuntimeError) => {
    console.error('Camera Error', error);
  }, []);

  return (
    <>
      {isActive && device ? (
        <TapGestureHandler
          onHandlerStateChange={({nativeEvent}) => {
            device?.supportsFocus && onTouch(nativeEvent);
          }}>
          <Camera
            ref={cameraRef}
            style={[
              wh,
              takingPicture ? globalStyles.show : globalStyles.hide,
              styles.camera,
            ]}
            flashMode={flashMode}
            device={device}
            isActive={isAppForeground}
            preset={'photo'}
            zoom={currentZoom}
            onError={onError}
            torch={device.hasTorch && torch ? 'on' : 'off'}
            hdr={true}
            enableZoomGesture={true}
            photo={true}
          />
        </TapGestureHandler>
      ) : (
        <Text>No device found</Text>
      )}
      {pointOfInterest ? (
        <View
          style={[
            styles.pointOuter,
            {
              top: pointOfInterest?.y - 20,
              left: pointOfInterest?.x - 20,
            },
          ]}>
          <View style={styles.pointCenter} />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.defaultColors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraNotAuthorized: {
    padding: 20,
    paddingTop: 35,
  },
  pointOuter: {
    width: 40,
    height: 40,
    padding: 15,
    position: 'absolute',
    borderColor: constants.defaultColors.light,
    borderWidth: 1,
    borderRadius: 9999,
  },
  pointCenter: {
    width: 8,
    height: 8,
    borderColor: constants.defaultColors.light,
    borderWidth: 1,
    borderRadius: 9999,
  },
  camera: {
    backgroundColor: constants.defaultColors.backgroundColor,
  },
});

export default VIGCamera;
