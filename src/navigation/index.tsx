import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useState} from 'react';
import {
  LangagueProps,
  StackNavigatorParamsList,
  TabNavigatorParamsList,
  TestUser,
  UserType,
} from '../types';
import Home from '../pages/Home';
import Authenticate from '../pages/Authenticate';
import {apiurl, DEFAULT_LANGUAGE, SCREENS} from '../constants';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import {
  ModalCloseIcon,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  palette,
} from '../style';
import {MMKV} from 'react-native-mmkv';
import Profile from '../pages/Profile';
import axios from 'axios';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {showToast} from './toaster';
import translation from './../translations/Global.json';
import ItemList from '../pages/ItemList';
import Item from '../pages/Item';
import AddItem from '../pages/AddItem';
import UserList from '../pages/UserList';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import {basicScreenPreset, modalOption, navigationRef} from './settings';
import TwoFaScreen from '../pages/TwoFaScreen';
import globaltranslation from './../translations/Global.json';

export const storage = new MMKV();

type handleLoginProp = (user: UserType) => void;

export let loginCompleted: handleLoginProp;

export let refreshUser: (user: UserType) => void;

export let handleTwoFaScreen: (token: string) => void;

export let handleLogout: () => void;

const Tab = createBottomTabNavigator<TabNavigatorParamsList>();
const Stack = createStackNavigator<StackNavigatorParamsList>();

// const Modal = ({
//   route,
//   navigation,
// }: StackScreenProps<StackNavigatorParamsList, 'Modal'>) => {
//   const {title, content} = route.params as StackNavigatorParamsList['Modal'];
//   if (
//     !route ||
//     typeof title !== 'string' ||
//     title === undefined ||
//     title === null ||
//     typeof content !== 'function' ||
//     content === undefined ||
//     content === null
//   ) {
//     return null;
//   }
//   return (
//     <View>
//       <Text>{title}</Text>
//       {content()}
//     </View>
//   );
// };

const Modal = ({
  route,
  navigation,
}: StackScreenProps<StackNavigatorParamsList, 'Modal'>) => {
  const {content, title} = route.params;
  const windowHeight = Dimensions.get('window').height;

  return (
    // <View
    //   style={{
    //     marginTop: windowHeight - (windowHeight - 100),
    //     backgroundColor: 'white',
    //     height: '100%',
    //     borderTopLeftRadius: 30,
    //     borderTopRightRadius: 30,
    //   }}>
    //   <Text>{title}</Text>
    //   <ScrollView>{content()}</ScrollView>
    // </View>

    <View style={ModalContainer}>
      <View style={ModalHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={ModalCloseIcon}>
          <Icon
            name="arrow-back-ios"
            type={IconType.MaterialIcons}
            size={24}
            color={palette.primary}
            style={{transform: [{rotate: '-90deg'}]}}
          />
        </TouchableOpacity>
        <Text style={ModalTitle}>{title}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
        {content()}
      </ScrollView>
    </View>
  );
};

export default function index() {
  const [user, setUser] = useState<UserType | null>(GetUserFromStorage());
  // console.log(user);
  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );

  const [twofaToken, setTwoFaToken] = useState<string>('');

  // const Tab = createBottomTabNavigator();
  // storage.clearAll();
  loginCompleted = user => {
    console.log('user');
    console.log(user);
    storage.set('user', JSON.stringify(user));
    setUser(user);
  }; // Itt kell debug

  handleTwoFaScreen = (token: string) => {
    setTwoFaToken(token);
  };

  handleLogout = () => {
    showToast(
      'success',
      globaltranslation.Success[languague],
      translation.Logout[languague],
    );
    storage.clearAll();
    setUser(null);
  };

  refreshUser = user => {
    storage.set('user', JSON.stringify(user));
    setUser(user);
  };

  const renderTabIcon = (
    route: any,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    let iconName = 'home';
    let type: IconType = IconType.Ionicons;
    switch (route.name) {
      case SCREENS.HOME:
        iconName = focused ? 'home' : 'home-outline';
        break;
      case SCREENS.ITEMLIST:
        iconName = focused ? 'list' : 'list-outline';
        break;
      case SCREENS.ITEM:
        iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
        break;
      case SCREENS.ADDITEM:
        iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
        break;
      case SCREENS.USERLIST:
        iconName = focused ? 'users' : 'users';
        // type = 'Feather';
        type = IconType.Feather;
        break;
      case SCREENS.NEWUSER:
        iconName = focused ? 'person-add' : 'person-add-outline';
        break;
      case SCREENS.PROFILE:
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = focused ? 'home' : 'home-outline';
        break;
    }
    return <Icon name={iconName} type={type} size={size} color={color} />;
  };

  const renderTabNavigation = useCallback(() => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) =>
            renderTabIcon(route, focused, color, size),
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name={'Home'}
          component={Home}
          initialParams={{user: user}}
        />
        <Tab.Screen
          name={'ItemList'}
          component={ItemList}
          initialParams={{user: user}}
        />
        {/* <Tab.Screen name={SCREENS.ADDITEM} component={AddItem} /> */}
        <Tab.Screen
          name={'AddItem'}
          component={AddItem}
          initialParams={{user: user}}
        />
        {/* <Tab.Screen name={SCREENS.USERLIST} component={UserList} /> */}
        <Tab.Screen name={'UserList'} component={UserList} />
        <Tab.Screen
          name={'Profile'}
          component={Profile}
          // initialParams={{user: user}}
        />
      </Tab.Navigator>
    );
  }, []);

  if (!user) {
    return (
      <>
        {twofaToken ? <TwoFaScreen Token={twofaToken} /> : <Authenticate />}
        <Toast />
      </>
    );
  }
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={basicScreenPreset}>
          <Stack.Screen name="TabNavigator" component={renderTabNavigation} />
          {/* <Stack.Screen name="Modal" options={modalOption} component={Modal} /> */}
          <Stack.Screen name="Modal" options={modalOption} component={Modal} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
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

