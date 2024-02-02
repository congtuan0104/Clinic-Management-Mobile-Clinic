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
import ChangePasswordModal from "../../components/ChangePasswordModal/ChangePasswordModal";
import { showMessage } from "react-native-flash-message";
import { authApi } from "../../services/auth.services";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ConnectingScreenProps } from "../../Navigator/ProfileNavigator";
import { MaterialIcons } from "@expo/vector-icons";
import { appColor } from "../../theme";
GoogleSignin.configure({
  webClientId:
    "931199521045-rn8i7um077q2b9pgpsrdejj90qj26fvv.apps.googleusercontent.com",
});

const ConnectingScreen = ({ navigation, route }: ConnectingScreenProps) => {
  const userInfo = useAppSelector(userInfoSelector);
  const { linkAccountFacebook, linkAccountGoogle } = useAuth();

  const [googleAccoutId, setgoogleAccoutId] = useState<string>("");

  const [fbAccoutId, setfbAccoutId] = useState("");

  const [isGoogleLink, setisGoogleLink] = useState(false);

  const [isFacebookLink, setisFacebookLink] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Kiểm tra và lấy danh sách tài khoản  liên kết
  useEffect(() => {
    if (userInfo?.id) {
      authApi
        .getLinkAccount(userInfo.id)
        .then((res) => {
          res.data.forEach((item: any) => {
            if (item.provider === "google") {
              setgoogleAccoutId(item.id);
              setisGoogleLink(true);
            }
            if (item.provider === "facebook") {
              setfbAccoutId(item.id);
              setisFacebookLink(true);
            }
          });
        })
        .catch((error) => {
          console.log("Call api to get profile error: ");
          console.log(error);
        });
    }
  }, [isGoogleLink, isFacebookLink]);

  const handleChangePassword = () => {
    setShowModal(true);
  };

  const connectFacebook = async () => {
    await linkAccountFacebook();
    setisFacebookLink(true);
  };

  const disConnectFacebook = () => {
    if (userInfo?.id) {
      authApi.disConnectLinkAccount(userInfo.id, fbAccoutId).then(() => {
        setisFacebookLink(false);
        // Hiển thị thông báo
        showMessage({
          message: "Hủy liên kết tài khoản thành công",
          color: "green",
        });
      });
    }
  };

  const connectGoogle = async () => {
    await linkAccountGoogle();
    setisGoogleLink(true);
  };

  const disConnectGoogle = () => {
    if (userInfo?.id) {
      authApi
        .disConnectLinkAccount(userInfo.id, googleAccoutId)
        .then(() => {
          setisGoogleLink(false);
          // Hiển thị thông báo
          showMessage({
            message: "Hủy liên kết tài khoản thành công",
            color: "green",
          });
          GoogleSignin.signOut();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Box
      bgColor="#fff"
      width="90%"
      alignSelf="center"
      alignItems="center"
      p={5}
      borderBottomRadius={20}
    >
      <ChangePasswordModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <Box alignItems="flex-start" width="100%">
        <VStack space="5">
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Email
            </Text>
            <Text color={appColor.textSecondary}>{userInfo?.email}</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Google
            </Text>
            <Text color={appColor.textSecondary}>
              {isGoogleLink ? "Đã kết nối" : "Chưa kết nối"}
            </Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Facebook
            </Text>
            <Text color={appColor.textSecondary}>
              {isFacebookLink ? "Đã kết nối" : "Chưa kết nối"}
            </Text>
          </HStack>
          <HStack width="full" mt="5/6">
            <Button
              width="full"
              onPress={isGoogleLink ? disConnectGoogle : connectGoogle}
            >
              {isGoogleLink ? "Hủy kết nối với Google" : "Kết nối với Google"}
            </Button>
          </HStack>
          <HStack width="full">
            <Button
              width="full"
              onPress={isFacebookLink ? disConnectFacebook : connectFacebook}
            >
              {isFacebookLink
                ? "Hủy kết nối với Facebook"
                : "Kết nối với Facebook"}
            </Button>
          </HStack>
          <HStack width="full">
            <Button width="full" onPress={handleChangePassword}>
              Đổi mật khẩu
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default ConnectingScreen;
