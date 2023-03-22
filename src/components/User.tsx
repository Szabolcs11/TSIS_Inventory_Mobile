import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {ModifiedUserType, UserType} from '../types';
import {
  DeleteBtn,
  DeleteBtnContainer,
  DeleteBtnText,
  ItemContainer,
  ItemContainerText,
} from '../style';
import axios from 'axios';
import {apiurl} from '../constants';
import {showToast} from '../navigation/toaster';

type UserProps = {
  userdata: ModifiedUserType;
  callback: (id: number) => void;
};

export default function User(props: UserProps) {
  console.log('userprops', props.userdata);

  const handleDelete = () => {};

  return (
    <View style={ItemContainer}>
      <Text style={ItemContainerText}>UserID: {props.userdata.id}</Text>
      <Text style={ItemContainerText}>
        Teljes név: {props.userdata.FullName}
      </Text>
      <Text style={ItemContainerText}>Beosztás: {props.userdata.Rank}</Text>

      <View style={DeleteBtnContainer}>
        <TouchableOpacity
          style={DeleteBtn}
          onPress={() => props.callback(props.userdata.id)}>
          <Text style={DeleteBtnText}>Delete</Text>
        </TouchableOpacity>
        <Text style={ItemContainerText}>
          Last login Date:{' '}
          {new Date(props.userdata.LastLoginDate).toLocaleDateString()}
        </Text>
        <Text style={ItemContainerText}>
          Register Date:{' '}
          {new Date(props.userdata.RegisterDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}
