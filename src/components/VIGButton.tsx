import * as React from 'react';
import {useMemo} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import constants from '../constants/layout';
import VIGText from './VIGText';
export interface VIGButtonProps {
  type: 'dark' | 'light' | 'white' | 'grey' | 'transparent';
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
}

const VIGButton: React.FC<VIGButtonProps> = props => {
  const btnStyle = useMemo(() => {
    switch (props.type) {
      case 'dark':
        return styles.darkType;
      case 'light':
        return styles.lightType;
      case 'white':
        return styles.whiteType;
      case 'grey':
        return styles.greyType;
      case 'transparent':
        return styles.transparentType;
    }
  }, [props.type]);

  const btnStyleText = useMemo(() => {
    switch (props.type) {
      case 'dark':
        return styles.darkTypeText;
      case 'light':
      case 'white':
      case 'grey':
      case 'transparent':
        return styles.whiteTypeText;
    }
  }, [props.type]);

  return (
    <TouchableOpacity
      testID={props.testID}
      disabled={props.disabled}
      style={[styles.button, btnStyle, props.style]}
      onPress={props.onPress}>
      <VIGText
        fontSize={14}
        lineHeight={19}
        style={[styles.buttonText, btnStyleText]}>
        {props.text}
      </VIGText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    elevation: 0,
    borderRadius: 0,
    paddingVertical: 10,
  },
  buttonText: {
    paddingHorizontal: 31,

    textTransform: 'uppercase',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
    textAlign: 'center',
  },
  transparentType: {
    backgroundColor: 'transparent',
  },
  greyType: {
    backgroundColor: constants.defaultColors.dark100,
  },
  darkType: {
    backgroundColor: constants.defaultColors.green500,
  },
  lightType: {
    backgroundColor: constants.defaultColors.green300,
  },
  whiteType: {
    backgroundColor: constants.defaultColors.light,
  },
  darkTypeText: {
    color: constants.defaultColors.light,
  },
  lightTypeText: {
    color: constants.defaultColors.green500,
  },
  whiteTypeText: {color: constants.defaultColors.green500},
});

export default VIGButton;
