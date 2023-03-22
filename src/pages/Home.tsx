import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-dynamic-vector-icons';
// import {Camera, useCameraDevices} from 'react-native-vision-camera';
// import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {navigate} from '../navigation/settings';
import {
  aligncenter,
  bottomContainer,
  flexcenter,
  fontSize,
  palette,
  ScanQrCodeButton,
  ScanQrCodeStyle,
  spacing,
  WelcomeSubTitle,
  WelcomeTitle,
} from '../style';
import Item from './Item';
import {apiurl, DEFAULT_LANGUAGE} from '../constants';
import ItemList, {itemListLanguagueChanges} from './ItemList';
import axios, {Axios} from 'axios';
import {
  ItemType,
  LangagueProps,
  StackNavigatorParamsList,
  TabNavigatorParamsList,
  UserType,
} from '../types';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {storage} from '../navigation';
import QRCodeScanner from 'react-native-qrcode-scanner';
import QrCodeLogo from '../assets/svgs/QrCodeLogo';
import translation from './../translations/Home.json';
import {addItemLanguagueChanges} from './AddItem';
import {userListLanguagueChanges} from './UserList';
import {profileLanguagueChanges} from './Profile';

// import qrcodeicon from "./../assets/svgs/QRCode.svg"

// const Modal = ({route,navigation,}: StackScreenProps<StackNavigatorParamsList, 'Modal'>) => {

// export default function Home({route, navigation}: BottomTabNavigationProp<TabNavigatorParamsList, "Home">) = {

// export default function Home(
//   props: BottomTabNavigationProp<TabNavigatorParamsList, 'Home'>,
// ) {

type HomeProps = {
  route: BottomTabNavigationProp<TabNavigatorParamsList, 'Home'>;
};

// Something here need to be changed Params List

// export default function Home(props: HomeProps) {

export let homeLanguagueChanges: (lang: LangagueProps) => void;

