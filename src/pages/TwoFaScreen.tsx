import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {LangagueProps} from '../types';
import {apiurl, DEFAULT_LANGUAGE} from '../constants';
import {loginCompleted, storage} from '../navigation';
import {
  aligncenter,
  bottomContainer,
  flexcenter,
  fontSize,
  inputContainer,
  inputStyle,
  palette,
  primaryBtnStyle,
  whiteLabel,
} from '../style';
import Icon from 'react-native-dynamic-vector-icons';
import translation from './../translations/Auth.json';
import axios from 'axios';
import {showToast} from '../navigation/toaster';
import globaltranslation from './../translations/Global.json';

type TwoFaScreenProps = {
  Token: string;
};

export default function TwoFaScreen(props: TwoFaScreenProps) {
  console.log(props.Token);

  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const changeLanguage = (lang: LangagueProps) => {
    setLanguague(lang);
    storage.set('lang', lang);
  };

  const handleAuthenticate = () => {
    axios
      .post(apiurl + 'verifytwofa', {
        token: props.Token,
        code: code,
        lang: languague,
      })
      .then(res => {
        if (res.data.success) {
          showToast(
            'success',
            globaltranslation.Success[languague],
            res.data.message,
          );
          loginCompleted(res.data.user);
        } else {
          showToast(
            'error',
            globaltranslation.Error[languague],
            res.data.message,
          );
        }
      });
  };

  return (
    <ScrollView contentContainerStyle={aligncenter}>
      <View style={flexcenter}>
        <Image source={require('./../assets/images/googleauth.png')} />
        <View style={{padding: 16}}>
          <Text
            style={{textAlign: 'center', fontSize: 24, color: palette.gray}}>
            {translation.TwoLabel[languague]}
          </Text>
        </View>
        <View style={inputContainer}>
          <View>
            <Icon
              style={{position: 'absolute', top: 26, right: 15}}
              name="lock"
              type="FontAwesome"
              size={fontSize.large}
            />
            <TextInput
              onPressOut={() => {
                setIsKeyboardVisible(true);
              }}
              onBlur={() => {
                setIsKeyboardVisible(false);
              }}
              placeholder={translation.Code[languague]}
              style={inputStyle}
              onChangeText={e => setCode(e)}
            />
          </View>
          <TouchableOpacity
            onPress={() => handleAuthenticate()}
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
