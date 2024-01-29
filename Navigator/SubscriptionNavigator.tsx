import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { SubscriptionNavigatorProps } from "./UserNavigator";
import SubscriptionDashboardScreen from "../screens/SubscriptionScreen/SubscriptionDashboardScreen";
import SubscriptionRegistrationScreen from "../screens/SubscriptionScreen/SubscriptionRegistrationScreen";
import SubscriptionDetailScreen from "../screens/SubscriptionScreen/SubscriptionDetailScreen";
import SubscriptionHistoryScreen from "../screens/SubscriptionScreen/SubscriptionHistory";
import SubscriptionListScreen from "../screens/SubscriptionScreen/SubscriptionListScreen";
import SubscriptionRegistrationProcessScreen from "../screens/SubscriptionScreen/SubscriptionRegistrationProcess";

export type SubscriptionNavigatorStackParamList = {
  SubscriptionDashboard: undefined;
  SubscriptionRegistration: { planData: any };
  SubscriptionHistory: undefined;
  SubscriptionDetail: { subscriptionId: number };
  SubscriptionList: undefined;
  SubscriptionRegistrationProcess: { planData: any; paymentResult: any };
};

export type SubscriptionDashboardScreenProps = NativeStackScreenProps<
  SubscriptionNavigatorStackParamList,
  "SubscriptionDashboard"
>;

export type SubscriptionRegistrationScreenProps = NativeStackScreenProps<
  SubscriptionNavigatorStackParamList,
  "SubscriptionRegistration"
>;

export type SubscriptionHistoryScreenProps = NativeStackScreenProps<
  SubscriptionNavigatorStackParamList,
  "SubscriptionHistory"
>;

export type SubscriptionDetailScreenProps = NativeStackScreenProps<
  SubscriptionNavigatorStackParamList,
  "SubscriptionDetail"
>;

export type SubscriptionListScreenProps = NativeStackScreenProps<
  SubscriptionNavigatorStackParamList,
  "SubscriptionList"
>;

export type SubscriptionRegistrationProcessScreenProps = NativeStackScreenProps<
  SubscriptionNavigatorStackParamList,
  "SubscriptionRegistrationProcess"
>;

const SubscriptionStackNavigator =
  createNativeStackNavigator<SubscriptionNavigatorStackParamList>();

export default function SubscriptionNavigator({
  navigation,
  route,
}: SubscriptionNavigatorProps) {
  return (
    <SubscriptionStackNavigator.Navigator initialRouteName="SubscriptionList">
      {/* <SubscriptionStackNavigator.Screen
        name="SubscriptionDashboard"
        component={SubscriptionDashboardScreen}
        options={{ headerShown: false }}
      /> */}
      <SubscriptionStackNavigator.Screen
        name="SubscriptionRegistration"
        component={SubscriptionRegistrationScreen}
        options={{ headerShown: false }}
      />
      <SubscriptionStackNavigator.Screen
        name="SubscriptionDetail"
        component={SubscriptionDetailScreen}
        options={{ headerShown: false }}
      />
      <SubscriptionStackNavigator.Screen
        name="SubscriptionHistory"
        component={SubscriptionHistoryScreen}
        options={{ headerShown: false }}
      />
      <SubscriptionStackNavigator.Screen
        name="SubscriptionList"
        component={SubscriptionListScreen}
        options={{ headerShown: false }}
      />
      <SubscriptionStackNavigator.Screen
        name="SubscriptionRegistrationProcess"
        component={SubscriptionRegistrationProcessScreen}
        options={{ headerShown: false }}
      />
    </SubscriptionStackNavigator.Navigator>
  );
}
