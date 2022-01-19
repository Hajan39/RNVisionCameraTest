import React, {FC, useEffect, useRef, useState} from 'react';
import {Dimensions, NativeTouchEvent, Text} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {
  Camera,
  CameraPermissionRequestResult,
  Point,
  useCameraDevices,
} from 'react-native-vision-camera';

const App: FC = () => {
  Orientation.lockToPortrait();
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  let window = Dimensions.get('window');
  const cameraRef = useRef<Camera>(null);

  const [perm, setPerm] = useState<CameraPermissionRequestResult>('denied');

  const [camLocation, setCamLocation] = useState<{x: number; y: number}>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    Camera.requestCameraPermission().then(res => {
      setPerm(x => res);
    });
  }, []);

  const touchII = async (event: NativeTouchEvent) => {
    let point: Point = {
      x: Math.round(event.pageX - camLocation.x),
      y: Math.round(event.pageY - camLocation.y),
    };
    console.log(point);

    await cameraRef?.current
      ?.focus(point)
      .then(() => {
        console.log('Focus succeeded');
      })
      .catch(reason => {
        console.log('Focus failed!', reason);
      });
  };

  if (device == null)
    return (
      <Text style={{margin: 30, color: 'white'}}>Device was not found</Text>
    );
  return perm === 'authorized' ? (
    <Camera
      ref={cameraRef}
      style={{
        marginTop: 60,
        marginLeft: 60,
        width: window.width - 60,
        height: window.height - 60,
      }}
      onLayout={event => {
        const layout = event.nativeEvent.layout;
        setCamLocation({x: layout.x, y: layout.y});
      }}
      device={device}
      isActive={true}
      onTouchEnd={x => device.supportsFocus && touchII(x.nativeEvent)}
    />
  ) : (
    <Text style={{margin: 30, color: 'red'}}>Permission was not granted</Text>
  );
};

export default App;
