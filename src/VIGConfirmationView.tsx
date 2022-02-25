import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import constants from './layout';
import VIGButton from './VIGButton';
import VIGIcon from './VIGIcon';

export interface ConfirmationViewProps {
  needConfirmation: string;
  selectedRatio: number[];
  showButtons: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  needConfirmation,
  selectedRatio,
  showButtons,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const [imageWidth, imageHeight] = selectedRatio;

  return (
    <View style={StyleSheet.absoluteFill}>
      <ImageZoom
        style={styles.imageZoom}
        cropWidth={constants.window.width}
        cropHeight={constants.window.height}
        imageWidth={constants.window.width}
        imageHeight={(constants.window.width / imageHeight) * imageWidth}>
        <FastImage
          source={{uri: 'file://' + needConfirmation}}
          style={{
            height: (constants.window.width / imageHeight) * imageWidth,
            width: constants.window.width,
          }}
          resizeMode={'cover'}
        />
      </ImageZoom>
      <View style={[styles.topBar]}>
        <TouchableOpacity style={styles.topBtn} onPress={onClose}>
          <VIGIcon
            color={constants.defaultColors.light}
            name="close"
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>
      {showButtons ? (
        <View style={styles.confirmView}>
          <VIGButton
            testID={'confirm-again-btn'}
            text={'znovu'}
            type="white"
            onPress={onCancel}
          />
          <VIGButton
            testID={'confirm-use-btn'}
            text={'Použít fotku'}
            type="dark"
            onPress={onConfirm}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  confirmView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: constants.defaultColors.light,
    width: constants.window.width,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.56)',
    width: constants.window.width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  topBtn: {
    padding: 21,
  },
  headerIcon: {color: constants.defaultColors.light, fontSize: 26},
  imageZoom: {
    position: 'absolute',
    backgroundColor: constants.defaultColors.backgroundColor,
    top: 0,
    left: 0,
  },
});

export default ConfirmationView;
