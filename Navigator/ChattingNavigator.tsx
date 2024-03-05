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
import { GroupChatInfo, IGroupChatMember } from "../types";
import { userInfoSelector } from "../store";
import { useAppSelector } from "../hooks";

export type ChatDetailStackParamList = {
  ChattingGroupList: undefined;
  ChattingDetail: { group: GroupChatInfo };
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
  const userInfo = useAppSelector(userInfoSelector);

  const getGroupImage = (group: GroupChatInfo) => {
    const groupMember = group.groupChatMember?.find(
      (member: IGroupChatMember, index: number) =>
        member.userId !== userInfo?.id
    );
    return groupMember?.avatar;
  };
  const renderGroupName = (group: GroupChatInfo) => {
    if (group.type === "one-on-one") {
      const groupMember = group.groupChatMember?.find(
        (member: IGroupChatMember, index: number) =>
          member.userId !== userInfo?.id
      );
      const memberName = groupMember?.firstName + " " + groupMember?.lastName;
      if (memberName.length > 17) {
        return `${memberName.slice(0, 17)}...`;
      } else {
        return memberName;
      }
    } else {
      if (group.groupName.length > 17) {
        return `${group.groupName.slice(0, 17)}...`;
      } else {
        return group.groupName;
      }
    }
  };
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
        options={{
          headerShown: false,
        }}
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
                  source={
                    route.params.group.type === "one-on-one"
                      ? { uri: getGroupImage(route.params.group) }
                      : require("../assets/images/chat/groupchatdefault.png")
                  }
                  borderRadius={100}
                  size="12"
                  alt={route.params.group.groupName}
                  background="gray.300"
                />
                <Text fontWeight="bold" fontSize="16">
                  {renderGroupName(route.params.group)}
                </Text>
              </HStack>
            );
          },
          headerRight: () => (
            <>
              <Pressable
                _pressed={{
                  backgroundColor: "primary.100",
                }}
                borderWidth={1}
                mr={2}
                borderColor={appColor.primary}
                borderRadius={100}
                p={2}
                onPress={() => {
                  navigation.navigate("VideoCall", {
                    groupId: route.params.group.id,
                  });
                }}
              >
                <FontAwesome5
                  name="video"
                  size={20}
                  color={appColor.backgroundPrimary}
                />
              </Pressable>
              <Pressable
                _pressed={{
                  backgroundColor: "primary.100",
                }}
                borderWidth={1}
                borderColor={appColor.primary}
                borderRadius={100}
                p={2}
                justifyContent="center"
                alignItems="center"
                onPress={() => {
                  navigation.navigate("ChattingDetailSettings", {
                    groupId: route.params.group.id,
                  });
                }}
              >
                <Ionicons
                  name="ellipsis-vertical-outline"
                  size={20}
                  color={appColor.primary}
                />
              </Pressable>
            </>
          ),
          headerShadowVisible: false,
        })}
      />
    </ChattingStackNavigator.Navigator>
  );
}
