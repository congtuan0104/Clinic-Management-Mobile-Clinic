import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { StaffInfoNavigatorScreenProps } from "./RoleNavigator";
import StaffDashboardScreen from "../screens/StaffScreen/StaffScreen/StaffDashboardScreen";
import StaffInfoScreen from "../screens/StaffScreen/StaffScreen/StaffInfoScreen/StaffInfo";
import StaffScheduleScreen from "../screens/StaffScreen/StaffScreen/StaffInfoScreen/StaffSchedule";
import { IClinicMember } from "../types/staff.types";
export type StaffInfoNavigatorStackParamList = {
  StaffInfo: { staff: IClinicMember };
  StaffDashboard: undefined;
  StaffSchedule: undefined;
};

export type StaffDashboardScreenProps = NativeStackScreenProps<
  StaffInfoNavigatorStackParamList,
  "StaffDashboard"
>;

export type StaffInfoScreenProps = NativeStackScreenProps<
  StaffInfoNavigatorStackParamList,
  "StaffInfo"
>;

export type StaffScheduleScreenProps = NativeStackScreenProps<
  StaffInfoNavigatorStackParamList,
  "StaffSchedule"
>;

const StaffInfoTabNavigator =
  createNativeStackNavigator<StaffInfoNavigatorStackParamList>();

export default function StaffInfoNavigator({
  navigation,
  route,
}: StaffInfoNavigatorScreenProps) {
  return (
    <StaffInfoTabNavigator.Navigator initialRouteName="StaffDashboard">
      <StaffInfoTabNavigator.Screen
        name="StaffDashboard"
        component={StaffDashboardScreen}
        options={{
          headerShown: false,
          title: "Danh sách nhân viên",
        }}
      />
      <StaffInfoTabNavigator.Screen
        name="StaffInfo"
        component={StaffInfoScreen}
        options={{
          headerShown: false,
          title: "Thông tin nhân viên",
        }}
      />
      <StaffInfoTabNavigator.Screen
        name="StaffSchedule"
        component={StaffScheduleScreen}
        options={{
          headerShown: false,
          title: "Lịch làm việc",
        }}
      />
    </StaffInfoTabNavigator.Navigator>
  );
}
