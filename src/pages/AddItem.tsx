import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {apiurl, DEFAULT_LANGUAGE} from '../constants';
import {LangagueProps, UserType} from '../types';
import {storage} from '../navigation';
import {showToast} from '../navigation/toaster';
import globalTranslation from '../translations/Global.json';
import {fontSize, inputContainer, inputStyle, palette, spacing} from '../style';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import translation from './../translations/NewItem.json';
// import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {refetchItems} from './ItemList';

export let addItemLanguagueChanges: (lang: LangagueProps) => void;

export default function AddItem() {
  console.log('AddItem time', Date.now());
  const [user, setUser] = useState<UserType | null>(GetUserFromStorage());
  const [rooms, setRooms] = useState([]);
  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );
  const [dopen, setDopen] = useState(false);

  const [name, setName] = useState<string>();
  const [identity, setIdentity] = useState<string>();
  const [selectedRoom, setSelectedRoom] = useState();
  const [quantity, setQuantity] = useState<string>();
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState<string>();

  const classroomsRef = React.useRef(null);

  useEffect(() => {
    axios
      .post(apiurl + 'getclassrooms', {
        MyId: user?.id,
        lang: languague,
      })
      .then(res => {
        if (res.data.success) {
          setRooms(res.data.classrooms);
        }
      });
  }, []);

  addItemLanguagueChanges = (lang: LangagueProps) => {
    setLanguague(lang);
  };

  const resetInputs = () => {
    console.log('reset');
    setName('');
    setIdentity('');
    setQuantity('');
    setDescription('');
    setSelectedRoom(undefined);
    setDate(new Date());
    //@ts-ignore
    classroomsRef?.current.reset();
  };

  const handleAddItem = () => {
    console.log(Number(quantity) <= 0 && Number(identity));
    if (Number(quantity) >= 0 && Number(identity)) {
      axios
        .post(apiurl + 'addnewitem', {
          MyId: user?.id,
          Name: name,
          Identifier: identity,
          Quantity: quantity,
          Classroom: selectedRoom,
          Description: description,
          Date: date,
          lang: languague,
        })
        .then(res => {
          if (res.data.success) {
            showToast(
              'success',
              globalTranslation.Success[languague],
              res.data.message,
            );
            resetInputs();
            if (refetchItems) {
              refetchItems();
            }
          } else {
            showToast(
              'error',
              globalTranslation.Error[languague],
              res.data.message,
            );
          }
        });
    } else {
      showToast(
        'error',
        globalTranslation.Error[languague],
        translation.IdentityCanBeOnlyNumber[languague],
      );
    }
  };

  return (
    <View>
      <View style={inputContainer}>
        <View>
          <View style={{position: 'relative'}}>
            <TextInput
              value={name}
              onChangeText={text => setName(text)}
              placeholder={translation.Name[languague]}
              style={inputStyle}
            />
          </View>
        </View>
        <View>
          <View style={{position: 'relative'}}>
            <TextInput
              keyboardType="numeric"
              value={identity}
              onChangeText={text => setIdentity(text)}
              placeholder={translation.Identity[languague]}
              style={inputStyle}
            />
          </View>
        </View>
        <View style={{width: '100%'}}>
          <SelectDropdown
            ref={classroomsRef}
            onSelect={(selectedItem, index) => {
              setSelectedRoom(selectedItem);
            }}
            buttonStyle={inputStyle}
            defaultButtonText={translation.ChoseClassroom[languague]}
            data={rooms.map(e => {
              // @ts-ignore
              return e.Name;
            })}
          />
        </View>
        <View>
          <View style={{position: 'relative'}}>
            <TextInput
              value={quantity}
              onChangeText={text => setQuantity(text)}
              placeholder={translation.Quantity[languague]}
              style={inputStyle}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={() => setDopen(true)} style={inputStyle}>
            <DatePicker
              mode="date"
              modal
              open={dopen}
              date={date}
              onConfirm={date => {
                setDopen(false);
                setDate(date);
              }}
              onCancel={() => {
                setDopen(false);
              }}
            />
            <Text style={{color: 'black', textAlign: 'center', fontSize: 20}}>
              {date && date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={{position: 'relative'}}>
            <TextInput
              value={description}
              onChangeText={text => setDescription(text)}
              placeholder={translation.Description[languague]}
              style={inputStyle}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleAddItem()}
          style={{
            width: '100%',
            backgroundColor: palette.primary,
            paddingVertical: spacing.double,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: spacing.double,
            marginTop: spacing.double,
          }}>
          <Text
            style={{
              color: palette.white,
              fontSize: fontSize.medium,
              fontWeight: '500',
            }}>
            {translation.Save[languague]}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
