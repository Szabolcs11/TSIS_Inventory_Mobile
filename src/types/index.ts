export type StackNavigatorParamsList = {
  TabNavigator: {};
  Modal: {
    content: () => JSX.Element;
    title: string;
  };
  ViewItem: {
    itemID: number;
  };
  ViewProfile: {
    userID: number;
  };
};

export type TabNavigatorParamsList = {
  Home: {
    content: () => JSX.Element;
    user: UserType;
  };
  ItemList: {
    user: UserType;
  };
  AddItem: {};
  UserList: {};
  Profile: {};
};

export type UserType = {
  id: number;
  Username: string;
  Password: string;
  FullName: string;
  Email: string;
  Rank: string;
  RankName?: string;
  AvatarURL: string;
  LastLoginDate: Date;
  RegisterDate: Date;
  Flag: string;
};

export type ItemType = {
  id: number;
  InventoryID: number;
  Name: string;
  Quantity: number;
  Note: string;
  Discarded: number;
  Classroom: string;
  Modifier: UserType;
  AddedDate: Date;
  ModifiedDate: Date;
};

export type ClassroomType = {
  id: number;
  Name: string;
  Description?: string;
  CreatedDate: Date;
};

export let TestUser: UserType = {
  id: 0,
  Username: 'Username',
  Email: '',
  FullName: 'Guest',
  Password: '',
  Rank: '',
  AvatarURL: '',
  Flag: '',
  LastLoginDate: new Date(),
  RegisterDate: new Date(),
};

export type LangagueProps = 'en' | 'rs' | 'hu';

export type ModifiedUserType = {
  id: number;
  FullName: string;
  Rank: string;
  LastLoginDate: Date;
  RegisterDate: Date;
};