// const Modal = ({
//   route,
//   navigation,
// }: StackScreenProps<StackNavigatorParamsList, 'Modal'>) => {
//   const {content, title} = route.params;
//   const windowHeight = Dimensions.get('window').height;

//   return (
//     <View
//       style={{
//         marginTop: windowHeight - (windowHeight - 100),
//         backgroundColor: 'white',
//         height: '100%',
//       }}>
//       <Text>{title}</Text>
//       <ScrollView>{content()}</ScrollView>
//     </View>
//     // <View
//     //   style={{
//     //     height: '100%',
//     //     width: '100%',
//     //     backgroundColor: '#2A2D2E',
//     //     marginTop: windowHeight - (windowHeight - 100),
//     //     borderTopLeftRadius: 30,
//     //     borderTopRightRadius: 30,
//     //     padding: 15,
//     //     paddingBottom: 120,
//     //   }}>
//     //   <View
//     //     style={{
//     //       flexDirection: 'row',
//     //       justifyContent: 'center',
//     //       // borderBottomColor: "#4E4F4F",
//     //       borderBottomColor: 'black',
//     //       borderBottomWidth: 2,
//     //       paddingBottom: 15,
//     //     }}>
//     //     <TouchableOpacity
//     //       onPress={() => navigation.goBack()}
//     //       style={{
//     //         position: 'absolute',
//     //         left: 0,
//     //         height: '100%',
//     //         justifyContent: 'center',
//     //       }}>
//     //       <Icon
//     //         name="arrow-back-ios"
//     //         type="MaterialIcons"
//     //         size={24}
//     //         color={'white'}
//     //       />
//     //       {/* <Text style={{ fontSize: 24, color: "white", fontWeight: "800" }}>
//     //         {"<"}
//     //       </Text> */}
//     //     </TouchableOpacity>
//     //     <Text
//     //       style={{
//     //         textAlign: 'center',
//     //         fontSize: 24,
//     //         color: 'white',
//     //         fontWeight: '800',
//     //         textTransform: 'uppercase',
//     //       }}>
//     //       {/* {'title'} */}
//     //     </Text>
//     //   </View>
//     //   {/*
//     //   // @ts-ignore */}
//     //   <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
//     //     {/* {'asd'} */}
//     //   </ScrollView>
//     // </View>
//   );
// };
