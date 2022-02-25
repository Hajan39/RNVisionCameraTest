import {StyleSheet} from 'react-native';
import constants from './layout';

export const globalStyles = StyleSheet.create({
  'LANDSCAPE-LEFT': {transform: [{rotate: '90deg'}]},
  'LANDSCAPE-RIGHT': {transform: [{rotate: '270deg'}]},
  PORTRAIT: {},
  'PORTRAIT-UPSIDEDOWN': {transform: [{rotate: '180deg'}]},
  UNKNOWN: {},
  'FACE-UP': {},
  'FACE-DOWN': {transform: [{rotate: '180deg'}]},
  header: {
    backgroundColor: constants.defaultColors.green500,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 18,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerText: {
    alignSelf: 'flex-start',
  },
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  toast: {
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#000000',
  },
  center: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export const globalSettingsStyles = StyleSheet.create({
  blockTitle: {
    alignSelf: 'flex-start',
    paddingBottom: 10,
  },
  listItem: {
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    marginBottom: 10,
    backgroundColor: constants.defaultColors.light,
    paddingLeft: 16,
    paddingRight: 16,
    marginLeft: 0,
  },
  actionButton: {
    textTransform: 'uppercase',
  },
  sectionTitle: {alignSelf: 'flex-start'},
  sectionValue: {
    alignSelf: 'flex-start',
  },
  separator: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: constants.defaultColors.dark150,
    alignSelf: 'stretch',
    paddingBottom: 5,
    marginBottom: 10,
  },
  twoColBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
});
