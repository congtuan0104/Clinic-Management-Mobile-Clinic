import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { RoleNavigatorProps } from "./UserNavigator";
import RoleDashboardScreen from "../screens/RoleScreen/RoleDashboardScreen";

export type RoleNavigatorStackParamList = {
  RoleDashboard: undefined;
  CreateNewRole: undefined;
};

export type RoleDashboardScreenProps = NativeStackScreenProps<
  RoleNavigatorStackParamList,
  "RoleDashboard"
>;

const RoleStackNavigator =
  createNativeStackNavigator<RoleNavigatorStackParamList>();

export default function RoleNavigator({
  navigation,
  route,
}: RoleNavigatorProps) {
  return (
    <RoleStackNavigator.Navigator initialRouteName="RoleDashboard">
      <RoleStackNavigator.Screen
        name="RoleDashboard"
        component={RoleDashboardScreen}
        options={{ headerShown: false }}
      />
    </RoleStackNavigator.Navigator>
  );
}
