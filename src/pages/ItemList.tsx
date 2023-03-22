import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';
import React from 'react';
import {
  aligncenter,
  flexcenter,
  fontSize,
  inputContainer,
  inputStyle,
  palette,
  ScreenView,
  spacing,
} from '../style';
import {useEffect, useState} from 'react';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import {
  ClassroomType,
  ItemType,
  LangagueProps,
  TabNavigatorParamsList,
  UserType,
} from '../types';
import axios from 'axios';
import {apiurl, DEFAULT_LANGUAGE} from '../constants';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import translation from './../translations/FullList.json';
import globalTranslation from './../translations/Global.json';
import {storage} from '../navigation';
import {navigate} from '../navigation/settings';
import Item from './Item';
import {useIsFocused} from '@react-navigation/native';

export let refetchItems: () => void;
export let itemListLanguagueChanges: (lang: LangagueProps) => void;

type ItemProps = {
  route: BottomTabNavigationProp<TabNavigatorParamsList, 'ItemList'>;
};

export default function ItemList(props: ItemProps) {
  console.log('ItemList time', Date.now());
  const [items, setItems] = useState<ItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchedText, setSearchedText] = useState<string>('');
  const [user, setUser] = useState<UserType | null>(GetUserFromStorage());
  // console.log('ItemList');
  // console.log(user);
  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );

  const isFocused = useIsFocused();

  // const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  // const [dropdownOpen, setDropDownOpen] = useState<boolean>(false);
  // const [dropDownValue, setDropDownValue] = useState<boolean>(null);

  useEffect(() => {
    if (isFocused) {
      console.log('refetch');
      refetchItems();
    }
  }, [isFocused]);

  refetchItems = () => {
    axios
      .post(apiurl + 'getitems', {
        MyId: user?.id,
      })
      .then(res => {
        setIsLoading(false);
        setItems(res.data.items);
        // setClassrooms(res.data.classrooms);
      })
      .catch(err => {
        console.log(err);
      });
  };

  itemListLanguagueChanges = (lang: LangagueProps) => {
    setLanguague(lang);
  };

  if (isLoading) {
    return (
      <View>
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
                placeholder={translation.SearchTitle[languague]}
                style={inputStyle}
              />
            </View>
          </View>
          <View>
            <View style={{position: 'relative'}}>
              {/* <Icon
                name="arrow-back-ios"
                type="MaterialIcons"
                size={fontSize.large}
                style={{
                  position: 'absolute',
                  top: 22,
                  right: 12,
                  transform: [{rotate: '-90deg'}],
                }}
              />
              <TextInput
                placeholder={globalTranslation.Loading[languague]}
                style={inputStyle}
              /> */}
            </View>
          </View>
        </View>
        <ActivityIndicator color={palette.primary} size={'large'} />
      </View>
    );
  }

  //   <View style={{marginTop: 300}}>
  //   <DropDownPicker
  //     zIndex={1000}
  //     scrollViewProps={{nestedScrollEnabled: true}}
  //     open={open}
  //     value={value}
  //     items={items}
  //     setOpen={setOpen}
  //     setValue={setValue}
  //     setItems={setItems}
  //   />
  // </View>

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
                placeholder={translation.SearchTitle[languague]}
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
                {translation.NameLabel[languague]}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: palette.primary,
                  fontSize: fontSize.medium,
                  fontWeight: '500',
                }}>
                {translation.ClassroomTitle[languague]}
              </Text>
            </View>
          </View>
          <ScrollView
            style={{height: '62%'}}
            showsVerticalScrollIndicator={false}>
            <View style={{}}>
              {items
                .filter(e => e.Name.includes(searchedText))
                .map((e, i) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigate('Modal', {
                          title: e.Name,
                          content: () => <Item itemdata={e} />,
                        });
                      }}
                      style={{
                        borderTopLeftRadius: i === 0 ? spacing.double : 0,
                        borderTopRightRadius: i === 0 ? spacing.double : 0,
                        borderBottomLeftRadius:
                          i ===
                          items.filter(e => e.Name.includes(searchedText))
                            .length -
                            1
                            ? spacing.double
                            : 0,
                        borderBottomRightRadius:
                          i ===
                          items.filter(e => e.Name.includes(searchedText))
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
                        {e.Name}
                      </Text>
                      <Text style={{width: '30%', textAlign: 'center'}}>
                        {e.Classroom}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
            <View>
              {items.filter(e => e.Name.includes(searchedText)).length == 0 ? (
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
                    {translation.NoResultsFound[languague]}
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
