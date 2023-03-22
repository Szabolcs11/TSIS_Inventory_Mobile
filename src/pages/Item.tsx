import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  ItemType,
  StackNavigatorParamsList,
  TabNavigatorParamsList,
  UserType,
} from '../types';
import {
  DeleteBtn,
  DeleteBtnContainer,
  DeleteBtnText,
  ItemContainer,
  ItemContainerText,
} from '../style';
import axios from 'axios';
import {apiurl, DEFAULT_LANGUAGE} from '../constants';
import {storage} from '../navigation';
import {showToast} from '../navigation/toaster';
import globalTranslation from '../translations/Global.json';

import {LangagueProps} from '../types';
import {navigate, navigationRef} from '../navigation/settings';

// type ItemViewPros = StackScreenProps<StackNavigatorParamsList, 'ViewItem'>;
type ItemViewPros = {
  itemdata: ItemType | null;
};

export default function Item(props: ItemViewPros) {
  const [user, setUser] = useState<UserType | null>(GetUserFromStorage());
  const [itemData, setItemData] = useState<ItemType | null>();
  const [languague, setLanguague] = useState<LangagueProps>(
    (storage.getString('lang') as LangagueProps) || DEFAULT_LANGUAGE,
  );
  console.log('itemdata');
  console.log(props.itemdata);
  const handleDelete = () => {
    console.log('Delete', props?.itemdata?.id);
    console.log(user?.id);
    axios
      .post(apiurl + 'handleDeleteItem', {
        itemID: props?.itemdata?.id,
        userID: user?.id,
        lang: storage.getString('lang') || DEFAULT_LANGUAGE,
      })
      .then(res => {
        if (res.data.success) {
          showToast(
            'success',
            globalTranslation.Success[languague],
            res.data.message,
          );
          navigationRef?.current?.goBack();
        } else {
          showToast(
            'error',
            globalTranslation.Error[languague],
            res.data.message,
          );
        }
      });
  };
  return (
    <View style={ItemContainer}>
      <Text style={ItemContainerText}>
        {props.itemdata?.InventoryID
          ? `InventoryID: ${props.itemdata?.InventoryID}`
          : `ItemID: ${props?.itemdata?.id}`}
      </Text>
      <Text style={ItemContainerText}>
        ClassRoom: {props.itemdata?.Classroom}
      </Text>
      <Text style={ItemContainerText}>
        Quantity: {props.itemdata?.Quantity}
      </Text>
      <Text style={ItemContainerText}>
        Description:{' '}
        {props.itemdata?.Note != ''
          ? props.itemdata?.Note
          : 'No description found'}
      </Text>

      <View style={DeleteBtnContainer}>
        <TouchableOpacity style={DeleteBtn} onPress={() => handleDelete()}>
          <Text style={DeleteBtnText}>Delete</Text>
        </TouchableOpacity>
        <Text style={ItemContainerText}>
          Item added date:{' '}
          {new Date(props?.itemdata?.AddedDate).toLocaleDateString()}
        </Text>
        <Text style={ItemContainerText}>
          Last update:{' '}
          {new Date(props?.itemdata?.ModifiedDate).toLocaleDateString()}
        </Text>
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

// function getItemData(itemid) {
//   axios.get(apiurl + 'item/' + itemid).then(res => {
//     if (res.data.success) {
//       // console.log(res.data.itemdata);
//       return res.data.itemdata as ItemType;
//     } else {
//       return null;
//     }
//   });
// }
