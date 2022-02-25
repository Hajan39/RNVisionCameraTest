import * as React from 'react';
import {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OrientationType} from 'react-native-orientation-locker';
import {globalStyles} from './globalStyles';
import constants from './layout';

export interface VIGZoomViewProps {
  zoomVisible: boolean;
  minZoom: number;
  maxZoom: number;
  currentZoom: number;
  orientation: OrientationType;
  onZoomPress: (value: number) => void;
}

const VIGZoomView: React.FC<VIGZoomViewProps> = ({
  zoomVisible,
  currentZoom,
  minZoom,
  maxZoom,
  onZoomPress,
  orientation,
}) => {
  const zooms = useMemo(
    () => [
      {key: ',5x', value: -1},
      {key: '1x', value: minZoom},
      {key: '2x', value: (2 / 8) * maxZoom},
      {key: '4x', value: (4 / 8) * maxZoom},
      {key: '8x', value: maxZoom},
    ],
    [minZoom, maxZoom],
  );

  return zoomVisible ? (
    <View style={styles.zoomRow}>
      {zooms.map(zoom => (
        <TouchableOpacity
          testID="zoom-value-btn"
          onPress={() => onZoomPress(zoom.value)}
          key={zoom.key}
          style={[
            zoom.value === currentZoom
              ? styles.zoomIconSelected
              : styles.zoomIcon,
            globalStyles[orientation],
          ]}>
          <Text style={styles.zoomText}>{zoom.key}</Text>
        </TouchableOpacity>
      ))}
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
  zoomRow: {
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-around',
    paddingTop: 14,
  },
  zoomIcon: {
    backgroundColor: constants.defaultColors.blackTransparent,
    borderWidth: 0.5,
    borderColor: constants.defaultColors.light,
    borderRadius: 999,
    width: 30,
    height: 30,
    margin: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomIconSelected: {
    backgroundColor: constants.defaultColors.blackTransparent,
    borderWidth: 1,
    borderColor: constants.defaultColors.light,
    borderRadius: 999,
    width: 30,
    height: 30,
    margin: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    fontFamily: constants.fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: constants.defaultColors.light,
  },
});

export default VIGZoomView;
