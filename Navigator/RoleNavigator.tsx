import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoleNavigatorProps } from "./UserNavigator";
import RoleDashboardScreen from "../screens/StaffScreen/StaffRoleScreen/RoleDashboardScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import StaffInfoNavigator from "./StaffInfoNavigator";
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
  createBottomTabNavigator<StaffNavigatorStackParamList>();

export default function RoleNavigator({
  navigation,
  route,
}: RoleNavigatorProps) {
  return (
    <StaffTabNavigator.Navigator initialRouteName="StaffInfoNavigator">
      <StaffTabNavigator.Screen
        name="StaffInfoNavigator"
        component={StaffInfoNavigator}
        options={{
          headerShown: false,
          title: "Danh sách nhân viên",
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={24} color={color} />
          ),
        }}
      />
      <StaffTabNavigator.Screen
        name="RoleDashboard"
        component={RoleDashboardScreen}
        options={{
          headerShown: false,
          title: "Vai trò nhân viên",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </StaffTabNavigator.Navigator>
  );
}
