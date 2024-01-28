import React from "react";
import { useAppSelector } from "../../hooks";
import { userInfoSelector } from "../../store";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/auth";
import {
  Button,
  View,
  Text,
  Box,
  Avatar,
  Input,
  Stack,
  Icon,
  FormControl,
  HStack,
  VStack,
} from "native-base";
import { showMessage } from "react-native-flash-message";
import { authApi } from "../../services/auth.services";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { UserProfileScreenProps } from "../../Navigator/ProfileNavigator";
import { MaterialIcons } from "@expo/vector-icons";
import { appColor } from "../../theme";
import { FCMConfig } from "../../config/firebaseCloudMessage";
GoogleSignin.configure({
  webClientId:
    "931199521045-rn8i7um077q2b9pgpsrdejj90qj26fvv.apps.googleusercontent.com",
});

const ProfileScreen = ({ navigation, route }: UserProfileScreenProps) => {
  const userInfo = useAppSelector(userInfoSelector);

  const handleChangeUserInfo = () => {};

  useEffect(() => {
    FCMConfig(userInfo?.id);
  }, []);
  return (
    <Box
      bgColor="#fff"
      width="90%"
      alignSelf="center"
      alignItems="center"
      p={5}
      borderBottomRadius={20}
    >
      <Box
        width="full"
        alignItems="center"
        py={3}
        mb={3}
        borderBottomWidth={1}
        borderBottomColor="#EDEDF2"
      >
        <Avatar
          alignSelf="center"
          bg="green.500"
          source={{
            uri: `https://ui-avatars.com/api/?name=${userInfo?.firstName}`,
          }}
          size="xl"
          mb={2}
        >
          ABC
        </Avatar>
        <Text color={appColor.textTitle} fontWeight="extrabold" fontSize="17">
          {userInfo?.lastName + " " + userInfo?.firstName}
        </Text>
        <Text color={appColor.textSecondary}>{userInfo?.email}</Text>
      </Box>
      <Box alignItems="flex-start" width="100%">
        <VStack space="5">
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Họ và tên
            </Text>
            <Text color={appColor.textSecondary}>
              {userInfo?.lastName + " " + userInfo?.firstName}
            </Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Địa chỉ
            </Text>
            <Text color={appColor.textSecondary}>Thành phố Hồ Chí Minh</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Giới tính
            </Text>
            <Text color={appColor.textSecondary}>Nam</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Email
            </Text>
            <Text color={appColor.textSecondary}>{userInfo?.email}</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Ngày sinh
            </Text>
            <Text color={appColor.textSecondary}>24/11/2002</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Nghề nghiệp
            </Text>
            <Text color={appColor.textSecondary}>Kỹ sư phần mềm</Text>
          </HStack>
          <HStack width="full" mt={20}>
            <Button width="full" onPress={handleChangeUserInfo}>
              Thay đổi thông tin cá nhân
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default ProfileScreen;
