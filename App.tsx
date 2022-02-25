import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import {
  Camera,
  CameraPermissionRequestResult,
  useCameraDevices,
} from 'react-native-vision-camera';
import {CameraSetting, CameraType} from './src/userConfig';
import VIGCameraPage from './src/VIGCameraPage';

Promise.allSettled =
  Promise.allSettled ||
  ((promises: Promise<unknown>[]) =>
    Promise.all(
      promises.map(p =>
        p
          .then(value => ({
            status: 'fulfilled',
            value,
          }))
          .catch(error => ({
            status: 'rejected',
            error,
          })),
      ),
    ));

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

  const [camSetting, setCamSetting] = useState<CameraSetting>({
    cameraType: CameraType.SmartExperta,
    flashMode: 'off',
    torchOn: false,
    ratio: '16:9',
    volumeUp: false,
  });

  const updateCameraSettings = (
    fieldName: 'flashMode' | 'volumeUp' | 'ratio' | 'torchOn',
    value: string | boolean,
  ) => {
    const conf: CameraSetting = {...camSetting, [fieldName]: value};
    setCamSetting(conf);
  };
  const navigationRef = useNavigationContainerRef();

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <VIGCameraPage
          cameraSettings={camSetting}
          showPreview="PV"
          closeCamera={() => {}}
          updateUserConfig={updateCameraSettings}
          saveImage={(imageData: string, wait: boolean, rotate?: number) => {}}
        />
      </NavigationContainer>
      {/* {navigationRef.current?.getCurrentRoute()?.name !== 'CameraPage' ? (
        <Toast position="bottom" config={toastConfig} />
      ) : null} */}
    </>
  );
};

export default App;
