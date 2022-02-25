import * as React from 'react';
import {FC} from 'react';
import {GestureResponderEvent, StyleProp, TextStyle} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconName} from './iconName';
import constants from './layout';

export interface VIGIconProps extends IconProps {
  name: IconName;
  style?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  active?: boolean;
  color?: string;
  solid?: boolean;
  light?: boolean;
  testID?: string;
}

const VIGIcon: FC<VIGIconProps> = props => {
  if (!props.name) {
    return <></>;
  }
  return (
    <Icon
      size={props.size || 28}
      testID={props.testID}
      {...props}
      style={[
        props.style,
        {
          color: props.color || constants.defaultColors.dark500,
        },
      ]}
    />
  );
};

export default VIGIcon;
