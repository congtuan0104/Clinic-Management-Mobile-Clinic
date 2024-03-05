import React from "react";
import { ChattingDetailSettingsScreenProps } from "../../Navigator/ChattingNavigator";
import {
  Box,
  Button,
  ScrollView,
  VStack,
  Text,
  Pressable,
  HStack,
  Avatar,
  useToast,
} from "native-base";
import { appColor } from "../../theme";
import { IGroupChatMember } from "../../types";
import dayjs from "dayjs";
import { MaterialIcons } from "@expo/vector-icons";
import ToastAlert from "../../components/Toast/Toast";
import { chatService } from "../../services";
import { userInfoSelector } from "../../store";
import { useAppSelector } from "../../hooks";

const ChattingDetailSettings: React.FC<ChattingDetailSettingsScreenProps> = ({
  route,
  navigation,
}) => {
  const userInfo = useAppSelector(userInfoSelector);
  // Call API to get group detail
  const { group } = route.params;
  const toast = useToast();

  const isGroupAdmin = () => {
    const youInList = group.groupChatMember?.find(
      (member: IGroupChatMember, index: number) =>
        member.userId === userInfo?.id
    );
    if (youInList?.isAdmin) return true;
    else return false;
  };
  const handleOutGroup = async (member: IGroupChatMember) => {
    if (!isGroupAdmin()) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thất bại!"
              description={`Bạn không phải là quản trị viên!`}
              status="error"
            />
          );
        },
      });
      return;
    }
    const userList = [member.userId];
    try {
      const response = await chatService.removeMemberOutGroupChat(
        group.id.toString(),
        userList
      );
      if (response.status) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thành công"
                description={`Đã đá thành viên ${
                  member.firstName + " " + member.lastName
                } khỏi nhóm chat`}
                status="success"
              />
            );
          },
        });
        navigation.navigate("ChattingGroupList");
      } else {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thất bại"
                description="Xóa thất bại. Vui lòng thử lại sau."
                status="error"
              />
            );
          },
        });
      }
    } catch (err: any) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thất bại"
              description="Có lỗi xảy ra. Vui lòng thử lại sau."
              status="error"
            />
          );
        },
      });
    }
  };
  return (
    <Box
      backgroundColor={appColor.white}
      borderRadius={20}
      height="94%"
      maxW="90%"
      minW="90%"
      mt="5%"
      alignSelf="center"
      p={4}
    >
      <Text
        alignSelf="center"
        mb={2}
        fontWeight="bold"
        fontSize={17}
        color={appColor.textTitle}
      >
        Danh sách thành viên
      </Text>
      <ScrollView alignSelf="center" width="full" height="full">
        <VStack space={4}>
          {group.groupChatMember &&
            group.groupChatMember.map(
              (member: IGroupChatMember, index: any) => {
                return (
                  <Box
                    key={index}
                    backgroundColor={appColor.background}
                    borderRadius={20}
                    p={3}
                  >
                    <HStack alignItems="center" space={2}>
                      <Avatar
                        alignSelf="center"
                        bg="gray.200"
                        source={
                          member?.avatar
                            ? { uri: member?.avatar }
                            : require("../../assets/user.png")
                        }
                        size="lg"
                      />
                      <VStack flex={1}>
                        <HStack w="full" justifyContent="space-between">
                          <Text
                            fontWeight="bold"
                            color={appColor.textSecondary}
                          >
                            {member.firstName + " " + member.lastName}
                          </Text>
                          {member.userId !== userInfo?.id && (
                            <Pressable
                              onPress={() => {
                                handleOutGroup(member);
                              }}
                            >
                              <MaterialIcons
                                name="delete"
                                size={24}
                                color={appColor.primary}
                              />
                            </Pressable>
                          )}
                        </HStack>
                        <HStack>
                          <Text color={appColor.textSecondary}>
                            {member.email}
                          </Text>
                        </HStack>
                        {member.isAdmin && (
                          <HStack>
                            <Text color="red.500">Quản trị viên</Text>
                          </HStack>
                        )}
                        <HStack>
                          <Text color={appColor.textSecondary}>
                            Ngày tham gia:{" "}
                            {dayjs(member.joinedAt).format("DD/MM/YYYY")}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                );
              }
            )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ChattingDetailSettings;
