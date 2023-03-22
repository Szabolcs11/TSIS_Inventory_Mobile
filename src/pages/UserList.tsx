import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  aligncenter,
  fontSize,
  inputContainer,
  inputStyle,
  palette,
  spacing,
} from '../style';
import {LangagueProps, ModifiedUserType, UserType} from '../types';
import {apiurl, DEFAULT_LANGUAGE} from '../constants';
import {storage} from '../navigation';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import translation from './../translations/UserList.json';
import axios from 'axios';
import {navigate, navigationRef} from '../navigation/settings';
import User from '../components/User';
import {showToast} from '../navigation/toaster';
import globalTranslation from './../translations/Global.json';
import {useIsFocused} from '@react-navigation/native';

export let userListLanguagueChanges: (lang: LangagueProps) => void;

export default function UserList() {
  console.log('UserList time', Date.now());
  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );

  const [searchedText, setSearchedText] = useState<string>('');

  const [user, setUser] = useState<UserType | null>(GetUserFromStorage());
  const [users, setUsers] = useState<ModifiedUserType[]>([]);
  const [ranks, setRanks] = useState<string[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchUsers();
    }
  }, [isFocused]);

  const fetchUsers = () => {
    axios
      .post(apiurl + 'getusers', {
        MyId: user?.id,
      })
      .then(res => {
        setUsers(res.data.users);
        setRanks(res.data.ranks);
      })
      .catch(err => {
        console.log(err);
      });
  };

  userListLanguagueChanges = (lang: LangagueProps) => {
    setLanguague(lang);
  };

  const handleDeleteUser = (id: number) => {
    axios
      .post(apiurl + 'handledeleteuser', {
        targetid: id,
        myid: user?.id,
      })
      .then(res => {
        if (res.data.success) {
          showToast(
            'success',
            globalTranslation.Success[languague],
            res.data.message,
          );
          navigationRef.current?.goBack();
          fetchUsers();
        } else {
          showToast(
            'error',
            globalTranslation.Error[languague],
            res.data.message,
          );
        }
      })
      .catch(err => {
        showToast(
          'error',
          globalTranslation.Error[languague],
          err?.data?.message,
        );
      });
  };

  return (
    <View style={aligncenter}>
      <View style={{width: '100%'}}>
        <View style={inputContainer}>
          <View>
            <View style={{position: 'relative'}}>
              <Icon
                size={fontSize.xlarge}
                style={{position: 'absolute', top: 22, right: 10}}
                type={IconType.Ionicons}
                name="ios-search-outline"
              />
              <TextInput
                onChangeText={e => setSearchedText(e)}
                placeholder={translation.Search[languague]}
                style={inputStyle}
              />
            </View>
          </View>
        </View>
        <View style={{paddingHorizontal: spacing.quadruple, width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: spacing.single,
            }}>
            <View>
              <Text
                style={{
                  color: palette.primary,
                  fontSize: fontSize.medium,
                  fontWeight: '500',
                }}>
                id
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: palette.primary,
                  fontSize: fontSize.medium,
                  fontWeight: '500',
                }}>
                {translation.TableFullName[languague]}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: palette.primary,
                  fontSize: fontSize.medium,
                  fontWeight: '500',
                }}>
                {translation.TableRank[languague]}
              </Text>
            </View>
          </View>
          <ScrollView
            style={{height: '62%'}}
            showsVerticalScrollIndicator={false}>
            {users
              .filter(e => e.FullName.includes(searchedText))
              .map((e, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigate('Modal', {
                        title: e.FullName,
                        content: () => (
                          <User
                            callback={(id: number) => handleDeleteUser(id)}
                            userdata={e}
                          />
                        ),
                      });
                    }}
                    style={{
                      borderTopLeftRadius: i === 0 ? spacing.double : 0,
                      borderTopRightRadius: i === 0 ? spacing.double : 0,
                      borderBottomLeftRadius:
                        i ===
                        users.filter(e => e.FullName.includes(searchedText))
                          .length -
                          1
                          ? spacing.double
                          : 0,
                      borderBottomRightRadius:
                        i ===
                        users.filter(e => e.FullName.includes(searchedText))
                          .length -
                          1
                          ? spacing.double
                          : 0,
                      paddingHorizontal: spacing.single,
                      paddingVertical: spacing.double,
                      flexDirection: 'row',
                      width: '100%',
                      backgroundColor: Even(i)
                        ? palette.primary
                        : palette.paleprimary,
                    }}
                    key={e.id}>
                    <Text style={{width: '10%', textAlign: 'center'}}>
                      {e.id}
                    </Text>
                    <Text style={{width: '60%', textAlign: 'center'}}>
                      {e.FullName}
                    </Text>
                    <Text style={{width: '30%', textAlign: 'center'}}>
                      {e.Rank}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            <View>
              {users.filter(e => e.FullName.includes(searchedText)).length ==
              0 ? (
                <View
                  style={{
                    borderTopLeftRadius: spacing.double,
                    borderTopRightRadius: spacing.double,
                    borderBottomLeftRadius: spacing.double,
                    borderBottomRightRadius: spacing.double,
                    paddingHorizontal: spacing.single,
                    paddingVertical: spacing.double,
                    flexDirection: 'row',
                    width: '100%',
                    backgroundColor: palette.primary,
                  }}>
                  <Text style={{width: '100%', textAlign: 'center'}}>
                    {translation.NoResults[languague]}
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

function Even(number: number) {
  return number % 2 === 0;
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
