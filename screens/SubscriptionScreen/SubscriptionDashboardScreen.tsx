import {
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  View,
  useToast,
} from "native-base";
import { SubscriptionDashboardScreenProps } from "../../Navigator/SubscriptionNavigator";
import { useAppSelector } from "../../hooks";
import { userInfoSelector } from "../../store";
import { appColor } from "../../theme";
import { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import { clinicService } from "../../services";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { openBrowserAsync } from "expo-web-browser";

export default function SubscriptionDashboardScreen({
  navigation,
  route,
}: SubscriptionDashboardScreenProps) {
  const toast = useToast();
  const userInfo = useAppSelector(userInfoSelector);
  const [clinic, setClinic] = useState<any>([]);
  useEffect(() => {
    const getSubscriptionUsing = async () => {
      // Call API to get clinic that user is using it
      await generateLink();
      try {
        const response = await clinicService.getCLinicByUserId(userInfo?.id);
        // If success, save subscription in state
        if (response.status) {
          setClinic(response.data);
        } else {
          setClinic([]);
        }
      } catch (error) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Lỗi"
                description="Không tồn tại gói này trong danh sách. Vui lòng thử lại sau."
                status="error"
              />
            );
          },
        });
      }
    };
    getSubscriptionUsing();
  }, []);

  const generateLink = async () => {
    // try {
    //   const link = await dynamicLinks().buildShortLink(
    //     {
    //       link: "https://clinus.page.link/payment",
    //       domainUriPrefix: "https://clinus.page.link/payment",
    //       android: {
    //         packageName: "com.nhatminh287.Mobileapppatient",
    //       },
    //     },
    //     dynamicLinks.ShortLinkType.DEFAULT
    //   );
    //   console.log("Linkz: ", link);
    // } catch (error) {
    //   console.log("error: ", error);
    // }
    try {
      const link = await dynamicLinks().buildLink({
        link: "https://clinus.page.link/verify-account",
        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: "https://clinus.page.link",
      });
      const link2 = await dynamicLinks().buildLink({
        link: "https://clinus.page.link/payment?id=132",
        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: "https://clinus.page.link",
      });
      // console.log("Link 1: ", link);
      // console.log("Link 2: ", link2);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Box
        bgColor="#fff"
        width="90%"
        maxW="90%"
        maxH="95%"
        minH="90%"
        mt={5}
        alignSelf="center"
        alignItems="center"
        p={5}
        borderRadius={20}
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
        {clinic?.length ? (
          <Box alignItems="flex-start" width="100%">
            <VStack space="5">
              <Heading size="md">Gói đang sử dụng</Heading>
              <HStack justifyContent="space-between" width="full">
                <Text color={appColor.textSecondary}>Tên gói</Text>
                <Text color={appColor.textSecondary}>asfasff</Text>
              </HStack>

              <HStack justifyContent="space-between" width="full">
                <Text color={appColor.textSecondary}>Thời hạn</Text>
                <Text color={appColor.textSecondary}>asdadsfaf</Text>
              </HStack>

              <HStack width="full">
                <Button
                  width="full"
                  onPress={() => {
                    navigation.navigate("SubscriptionDetail", {
                      subscriptionId: 1,
                    });
                  }}
                >
                  Xem chi tiết
                </Button>
              </HStack>
              <HStack width="full">
                <Button
                  width="full"
                  onPress={() => {
                    navigation.navigate("SubscriptionList");
                  }}
                >
                  Mua gói ngay
                </Button>
              </HStack>
              <HStack width="full">
                <Button
                  width="full"
                  onPress={() => {
                    navigation.navigate("SubscriptionHistory");
                  }}
                >
                  Xem lịch sử
                </Button>
              </HStack>
            </VStack>
          </Box>
        ) : (
          <Box alignItems="flex-start" width="100%">
            <VStack space="5">
              <Heading size="md">Hiện tại bạn vẫn chưa mua gói nào.</Heading>
              <HStack width="full" mt={64}>
                <Button
                  width="full"
                  onPress={() => {
                    navigation.navigate("SubscriptionList");
                  }}
                >
                  Đăng ký ngay
                </Button>
              </HStack>
              <HStack width="full">
                <Button
                  width="full"
                  onPress={() => {
                    navigation.navigate("SubscriptionHistory");
                  }}
                >
                  Xem lịch sử
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </Box>
    </>
  );
}
