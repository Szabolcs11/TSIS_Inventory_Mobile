import {
  TextStyle,
  ViewStyle,
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const spacing = {
  single: 8,
  double: 16,
  triple: 24,
  quadruple: 32,
};

export const palette = {
  primary: '#3AB4F2',
  paleprimary: '#69C7F6',
  black: '#000000',
  white: '#ffffff',
  red: '#FF0000',
  gray: '#666666',
};

export const fontSize = {
  small: 12,
  medium: 16,
  mmedium: 20,
  large: 24,
  xlarge: 32,
};

export const flexcenter: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
};

export const aligncenter: ViewStyle = {
  alignItems: 'center',
  height: '100%',
  // backgroundColor: 'red',
};

export const inputContainer: ViewStyle = {
  width: '100%',
  padding: spacing.quadruple,
  // backgroundColor: 'yellow',
};

export const inputStyle: ViewStyle = {
  borderRadius: spacing.single,
  borderColor: palette.gray,
  borderWidth: 1,
  width: '100%',
  padding: spacing.single,
  marginVertical: spacing.double,
};

export const primaryBtnStyle: ViewStyle = {
  borderRadius: spacing.single,
  backgroundColor: palette.primary,
  padding: spacing.double,
  marginVertical: spacing.triple,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

export const whiteLabel: TextStyle = {
  color: palette.white,
  fontSize: fontSize.mmedium,
};

export const bottomContainer: ViewStyle = {
  position: 'absolute',
  bottom: spacing.triple,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  gap: spacing.single,
};

// Home \\

export const WelcomeTitle: TextStyle = {
  fontSize: fontSize.large,
  fontWeight: 'bold',
  color: palette.primary,
  marginVertical: spacing.triple,
  flexWrap: 'wrap',
  width: '50%', // This need to be changed cause of the smaller screens
  textAlign: 'center',
};

export const WelcomeSubTitle: TextStyle = {
  fontSize: fontSize.mmedium,
  fontWeight: 'bold',
  color: palette.primary,
  textAlign: 'center',
  marginVertical: spacing.double,
};

export const ScanQrCodeButton: ViewStyle = {
  backgroundColor: palette.primary,
  // width: width * 0.4,
  // height: height * 0.2,
  width: 150,
  height: 150,
  borderRadius: spacing.triple,
  alignItems: 'center',
  justifyContent: 'center',
};

export const ScanQrCodeStyle: ViewStyle = {
  backgroundColor: palette.black,
  width: width * 0.8,
  height: height * 0.4,
};

export const ModalContainer: ViewStyle = {
  height: '100%',
  width: '100%',
  backgroundColor: palette.white,
  marginTop: height * 0.15,
  borderTopLeftRadius: spacing.triple,
  borderTopRightRadius: spacing.triple,
  padding: spacing.double,
};

export const ModalHeader: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  borderBottomColor: palette.primary,
  borderBottomWidth: 2,
  paddingBottom: spacing.double,
};

export const ModalCloseIcon: ViewStyle = {
  position: 'absolute',
  left: 0,
  height: '100%',
  justifyContent: 'center',
};

export const ModalTitle: TextStyle = {
  textAlign: 'center',
  fontSize: fontSize.large,
  color: palette.primary,
  fontWeight: '800',
  textTransform: 'uppercase',
};

export const ItemContainer: ViewStyle = {
  width: '100%',
  // height: '100%',
  height: height * 0.7,
  paddingVertical: spacing.double,
};

export const ItemContainerText: TextStyle = {
  fontSize: fontSize.mmedium,
  fontWeight: 'bold',
  color: palette.primary,
  // textTransform: 'uppercase',
};

export const DeleteBtnContainer: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  marginVertical: spacing.double,
  marginTop: spacing.quadruple * 4,
  position: 'absolute',
  bottom: 0,
};

export const DeleteBtn: ViewStyle = {
  backgroundColor: palette.red,
  paddingVertical: spacing.single,
  paddingHorizontal: spacing.double,
  borderRadius: spacing.single,
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
  margin: spacing.double,
};

export const DeleteBtnText: TextStyle = {
  color: palette.white,
  fontSize: fontSize.mmedium,
  fontWeight: 'bold',
};

export const ScreenView: ViewStyle = {
  width: '100%',
  height: '100%',
  alignItems: 'center',
  backgroundColor: palette.white,
  padding: spacing.quadruple,
};

export const DatePickerStyle: ViewStyle = {
  borderRadius: spacing.single,
  borderColor: palette.black,
  borderWidth: 1,
  width: '100%',
  padding: spacing.single,
  marginVertical: spacing.double,
};
