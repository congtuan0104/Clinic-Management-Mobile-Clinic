import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoleNavigatorProps } from "./UserNavigator";
import RoleDashboardScreen from "../screens/StaffScreen/StaffRoleScreen/RoleDashboardScreen";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import StaffInfoNavigator from "./StaffInfoNavigator";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { appColor } from "../theme";
import { Dimensions } from "react-native";

export type StaffNavigatorStackParamList = {
  RoleDashboard: undefined;
  StaffInfoNavigator: undefined;
};

export type RoleDashboardScreenProps = NativeStackScreenProps<
  StaffNavigatorStackParamList,
  "RoleDashboard"
>;

export type StaffInfoNavigatorScreenProps = NativeStackScreenProps<
  StaffNavigatorStackParamList,
  "StaffInfoNavigator"
>;

const StaffTabNavigator =
  createMaterialTopTabNavigator<StaffNavigatorStackParamList>();
export default function RoleNavigator({
  navigation,
  route,
}: RoleNavigatorProps) {
  return (
    <StaffTabNavigator.Navigator
      initialRouteName="StaffInfoNavigator"
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
      <StaffTabNavigator.Screen
        options={{ tabBarLabel: "Nhân viên" }}
        name="StaffInfoNavigator"
        component={StaffInfoNavigator}
      />
      <StaffTabNavigator.Screen
        name="RoleDashboard"
        component={RoleDashboardScreen}
        options={{ tabBarLabel: "Vai trò" }}
      />
    </StaffTabNavigator.Navigator>
  );
}
