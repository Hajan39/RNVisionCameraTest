import ImageEditor from '@react-native-community/image-editor';
import * as React from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';
import HWKeyboardEvent from 'react-native-hw-keyboard-event';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import SoundPlayer from 'react-native-sound-player';
import {
  Camera,
  CameraDevice,
  CameraPermissionStatus,
  PhotoFile,
  useCameraDevices,
} from 'react-native-vision-camera';
import {calcImgSizes, normalizeImagePath} from './cameraFunctions';
import {globalStyles} from './globalStyles';
import constants from './layout';
import LoadingPage from './LoadingPage';
import {CameraSetting} from './userConfig';
import VIGCamera from './VIGCamera';
import VIGCameraHederBar from './VIGCameraHeaderBar';
import VIGCameraLensSelector from './VIGCameraLensSelector';
import VIGCaptureButton from './VIGCaptureButton';
import ConfirmationView from './VIGConfirmationView';
import VIGZoomView from './VIGZoomView';

let timeout: NodeJS.Timeout | undefined;
let zoomTime: NodeJS.Timeout | undefined;
export interface VIGCameraPageProps {
  cameraSettings: CameraSetting;
  showPreview: 'NP' | '3S' | 'PV';
  closeCamera: () => void;
  updateUserConfig: (
    fieldName: 'flashMode' | 'volumeUp' | 'ratio' | 'torchOn',
    value: string | boolean,
  ) => void;
  saveImage: (imageData: string, wait: boolean, rotate?: number) => void;
}