export default function Home({
  navigation,
  route,
}: StackScreenProps<TabNavigatorParamsList, 'Home'>) {
  console.log('Home time', Date.now());
  const [user, setUser] = useState<UserType | null>(GetUserFromStorage());
  // console.log('Home');
  // console.log(user);
  const [cameraPermission, setCameraPermission] = useState(false);
  // const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
  //   checkInverted: true,
  // });
  const [scanning, setScanning] = useState<boolean>(false);
  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );
  const changeLanguage = (lang: LangagueProps) => {
    // console.log('asdasdasdasdd');
    setLanguague(lang);
    storage.set('lang', lang);
    if (itemListLanguagueChanges) {
      itemListLanguagueChanges(lang);
    }
    if (addItemLanguagueChanges) {
      addItemLanguagueChanges(lang);
    }
    if (userListLanguagueChanges) {
      userListLanguagueChanges(lang);
    }
    if (profileLanguagueChanges) {
      profileLanguagueChanges(lang);
    }
  };

  // useEffect(() => {
  //   axios
  //     .get('http://node1.koki10.site:5043/test')
  //     .then(res => {
  //       console.log('res');
  //       console.log(res);
  //       console.log(res.data);
  //     })
  //     .catch(err => {
  //       console.log('err');
  //       console.log(err);
  //     });
  // });

  useEffect(() => {
    // const getpermstatus = async () => {
    //   const cameraPerm = await Camera.getCameraPermissionStatus();
    //   // console.log('Camera', cameraPerm);
    //   if (cameraPerm != 'authorized') {
    //     const newPermission = await Camera.requestCameraPermission();
    //     console.log('NewPerm', newPermission);
    //     if (newPermission == 'authorized') {
    //       setCameraPermission(true);
    //     } else {
    //       setCameraPermission(false);
    //     }
    //   } else {
    //     setCameraPermission(true);
    //   }
    // };
    // getpermstatus();
  }, []);
  // const camera = useRef();
  const camera = useRef<any>();
  // const devices = useCameraDevices();
  // const device = devices.back;

  // useEffect(() => {
  // if (barcodes.length != 0) {
  //   if (scanning) {
  //     setScanning(false);
  //     // console.log('scanning');
  //     // console.log(barcodes[0].displayValue);
  //     let stringbarcoes = barcodes[0].displayValue;
  //     let itemString = stringbarcoes?.split('/');
  //     let id = Number(itemString![4]);
  //     if (id) {
  //       axios.get(apiurl + 'item/' + id).then(res => {
  //         if (res.data.success) {
  //           let itemdata: ItemType = res.data.itemdata as ItemType;
  //           navigate('Modal', {
  //             title: itemdata.Name,
  //             content: () => <Item itemdata={itemdata} />,
  //           });
  //         } else {
  //           navigate('Modal', {
  //             title: 'No item found',
  //             content: () => <Item itemdata={null} />,
  //           });
  //         }
  //       });
  //     } else {
  //       navigate('Modal', {
  //         title: 'Hiba',
  //         content: () => (
  //           // Here need some design
  //           <View>
  //             <Text>Error</Text>
  //           </View>
  //         ),
  //       });
  //     }
  //     // if (id) {
  //     //   console.log(id);
  //     //   navigate('Modal', {
  //     //     title: 'Item',
  //     //     content: () => <Item itemID={id} />,
  //     //   });
  //     // }

  //     // stop the camera
  //     // camera.current.stop();
  //     // Linking.openURL(barcodes[0].displayValue as string);
  //   }
  // }
  // }, [barcodes]);

  // if (device == null) {
  //   return (
  //     <View>
  //       <Text>No back camera found</Text>
  //     </View>
  //   );
  // }
  // if (cameraPermission == false) {
  //   return (
  //     <View>
  //       <Text>No permission</Text>
  //     </View>
  //   );
  // }

  homeLanguagueChanges = (lang: LangagueProps) => {
    setLanguague(lang);
  };

  const readQrCode = (e: any) => {
    console.log('QR Code');
    console.log(e.data);
    let stringbarcoes = e.data;
    let itemString = stringbarcoes?.split('/');
    let id = Number(itemString![4]);
    console.log(id);
    if (id) {
      axios.get(apiurl + 'item/' + id).then(res => {
        if (res.data.success) {
          let itemdata: ItemType = res.data.itemdata as ItemType;
          navigate('Modal', {
            title: itemdata.Name,
            content: () => <Item itemdata={itemdata} />,
          });
        } else {
          navigate('Modal', {
            title: 'No item found',
            content: () => <Item itemdata={null} />,
          });
        }
      });
    } else {
      navigate('Modal', {
        title: 'Hiba',
        content: () => (
          // Here need some design
          <View>
            <Text>Error</Text>
          </View>
        ),
      });
    }
    setScanning(false);
  };

  return (
    <ScrollView contentContainerStyle={aligncenter}>
      <View style={flexcenter}>
        <Text style={WelcomeTitle}>
          {translation.Welcome[languague]} {user?.FullName}
        </Text>
        <View>
          <Text style={WelcomeSubTitle}>
            {translation.ScanQRCode[languague]}
          </Text>

          {scanning ? (
            <View style={ScanQrCodeStyle}>
              <QRCodeScanner
                cameraStyle={{width: '100%', height: '90%'}}
                onRead={e => {
                  readQrCode(e);
                }}
              />
              <TouchableOpacity
                style={{
                  padding: spacing.double,
                  backgroundColor: palette.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setScanning(false)}>
                <Text style={{color: palette.white}}>Cancel</Text>
              </TouchableOpacity>
              {/* <Camera
                style={{width: '100%', height: '100%'}}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                frameProcessorFps={10}
                ref={camera}
              /> */}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setScanning(true);
                // navigate('Modal', {
                //   title: 'Stolica',
                //   content: () => <Item itemID={3} />,
                // });
              }}
              style={ScanQrCodeButton}>
              <QrCodeLogo />
            </TouchableOpacity>
          )}
        </View>
        <View style={[bottomContainer, {display: 'flex'}]}>
          <TouchableOpacity onPress={() => changeLanguage('rs')}>
            <Image source={require('./../assets/images/flag_rs.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage('en')}>
            <Image source={require('./../assets/images/flag_en.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage('hu')}>
            <Image source={require('./../assets/images/flag_hu.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function GetUserFromStorage() {
  let userstroagefromstorage = storage.getString('user');
  if (userstroagefromstorage) {
    let user = JSON.parse(userstroagefromstorage) as UserType;
    return user;
  } else {
    return null;
  }
}
