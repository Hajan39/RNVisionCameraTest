import React, {ReactNode} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {default as constants} from './layout';
import VIGButton from './VIGButton';
import VIGText from './VIGText';

export interface LoadingPageProps {
  children?: ReactNode;
  text: string;
  onCancel?: () => void;
  cancelText?: string;
}
const LoadingPage: React.FC<LoadingPageProps> = (props: LoadingPageProps) => {
  return (
    <View style={styles.container}>
      <FastImage
        style={[styles.image]}
        source={require('./logo.png')}
        resizeMode={FastImage.resizeMode.contain}
      />

      <VIGText fontSize={25} lineHeight={27} style={styles.loadingText}>
        {props.text}
      </VIGText>
      <ActivityIndicator
        size="large"
        color={constants.defaultColors.green500}
      />
      {props.onCancel && (
        <VIGButton
          style={styles.button}
          text={props.cancelText || 'stop'}
          type="dark"
          onPress={props.onCancel}
        />
      )}
      {props.children}
    </View>
  );
};
export default LoadingPage;
const styles = StyleSheet.create({
  button: {
    marginTop: 40,
    width: constants.window.width / 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: constants.defaultColors.light,
  },
  image: {
    resizeMode: 'contain',
    width: constants.window.width * 0.4,
    height: constants.window.width * 0.4,
  },
  loadingText: {
    textAlign: 'center',
  },
});