const VIGCameraPage: React.FC<VIGCameraPageProps> = props => {
  const [needConfirmation, setNeedConfirmation] =
    useState<{data: PhotoFile; orientation: OrientationType}>();
  const cameraRef = useRef<Camera>(null);
  const [authorizationStatus, setAuthorizationStatus] =
    useState<CameraPermissionStatus>('authorized');

  // Device Selectors
  const [selectedCamera, setSelectedCamera] = useState<
    CameraDevice | undefined
  >(useCameraDevices().back);
  const [wideCamera, setWideCamera] = useState<CameraDevice | undefined>();
  const [defaultCamera, setDefaultCamera] = useState<
    CameraDevice | undefined
  >();

  // Ratio Settings
  const supportedRations = useMemo(
    () => [
      [1, 1],
      [4, 3],
      [16, 9],
    ],
    [],
  );

  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [selectedRatio, setSelectedRatio] = useState<number[]>(
    props.cameraSettings?.ratio?.split(':').map(splitPart => {
      const nums = parseInt(splitPart, 10);
      return nums;
    }) || [4, 3],
  );

  const [orientation, setOrientationInside] = useState<OrientationType>(
    Orientation.getInitialOrientation(),
  );

  const setOrientation = (orientationNew: OrientationType) => {
    if (
      [
        OrientationType['LANDSCAPE-LEFT'],
        OrientationType['LANDSCAPE-RIGHT'],
        OrientationType.PORTRAIT,
        OrientationType['PORTRAIT-UPSIDEDOWN'],
      ].includes(orientationNew)
    ) {
      setOrientationInside(orientationNew);
    }
  };

  const [zoom, setZoom] = useState<number>(selectedCamera?.neutralZoom || 1);

  const [allowedNext, setAllowedNext] = useState<boolean>(true);

  const saveImageLocal = useCallback(
    async (
      data: PhotoFile,
      orientationLocal: OrientationType,
      wait: boolean,
    ) => {
      const opts = calcImgSizes(
        data.width,
        data.height,
        selectedRatio[0] / selectedRatio[1],
      );

      let res = normalizeImagePath(data.path, true);
      try {
        res = await ImageEditor.cropImage(res, opts);
      } catch (error) {
        console.error('Image was not cropped.', error);
      }

      let rotate = 0;
      switch (orientationLocal) {
        case 'LANDSCAPE-LEFT':
          rotate = 270;
          break;
        case 'LANDSCAPE-RIGHT':
          rotate = 90;
          break;
        case 'PORTRAIT-UPSIDEDOWN':
          rotate = 180;
          break;
        default:
          break;
      }

      props.saveImage(res, wait, rotate);
    },
    [props, selectedRatio],
  );

  const [savings, setSavings] = useState<Promise<void>[]>([]);
  const savingsAll = useMemo(() => {
    return Promise.allSettled(savings);
  }, [savings]);
  const savingsAllRef = useRef<Promise<PromiseSettledResult<void>[]>>(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    new Promise(() => {}), //savingsAll
  );
  useEffect(() => {
    savingsAllRef.current = savingsAll;
  }, [savingsAll]);

  const backAction = () => {
    savingsAllRef.current.finally(() => props.closeCamera());

    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
    // TODO https://support.trask.cz/browse/GEMSEEM-179
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePicture = async () => {
    if (allowedNext) {
      setAllowedNext(false);
      try {
        const data = await cameraRef.current?.takePhoto({
          flash: props.cameraSettings.flashMode || 'off',
          qualityPrioritization: 'speed',
        });
        props.cameraSettings.volumeUp &&
          SoundPlayer.playSoundFile('shutter', 'wav');

        if (data) {
          switch (props.showPreview) {
            case 'NP':
              setAllowedNext(true);
              setZoom(zoom === 1 ? 1.00001 : 1);
              setSavings(prevSavings => [
                ...prevSavings,
                saveImageLocal(data, orientation, false),
              ]);

              break;
            case '3S':
              setNeedConfirmation({data, orientation});
              timeout = setTimeout(() => {
                setNeedConfirmation(undefined);
                setAllowedNext(true);
              }, 3000);
              setZoom(zoom === 1 ? 1.00001 : 1);
              setSavings(prevSavings => [
                ...prevSavings,
                saveImageLocal(data, orientation, true),
              ]);
              break;
            case 'PV':
              setNeedConfirmation({data, orientation});
              break;
            default:
              setAllowedNext(true);
              setZoom(zoom === 1 ? 1.00001 : 1);
              setSavings(prevSavings => [
                ...prevSavings,
                saveImageLocal(data, orientation, false),
              ]);
              break;
          }
        }
      } catch (error) {
        console.error('Take picture failed! ', error);
      }
    }
  };

  const setShowZoom = () => {
    setZoomVisible(true);
    zoomTime && clearTimeout(zoomTime);
    zoomTime = setTimeout(() => {
      setZoomVisible(false);
    }, 5000);
  };

  // ------ UseEffects ------
  useEffect(() => {
    const chngOrientation = (o: OrientationType) => {
      setOrientation(o);
    };

    Orientation.getDeviceOrientation(chngOrientation);
    Orientation.addDeviceOrientationListener(chngOrientation);

    return () => {
      Orientation.removeDeviceOrientationListener(chngOrientation);
    };
  }, []);

  useEffect(() => {
    //this is then make sense because there are two independent operations on initialization
    Camera.getCameraPermissionStatus().then(camPermStatus => {
      setAuthorizationStatus(camPermStatus);
      if (camPermStatus !== 'authorized') {
        Camera.requestCameraPermission().then(setAuthorizationStatus);
      }
    });
    Camera.getAvailableCameraDevices().then(camDevices => {
      const devices = camDevices.filter(device => device.position === 'back');
      const widestRange = devices.reduce((prevDevice, currDevice) =>
        prevDevice.formats[0].fieldOfView < currDevice.formats[0].fieldOfView
          ? currDevice
          : prevDevice,
      );
      if (devices.length > 1) {
        setWideCamera(widestRange);
      }
      setDefaultCamera(devices[0]);
      setSelectedCamera(devices[0]);
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Function 'handleHardwareEnterPress' works greats
    HWKeyboardEvent.onHWKeyPressed(handleHardwareEnterPress);

    return () => {
      HWKeyboardEvent.removeOnHWKeyPressed();
    };
    //TODO https://support.trask.cz/browse/GEMSEEM-179
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, allowedNext, orientation]);

  const handleHardwareEnterPress = (key: {pressedKey: string}) => {
    if (key.pressedKey === 'DOWN') {
      takePicture();
    }
  };

  if (authorizationStatus === 'authorized') {
    return (
      <SafeAreaView style={[styles.container]}>
        <VIGCamera
          cameraRef={cameraRef}
          selectedRatio={selectedRatio}
          torch={props.cameraSettings.torchOn}
          flashMode={props.cameraSettings.flashMode || 'off'}
          currentZoom={zoom}
          device={selectedCamera}
          takingPicture={allowedNext}
        />
        <VIGCameraHederBar
          setFlashMode={mode => {
            if (mode) {
              props.updateUserConfig('flashMode', mode);
            }
          }}
          supportedRations={supportedRations}
          flashMode={props.cameraSettings.flashMode || 'off'}
          isTorchOn={props.cameraSettings.torchOn}
          orientation={orientation}
          toggleTorch={() => {
            props.updateUserConfig('torchOn', !props.cameraSettings.torchOn);
          }}
          toggleVolume={() => {
            props.updateUserConfig('volumeUp', !props.cameraSettings.volumeUp);
          }}
          isVolumeUp={props.cameraSettings.volumeUp}
          onClose={() => {
            timeout && clearTimeout(timeout);
            backAction();
          }}
          selectedRatio={selectedRatio}
          setRatio={ratio => {
            setSelectedRatio(ratio);
            props.updateUserConfig('ratio', ratio.join(':'));
          }}
        />

        {needConfirmation ? (
          <ConfirmationView
            needConfirmation={needConfirmation.data.path}
            showButtons={props.showPreview === 'PV'}
            selectedRatio={selectedRatio}
            onConfirm={() => {
              setAllowedNext(true);
              saveImageLocal(
                needConfirmation.data,
                needConfirmation.orientation,
                false,
              );
              setNeedConfirmation(undefined);

              setZoom(zoom === 1 ? 1.00001 : 1);
            }}
            onCancel={() => {
              setAllowedNext(true);
              setNeedConfirmation(undefined);
            }}
            onClose={() => {
              setAllowedNext(true);
              setNeedConfirmation(undefined);
              timeout && clearTimeout(timeout);
              backAction();
            }}
          />
        ) : (
          <>
            <View
              style={[
                styles.cameraLensView,
                zoomVisible ? styles.cameraLensViewWithZoom : null,
              ]}>
              <VIGCameraLensSelector
                orientation={orientation}
                avalCameras={
                  wideCamera ? [defaultCamera, wideCamera] : [defaultCamera]
                }
                selectedCamera={selectedCamera}
                setSelectedCamera={cameraSelected => {
                  if (cameraSelected !== selectedCamera) {
                    if (cameraSelected === wideCamera) {
                      setZoom(-1);
                    } else {
                      setZoom(selectedCamera?.minZoom || 1);
                    }
                  }
                  setSelectedCamera(cameraSelected);
                  setShowZoom();
                }}
              />
            </View>
            <View
              style={[styles.takePictureView, {width: constants.window.width}]}>
              {zoomVisible ? (
                <VIGZoomView
                  zoomVisible={zoomVisible}
                  currentZoom={zoom}
                  minZoom={selectedCamera?.minZoom || 1}
                  maxZoom={selectedCamera?.maxZoom || 60}
                  orientation={orientation}
                  onZoomPress={zoomSelected => {
                    setZoom(zoomSelected);
                    setShowZoom();
                    if (zoomSelected < 0) {
                      wideCamera && setSelectedCamera(wideCamera);
                    } else {
                      setSelectedCamera(defaultCamera);
                    }
                  }}
                />
              ) : null}
              <VIGCaptureButton takePicture={takePicture} />
            </View>
          </>
        )}
      </SafeAreaView>
    );
  } else {
    return (
      <View style={[StyleSheet.absoluteFill, globalStyles.center]}>
        <LoadingPage
          text={'Prosím, přidejte práva!'}
          cancelText={'Zažádat'}
          onCancel={() => {
            Camera.requestCameraPermission().then(setAuthorizationStatus);
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: constants.defaultColors.dark300},
  takePictureView: {
    width: constants.window.width,
    position: 'absolute',
    bottom: 0,
    right: 0,
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: constants.defaultColors.blackTransparent,
  },
  cameraLensView: {
    position: 'absolute',
    bottom: 124,
    width: constants.window.width,
    alignContent: 'center',
  },
  cameraLensViewWithZoom: {
    bottom: 154,
  },
});

export default VIGCameraPage;
