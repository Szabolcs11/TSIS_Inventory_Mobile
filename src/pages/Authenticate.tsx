import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import {apiurl, DEFAULT_LANGUAGE} from '../constants';
import {handleTwoFaScreen, loginCompleted, storage} from '../navigation';
import {showToast} from '../navigation/toaster';
import {
  aligncenter,
  bottomContainer,
  flexcenter,
  fontSize,
  inputContainer,
  inputStyle,
  primaryBtnStyle,
  whiteLabel,
} from '../style';
import {LangagueProps, UserType} from '../types';
import translation from './../translations/Auth.json';
import globaltranslation from './../translations/Global.json';
import axios, {AxiosError} from 'axios';

export default function Authenticate() {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );

  const changeLanguage = (lang: LangagueProps) => {
    setLanguague(lang);
    storage.set('lang', lang);
  };

  // .post(apiurl + 'handleLogin', {
  //   Username: userName,
  //   Password: password,
  //   lang: languague,
  //   isMobile: true,
  // })

  const handleLogin = () => {
    // setIsLoading(true);
    axios
      .post(apiurl + 'handleLogin', {
        Username: userName,
        Password: password,
        lang: languague,
        isMobile: true,
      })
      .then(res => {
        setIsLoading(false);
        if (res.data.success) {
          if (res.data.twofalogintoken) {
            // Handle 2FA
            handleTwoFaScreen(res.data.twofalogintoken);
            console.log('asd');
          } else {
            let user: UserType = res.data.user;
            loginCompleted(user);
            showToast(
              'success',
              globaltranslation.Success[languague],
              res.data.message,
            );
          }
        } else {
          showToast(
            'error',
            globaltranslation.Error[languague],
            res.data.message,
          );
        }
      })
      .catch(function (error: AxiosError) {
        console.log(error);
        // console.log(error.request);
        // console.log(error.request._response);
        showToast('error', 'catcherror', error.request._response);
      });
  };

  return (
    <ScrollView contentContainerStyle={aligncenter}>
      <View style={flexcenter}>
        <Image source={require('./../assets/images/tsis_logo.png')} />
        <View style={inputContainer}>
          <View>
            <Icon
              style={{position: 'absolute', top: 26, right: 10}}
              name="user-circle"
              type={IconType.FontAwesome}
              size={fontSize.large}
            />
            <TextInput
              onPressOut={() => {
                setIsKeyboardVisible(true);
              }}
              onBlur={() => {
                setIsKeyboardVisible(false);
              }}
              placeholder={translation.UsernamePlaceholder[languague]}
              style={inputStyle}
              onChangeText={e => setUserName(e)}
            />
          </View>
          <View>
            <Icon
              style={{position: 'absolute', top: 26, right: 15}}
              name="lock"
              type={IconType.FontAwesome}
              size={fontSize.large}
            />
            <TextInput
              onPressOut={() => {
                setIsKeyboardVisible(true);
              }}
              onBlur={() => {
                setIsKeyboardVisible(false);
              }}
              secureTextEntry={true}
              placeholder={translation.PasswordPlaceholder[languague]}
              style={inputStyle}
              onChangeText={e => setPassword(e)}
            />
          </View>
          <TouchableOpacity
            onPress={() => handleLogin()}
            style={primaryBtnStyle}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color="#FFFFFF" />
            ) : (
              <Text style={whiteLabel}>
                {translation.LoginBtnLabel[languague]}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={[
            bottomContainer,
            {display: !isKeyboardVisible ? 'flex' : 'none'},
          ]}>
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
