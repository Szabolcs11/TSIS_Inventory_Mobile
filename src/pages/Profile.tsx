import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {loginCompleted, refreshUser, storage} from '../navigation';
import {LangagueProps, UserType} from '../types';
import {
  bottomContainer,
  inputStyle,
  palette,
  primaryBtnStyle,
  spacing,
} from '../style';
import {apiurl, DEFAULT_LANGUAGE} from '../constants';
import axios from 'axios';
import translation from './../translations/Settings.json';
import {handleLogout} from './../navigation/';
import {showToast} from '../navigation/toaster';
import globaltranslation from './../translations/Global.json';
import {launchImageLibrary} from 'react-native-image-picker';
import {homeLanguagueChanges} from './Home';
import {itemListLanguagueChanges} from './ItemList';
import {addItemLanguagueChanges} from './AddItem';
import {userListLanguagueChanges} from './UserList';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export let profileLanguagueChanges: (lang: LangagueProps) => void;

export default function Profile(props: any) {
  const [user, setUser] = useState<UserType | null>(GetUserFromStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [userRank, setUserRank] = useState<string>('');
  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );

  const [currentAvatar, setCurrentAvatar] = useState<string>(user?.AvatarURL!);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .post(apiurl + 'getuserrank', {
        myid: user?.id,
      })
      .then(res => {
        if (res.data.success) {
          setUserRank(res.data.rank);
        } else {
          setUserRank('');
        }
      });
  }, []);

  profileLanguagueChanges = (lang: LangagueProps) => {
    setLanguague(lang);
  };

  const handleSavePassword = () => {
    axios
      .post(apiurl + 'changepassword', {
        id: user?.id,
        oldpassword: currentPassword,
        newpassword: newPassword,
        newpasswordagain: confirmPassword,
      })
      .then(res => {
        console.log(res.data);
        if (res.data.success) {
          showToast(
            'success',
            globaltranslation.Success[languague],
            res.data.message,
          );
          setIsEditing(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          showToast(
            'error',
            globaltranslation.Error[languague],
            res.data.message,
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleUploadAvatar = async () => {
    console.log('upload avatar');
    setIsLoading(true);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 1000,
      maxWidth: 1000,
    });
    if (!result.didCancel) {
      if (!result.errorCode) {
        if (!result.errorMessage) {
          const data = new FormData();
          data.append('file', {
            uri: result.assets![0].uri,
            name: result.assets![0].fileName,
            type: 'image/jpg',
          });
          data.append('userid', user?.id);
          data.append('lang', languague);
          axios
            .post(apiurl + 'upploadimage', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(res => {
              console.log(res.data);
              if (res.data.success) {
                showToast(
                  'success',
                  globaltranslation.Success[languague],
                  res.data.message,
                );
                setIsEditing(false);
                setCurrentAvatar(res.data.imgname);
                let tempuser = user;
                tempuser!.AvatarURL = res.data.imgname;
                refreshUser(tempuser!);
                setIsLoading(false);
              } else {
                showToast(
                  'error',
                  globaltranslation.Error[languague],
                  res.data.message,
                );
                setIsLoading(false);
              }
            })
            .catch(err => {
              showToast(
                'error',
                globaltranslation.Error[languague],
                globaltranslation.ErrorDuringUpploadingImage[languague],
              );
              console.log(err);
              console.log(err.response);
              console.log(err.data);
              console.log(err.message);
              setIsLoading(false);
            });
        } else {
          console.log(result.errorMessage);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (lang: LangagueProps) => {
    let start = Date.now();
    console.log('start', start);
    setLanguague(lang);
    storage.set('lang', lang);
    await changeEveryLanguague(lang);
    console.log('end', Date.now());
    console.log('elapsed time', Date.now() - start);
  };

  const changeEveryLanguague = (lang: LangagueProps) => {
    if (homeLanguagueChanges) {
      homeLanguagueChanges(lang);
    }
    if (itemListLanguagueChanges) {
      itemListLanguagueChanges(lang);
    }
    if (addItemLanguagueChanges) {
      addItemLanguagueChanges(lang);
    }
    if (userListLanguagueChanges) {
      userListLanguagueChanges(lang);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{alignItems: 'center', width: '100%'}}>
      <View
        style={{
          width: '100%',
          marginVertical: spacing.quadruple,
          paddingHorizontal: spacing.double,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isEditing ? (
          <TouchableOpacity
            onPress={() => handleUploadAvatar()}
            style={{width: 200, height: 200}}>
            <Image
              source={{uri: apiurl + 'UsersAvatar/' + currentAvatar}}
              style={{width: '100%', height: '100%', borderRadius: 100}}
            />
          </TouchableOpacity>
        ) : (
          <View style={{width: 200, height: 200}}>
            <Image
              source={{uri: apiurl + 'UsersAvatar/' + currentAvatar}}
              style={{width: '100%', height: '100%', borderRadius: 100}}
            />
          </View>
        )}
        <View
          style={{marginVertical: spacing.single, marginTop: spacing.double}}>
          <Text
            style={{fontSize: 22, fontWeight: 'bold', color: palette.primary}}>
            {user?.FullName}
          </Text>
        </View>
        <View style={{marginBottom: spacing.single}}>
          <Text
            style={{fontSize: 20, color: palette.primary, fontWeight: '500'}}>
            {userRank || 'No Rank'}
          </Text>
        </View>
        <View>
          <Text style={{fontSize: 18, color: palette.primary}}>
            {user?.Email || 'No Email'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: spacing.single,
            marginVertical: spacing.double,
          }}>
          {isLoading ? (
            <View>
              <ActivityIndicator size={32} color={Colors.primary} />
            </View>
          ) : (
            <>
              <TouchableOpacity onPress={() => changeLanguage('rs')}>
                <Image source={require('./../assets/images/flag_rs.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeLanguage('en')}>
                <Image source={require('./../assets/images/flag_en.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeLanguage('hu')}>
                <Image source={require('./../assets/images/flag_hu.png')} />
              </TouchableOpacity>
            </>
          )}
        </View>
        {isEditing ? (
          <View style={{width: '80%'}}>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={[
                primaryBtnStyle,
                {marginVertical: 0, marginTop: spacing.double},
              ]}>
              <Text style={{color: palette.white, fontWeight: '500'}}>
                {translation.Cancel[languague]}
              </Text>
            </TouchableOpacity>
            <View style={{marginVertical: spacing.double}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  color: palette.primary,
                  fontWeight: '500',
                  marginBottom: spacing.single,
                }}>
                {translation.PasswordChange[languague]}
              </Text>
              <View style={{width: '100%'}}>
                <TextInput
                  value={currentPassword}
                  secureTextEntry={true}
                  placeholder={translation.CurrentPassword[languague]}
                  onChangeText={text => setCurrentPassword(text)}
                  style={[inputStyle, {marginVertical: spacing.single}]}
                />
              </View>
              <View style={{width: '100%'}}>
                <TextInput
                  value={newPassword}
                  secureTextEntry={true}
                  placeholder={translation.NewPassword[languague]}
                  onChangeText={text => setNewPassword(text)}
                  style={[inputStyle, {marginVertical: spacing.single}]}
                />
              </View>
              <View style={{width: '100%'}}>
                <TextInput
                  value={confirmPassword}
                  secureTextEntry={true}
                  placeholder={translation.NewPasswordAgain[languague]}
                  onChangeText={text => setConfirmPassword(text)}
                  style={[inputStyle, {marginVertical: spacing.single}]}
                />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => handleSavePassword()}
                  style={[primaryBtnStyle, {marginVertical: spacing.single}]}>
                  <Text style={{color: palette.white, fontWeight: '500'}}>
                    {translation.SavePassword[languague]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              gap: spacing.double,
              // width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={[
                primaryBtnStyle,
                {marginVertical: 0, marginTop: spacing.double},
              ]}>
              <Text style={{color: palette.white, fontWeight: '500'}}>
                {translation.Edit[languague]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLogout()}
              style={[primaryBtnStyle, {marginVertical: 0}]}>
              <Text style={{color: palette.white, fontWeight: '500'}}>
                {translation.Logout[languague]}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
