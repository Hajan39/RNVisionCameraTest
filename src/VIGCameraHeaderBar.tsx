import * as React from 'react';
import {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OrientationType} from 'react-native-orientation-locker';
import {globalStyles} from './globalStyles';
import constants from './layout';
import VIGIcon from './VIGIcon';

export interface VIGCameraHederBarProps {
  setFlashMode: (flashMode: 'on' | 'off' | 'auto' | undefined) => void;
  flashMode: 'on' | 'off' | 'auto';
  isTorchOn: boolean;
  toggleTorch: () => void;
  onClose: () => void;
  supportedRations: number[][];
  isVolumeUp: boolean;
  toggleVolume: () => void;
  selectedRatio: number[];
  setRatio: (ratio: number[]) => void;
  orientation: OrientationType;
}

const VIGCameraHederBar: React.FC<VIGCameraHederBarProps> = ({
  toggleTorch,
  setRatio,
  supportedRations,
  isVolumeUp,
  toggleVolume,
  selectedRatio,
  isTorchOn,
  onClose,
  flashMode,
  setFlashMode,
  orientation,
}) => {
  const [isFlashBarVisible, setIsFlashBarVisible] = useState<boolean>(false);
  const [showRatioBar, setShowRatioBar] = useState<boolean>(false);

  const flashShowBtnPress = () => {
    !isTorchOn && setIsFlashBarVisible(true);
  };

  const ratioBarShowBtnPress = () => setShowRatioBar(true);

  const getTopbarIcons = () => {
    return (
      <>
        <TouchableOpacity
          testID={'close-btn'}
          style={styles.topBtn}
          onPress={onClose}>
          <VIGIcon
            name="close"
            style={styles.headerIcon}
            color={constants.defaultColors.light}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID={'flash-show-btn'}
          style={styles.topBtn}
          onPress={flashShowBtnPress}>
          <VIGIcon
            color={constants.defaultColors.light}
            name={
              isTorchOn
                ? 'flash-off'
                : flashMode === 'on'
                ? 'flash'
                : flashMode === 'auto'
                ? 'flash-auto'
                : 'flash-off'
            }
            style={[styles.headerIcon, globalStyles[orientation]]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID={'torch-toggle-btn'}
          style={styles.topBtn}
          onPress={toggleTorch}>
          <VIGIcon
            color={constants.defaultColors.light}
            name={isTorchOn ? 'lightbulb' : 'lightbulb-off'}
            style={[styles.headerIcon, globalStyles[orientation]]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID={'volume-toggle-btn'}
          style={styles.topBtn}
          onPress={toggleVolume}>
          <VIGIcon
            color={constants.defaultColors.light}
            name={isVolumeUp ? 'volume-high' : 'volume-off'}
            style={[styles.headerIcon, globalStyles[orientation]]}
          />
        </TouchableOpacity>
        {Platform.OS === 'android' ? (
          <TouchableOpacity
            testID={'ratio-bar-show-btn'}
            style={[styles.topBtn, globalStyles[orientation]]}
            onPress={ratioBarShowBtnPress}>
            <Text style={styles.ratioText}>{selectedRatio.join(':')}</Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  const radioBtnPress = (supportedRatio: number[]) => {
    setShowRatioBar(false);
    setRatio(supportedRatio);
  };

  const flashCloseBtnPress = () => {
    setFlashMode(undefined);
    setIsFlashBarVisible(false);
  };

  const flashOffBtn = () => {
    setFlashMode('off');
    setIsFlashBarVisible(false);
  };

  const flashOnBtn = () => {
    setFlashMode('on');
    setIsFlashBarVisible(false);
  };

  const flashAutoBtn = () => {
    setFlashMode('auto');
    setIsFlashBarVisible(false);
  };

  const getFlashBar = () => {
    return (
      <>
        <TouchableOpacity
          testID={'flash-close-btn'}
          style={[styles.topBtn, styles[orientation]]}
          onPress={flashCloseBtnPress}>
          <VIGIcon
            color={constants.defaultColors.light}
            name="close"
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID={'flash-off-btn'}
          style={styles.topBtn}
          onPress={flashOffBtn}>
          <VIGIcon
            name={'flash-off'}
            color={
              flashMode === 'off'
                ? constants.defaultColors.orange
                : constants.defaultColors.light
            }
            style={[
              flashMode === 'off'
                ? styles.headerIconSelected
                : styles.headerIcon,
              styles[orientation],
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID={'flash-on-btn'}
          style={styles.topBtn}
          onPress={flashOnBtn}>
          <VIGIcon
            name={'flash'}
            color={
              flashMode === 'on'
                ? constants.defaultColors.orange
                : constants.defaultColors.light
            }
            style={[
              flashMode === 'on'
                ? styles.headerIconSelected
                : styles.headerIcon,
              styles[orientation],
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID={'flash-auto-btn'}
          style={styles.topBtn}
          onPress={flashAutoBtn}>
          <VIGIcon
            name="flash-auto"
            color={
              flashMode === 'auto'
                ? constants.defaultColors.orange
                : constants.defaultColors.light
            }
            style={[
              flashMode === 'auto'
                ? styles.headerIconSelected
                : styles.headerIcon,
              styles[orientation],
            ]}
          />
        </TouchableOpacity>
      </>
    );
  };
  const getRatioBar = () => {
    return (
      <>
        {supportedRations.map((supportedRatio, i) => (
          <TouchableOpacity
            testID={'ratio-btn'}
            key={i}
            style={styles.topBtn}
            onPress={() => radioBtnPress(supportedRatio)}>
            <Text
              style={[
                selectedRatio[0] === supportedRatio[0] &&
                selectedRatio[1] === supportedRatio[1]
                  ? styles.selectedRatioText
                  : styles.ratioText,
                globalStyles[orientation],
              ]}>
              {supportedRatio.join(':')}
            </Text>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  return (
    <>
      <View style={[styles.topBar]}>
        {isFlashBarVisible
          ? getFlashBar()
          : showRatioBar
          ? getRatioBar()
          : getTopbarIcons()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.56)',
    width: constants.window.width,
    flexDirection: 'row',
  },
  topBtn: {
    padding: 21,
  },
  selectedRatioText: {
    color: constants.defaultColors.orange,
    fontSize: 17,
  },
  ratioText: {
    color: constants.defaultColors.light,
    fontSize: 17,
  },

  pressIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerIcon: {color: constants.defaultColors.light, fontSize: 26},
  headerIconSelected: {color: constants.defaultColors.orange, fontSize: 26},
  'LANDSCAPE-LEFT': {transform: [{rotate: '90deg'}]},
  'LANDSCAPE-RIGHT': {transform: [{rotate: '270deg'}]},
  PORTRAIT: {},
  'PORTRAIT-UPSIDEDOWN': {transform: [{rotate: '180deg'}]},
  UNKNOWN: {},
  'FACE-UP': {},
  'FACE-DOWN': {transform: [{rotate: '180deg'}]},
});

export default VIGCameraHederBar;
