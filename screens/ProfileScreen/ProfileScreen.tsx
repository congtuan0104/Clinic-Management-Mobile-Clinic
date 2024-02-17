import React from "react";
import { useAppSelector } from "../../hooks";
import { userInfoSelector } from "../../store";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/auth";
import AddNewPasswordModal from "./AddNewPasswordModal";
import {
  Button,
  View,
  Text,
  Box,
  Avatar,
  Image,
  Stack,
  Icon,
  FormControl,
  HStack,
  VStack,
} from "native-base";
import { authApi } from "../../services/auth.services";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { UserProfileScreenProps } from "../../Navigator/ProfileNavigator";
import { MaterialIcons } from "@expo/vector-icons";
import { appColor } from "../../theme";
import { FCMConfig } from "../../config/firebaseCloudMessage";
import dayjs from "dayjs";
GoogleSignin.configure({
  webClientId:
    "931199521045-rn8i7um077q2b9pgpsrdejj90qj26fvv.apps.googleusercontent.com",
});

const ProfileScreen = ({ navigation, route }: UserProfileScreenProps) => {
  const userInfo = useAppSelector(userInfoSelector);
  const dateString = userInfo?.birthday?.slice(0, 10);
  //console.log('profile page: ', userInfo);
  const [showModal, setShowModal] = useState<boolean>(true);
  const handleChangeUserInfo = () => {
    navigation.navigate("UpdateUserInfo");
  };

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
      {userInfo?.isInputPassword ? (
        <></>
      ) : (
        <AddNewPasswordModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
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
          bg="grey"
          source={
            userInfo?.avatar
              ? { uri: userInfo.avatar }
              : require("../../assets/user.png")
          }
          size="2xl"
          mb={2}
        />

        <Text color={appColor.textTitle} fontWeight="extrabold" fontSize="17">
          {userInfo?.firstName + " " + userInfo?.lastName}
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
              {userInfo?.firstName + " " + userInfo?.lastName}
            </Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Địa chỉ
            </Text>
            <Text color={appColor.textSecondary}>{userInfo?.address}</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Giới tính
            </Text>
            <Text color={appColor.textSecondary}>
              {userInfo?.gender === 1
                ? "Nam"
                : userInfo?.gender === 0
                ? "Nữ"
                : ""}
            </Text>
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
            <Text color={appColor.textSecondary}>
              {dayjs(userInfo?.birthday).format("DD/MM/YYYY")}
            </Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Số điện thoại
            </Text>
            <Text color={appColor.textSecondary}>{userInfo?.phone}</Text>
          </HStack>
          <HStack width="full" mt={10}>
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
