import React from "react";
import {
  ChattingNavigatorProps,
  StatisticNavigatorProps,
} from "./UserNavigator";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import ChattingDetailScreen from "../screens/ChattingScreen/ChattingDetailScreen";
import ChattingGroupListScreen from "../screens/ChattingScreen/ChattingGroupListScreen";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import {
  Actionsheet,
  Text,
  useDisclose,
  Image,
  HStack,
  Pressable,
} from "native-base";
import ChattingDetailSettings from "../screens/ChattingScreen/ChattingDetailSettings";
import { VideoCall } from "../screens/VideoCall";
import { appColor } from "../theme";
import { GroupChatInfo, IGroupChatMember } from "../types";
import { userInfoSelector } from "../store";
import { useAppSelector } from "../hooks";
import StatisticDashboardScreen from "../screens/StatisticScreen/StatisticDashboard";

export type StatisticStackParamList = {
  StatisticDashboard: undefined;
};

export type StatisticDashboardProps = NativeStackScreenProps<
  StatisticStackParamList,
  "StatisticDashboard"
>;

const StatisticStackNavigator =
  createNativeStackNavigator<StatisticStackParamList>();

export default function StatisticNavigator({
  navigation,
  route,
}: StatisticNavigatorProps) {
  return (
    <StatisticStackNavigator.Navigator initialRouteName="StatisticDashboard">
      <StatisticStackNavigator.Screen
        name="StatisticDashboard"
        component={StatisticDashboardScreen}
        options={{ headerShown: false }}
      />
    </StatisticStackNavigator.Navigator>
  );
}
