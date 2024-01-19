import React from "react";
import { ChattingNavigatorProps } from "./UserNavigator";
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

export type ChatDetailStackParamList = {
  ChattingGroupList: undefined;
  ChattingDetail: { groupId: number; groupName: string };
  CreateChattingGroup: undefined;
  ChattingDetailSettings: { groupId: number };
  VideoCall: { groupId: number };
};

export type VideoCallProps = NativeStackScreenProps<
  ChatDetailStackParamList,
  "VideoCall"
>;

export type ChattingGroupListScreenProps = NativeStackScreenProps<
  ChatDetailStackParamList,
  "ChattingGroupList"
>;

export type ChattingDetailScreenProps = NativeStackScreenProps<
  ChatDetailStackParamList,
  "ChattingDetail"
>;

export type ChattingDetailSettingsScreenProps = NativeStackScreenProps<
  ChatDetailStackParamList,
  "ChattingDetailSettings"
>;

const ChattingStackNavigator =
  createNativeStackNavigator<ChatDetailStackParamList>();

export default function ChattingNavigator({
  navigation,
  route,
}: ChattingNavigatorProps) {
  return (
    <ChattingStackNavigator.Navigator initialRouteName="ChattingGroupList">
      <ChattingStackNavigator.Screen
        name="ChattingGroupList"
        component={ChattingGroupListScreen}
        options={{ headerShown: false }}
      />

      <ChattingStackNavigator.Screen
        name="ChattingDetailSettings"
        component={ChattingDetailSettings}
        options={{ headerShown: false }}
      />
      <ChattingStackNavigator.Screen
        name="VideoCall"
        component={VideoCall}
        options={{ headerShown: false }}
      />
      <ChattingStackNavigator.Screen
        name="ChattingDetail"
        component={ChattingDetailScreen}
        options={({ route, navigation }) => ({
          headerTitle: (props) => {
            return (
              <HStack
                marginLeft={-15}
                space={2}
                justifyContent="center"
                alignItems="center"
              >
                <Image
                  src="https://picsum.photos/200"
                  borderRadius={100}
                  size="10"
                  alt="ff"
                />
                <Text fontWeight="bold" fontSize="16">
                  {route.params.groupName.length > 20
                    ? `${route.params.groupName.slice(0, 20)}...`
                    : route.params.groupName}
                </Text>
              </HStack>
            );
          },
          headerRight: () => (
            <>
              <Pressable
                style={{
                  marginRight: 12,
                }}
                onPress={() => {
                  navigation.navigate("VideoCall", {
                    groupId: route.params.groupId,
                  });
                }}
              >
                <FontAwesome5
                  name="video"
                  size={24}
                  color={appColor.backgroundPrimary}
                />
              </Pressable>
              <Pressable
                backgroundColor={appColor.backgroundPrimary}
                borderRadius={100}
                width={35}
                height={35}
                justifyContent="center"
                alignItems="center"
                onPress={() => {
                  navigation.navigate("ChattingDetailSettings", {
                    groupId: route.params.groupId,
                  });
                }}
              >
                <Ionicons
                  name="ellipsis-vertical-outline"
                  size={24}
                  color="#fff"
                />
              </Pressable>
            </>
          ),
        })}
      />
    </ChattingStackNavigator.Navigator>
  );
}
