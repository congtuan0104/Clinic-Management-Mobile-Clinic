import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoleNavigatorProps } from "./UserNavigator";
import RoleDashboardScreen from "../screens/StaffScreen/StaffRoleScreen/RoleDashboardScreen";
import StaffDashboardScreen from "../screens/StaffScreen/StaffScreen/StaffDashboardScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { appColor } from "../theme";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
export type StaffNavigatorStackParamList = {
  RoleDashboard: undefined;
  StaffDashboard: undefined;
};

export type RoleDashboardScreenProps = NativeStackScreenProps<
  StaffNavigatorStackParamList,
  "RoleDashboard"
>;

export type StaffDashboardScreenProps = NativeStackScreenProps<
  StaffNavigatorStackParamList,
  "StaffDashboard"
>;

const StaffTabNavigator =
  createBottomTabNavigator<StaffNavigatorStackParamList>();

export default function RoleNavigator({
  navigation,
  route,
}: RoleNavigatorProps) {
  return (
    <StaffTabNavigator.Navigator initialRouteName="StaffDashboard">
      <StaffTabNavigator.Screen
        name="StaffDashboard"
        component={StaffDashboardScreen}
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
