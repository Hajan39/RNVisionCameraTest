/* eslint-disable no-useless-escape */
// TODO https://support.trask.cz/browse/GEMSEEM-180
import {Dimensions} from 'react-native';

const constants = {
  window: Dimensions.get('window'),
  defaultColors: {
    green700: '#00662F',
    green500: '#00843D',
    green400: '#9CDAA9',
    green300: '#D4EFD9',
    green200: '#EAF7ED',
    dark500: '#000000',
    dark400: '#424242',
    dark300: '#6B6B6B',
    dark200: '#C3C3C3',
    dark150: '#ECECEC',
    dark100: '#F6F7F8',
    light: '#FFFFFF',
    orange: '#F68D2E',
    orangeLight: '#FEEDDE',
    redWCAG: '#BA2C2C',
    red: '#D85A5A',
    redLight: '#FBEEEE',
    blue: '#4EC3E0',
    blueLight: '#EAF8FB',
    lightGreen: '#17A95B',

    greenTransparent: '#00843DB3',
    darkGrayTransparent: 'rgba(107,107,107,0.64)',
    lightGrayTwo: '#F1F1F1',
    orangeWCAG: '#D26909',
    blackTransparent: 'rgba(0,0,0,0.2)',
    whiteTransparent: 'rgba(255,255,255,0.6)',
    pinBlue: '#4C5BE1',
    pinRed: '#E1584C',
    backgroundColor: '#f8f9fa',
  },
  fonts: {
    arial: 'Arial',
    regular: 'koop_pro_regular-webfont',
    bold: 'koop_pro_bold-webfont',
    light: 'koop_pro_light-webfont',
    medium: 'koop_pro_medium-webfont',
  },
  regExps: {
    onlyTextAndNumbers: new RegExp(/^[a-zA-Z0-9]*$/),
    addressRegex: new RegExp(/^[ěščřžýáíéóúůďťňĎŇŤŠČŘŽÝÁÍÉÚŮa-zA-Z0-9,\s.-\/]*$/),
    filenameWithExtension: RegExp('([0-9]+).[a-zA-Z]{3,4}$'), //asdf456tzu123.jpg -> 123
    filenameWithoutExtension: RegExp('([0-9]+)$'), //asdf456tzu123.jpg -> 123
    imagePath: /^.*[\\\/]/,
  },
};

export default constants;
