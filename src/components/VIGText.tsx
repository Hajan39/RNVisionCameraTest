import React, {FC, ReactNode} from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';
import constants from '../constants/layout';

export interface VIGTextProps extends TextProps {
  children: string | string[] | ReactNode;
  regular?: boolean;
  fontSize: number;
  lineHeight: number;
  color?: string;
}

const VIGText: FC<VIGTextProps> = props => {
  if (props.fontSize > props.lineHeight) {
    console.warn(
      `POZOR! vyska radku ${props.lineHeight} nesmi byt vetsi, nez font ${props.fontSize}!`,
    );
  }
  return (
    <Text
      {...props}
      style={[
        props.regular ? styles.roboto : styles.medium,
        {
          fontSize: props.fontSize,
          color: props.color || constants.defaultColors.dark500,
          lineHeight: props.lineHeight,
        },
        props.style,
      ]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  roboto: {fontFamily: constants.fonts.regular},
  medium: {fontFamily: constants.fonts.medium},
});

export default VIGText;
