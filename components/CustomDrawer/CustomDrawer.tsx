import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Avatar, Button, HStack, Image, Text, VStack, View } from "native-base";
import { appColor } from "../../theme";
import { ImageBackground } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteClinic, logout, userInfoSelector } from "../../store";
import { notificationService } from "../../services/notification.services";
import messaging from "@react-native-firebase/messaging";

const CustomDrawer = (props: any) => {
  const userInfo = useAppSelector(userInfoSelector);
  const { logOut } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    setIsLoading(true);
    // Call API to delete FCM token saved in server
    try {
      const token = await messaging().getToken();
      if (userInfo) {
        const response = await notificationService.deleteFCMToken(
          userInfo.id,
          token
        );
      }
    } catch (error) {
      console.log(error);
    }
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    dispatch(logout());
    dispatch(deleteClinic());
    logOut();
    setIsLoading(false);
  };
  return (
    <View style={{ flex: 1 }}>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      {userInfo && (
        <>
          <LoadingSpinner
            showLoading={isLoading}
            setShowLoading={setIsLoading}
          />
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
              backgroundColor: appColor.background,
            }}
          >
            <ImageBackground
              source={require("../../assets/images/menu-bg.jpeg")}
              style={{ padding: 20, marginBottom: 20 }}
            >
              <Image
                alignSelf="center"
                bg="#fff"
                source={
                  userInfo.avatar
                    ? { uri: userInfo.avatar }
                    : require("../../assets/user.png")
                }
                size={100}
                borderRadius={100}
                mb={2}
                alt={userInfo?.email}
              />
              <VStack alignItems="center">
                <Text color="#fff" fontWeight="bold" fontSize="16">
                  {userInfo?.firstName + " " + userInfo?.lastName}
                </Text>
                <Text color="#fff" fontSize="13">
                  {userInfo?.email}
                </Text>
              </VStack>
            </ImageBackground>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
          <View p="5" borderTopWidth="1" borderTopColor="#ccc">
            <Button onPress={handleLogout}>
              <HStack space={1}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
                <Text fontSize={15} color="#fff">
                  Đăng xuất
                </Text>
              </HStack>
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export default CustomDrawer;
