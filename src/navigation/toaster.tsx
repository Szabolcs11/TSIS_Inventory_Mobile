import {Toast} from 'react-native-toast-message/lib/src/Toast';

type ToastType = 'success' | 'error' | 'info';
type ToastProps = {
  type: ToastType;
  title: string;
  subtitle: string;
};

// export const showToast = (props: ToastProps) => {
export const showToast = (type: ToastType, title: string, subtitle: string) => {
  Toast.show({
    type: type,
    text1: title,
    text2: subtitle,
  });
};

// export const showToast = (type: title, subtitle) => {
//   Toast.show({
//     type: type,
//     text1: title,
//     text2: subtitle,
//   });
// };
