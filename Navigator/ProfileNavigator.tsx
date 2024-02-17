import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import { ProfileNavigatorProps } from "./UserNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ConnectingScreen from "../screens/ProfileScreen/ConnectingScreen";
import UpdateUserInfoScreen from "../screens/UpdateUserInfo/UpdateUserInfoScreen";
import { Dimensions } from "react-native";
import { appColor } from "../theme";

export type ProfileNavigatorTopTabParamList = {
  // undefined: the route doesn't have params
  UserProfile: undefined;
  Connecting: undefined;
  UpdateUserInfo: undefined;
};

export type UserProfileScreenProps = NativeStackScreenProps<
  ProfileNavigatorTopTabParamList,
  "UserProfile"
>;

export type UpdateUserInfoScreenProps = NativeStackScreenProps<
  ProfileNavigatorTopTabParamList,
  "UpdateUserInfo"
>;

export type ConnectingScreenProps = NativeStackScreenProps<
  ProfileNavigatorTopTabParamList,
  "Connecting"
>;

const ProfileTopTabNavigator =
  createMaterialTopTabNavigator<ProfileNavigatorTopTabParamList>();

export default function ProfileNavigator({
  navigation,
  route,
}: ProfileNavigatorProps) {
  return (
    <ProfileTopTabNavigator.Navigator
      initialRouteName="UserProfile"
      initialLayout={{ width: Dimensions.get("window").width }}
      screenOptions={{
        tabBarPressColor: appColor.backgroundPrimary,
        tabBarActiveTintColor: appColor.primary,
        tabBarLabelStyle: {
          fontSize: 15,
          textTransform: "none",
        },
        tabBarStyle: {
          backgroundColor: appColor.white,
          width: "90%",
          alignSelf: "center",
          elevation: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: 20,
        },
        tabBarAndroidRipple: {
          color: "transparent",
        },
      }}
    >
      <ProfileTopTabNavigator.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Thông tin cá nhân" }}
      />
      <ProfileTopTabNavigator.Screen
        name="Connecting"
        component={ConnectingScreen}
        options={{ tabBarLabel: "Thông tin tài khoản" }}
      />
    </ProfileTopTabNavigator.Navigator>
  );
}
