import {
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
  View,
  useToast,
} from "native-base";
import { SubscriptionDashboardScreenProps } from "../../Navigator/SubscriptionNavigator";
import { ClinicSelector, userInfoSelector } from "../../store";
import { appColor } from "../../theme";
import { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import { clinicService } from "../../services";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { openBrowserAsync } from "expo-web-browser";
import { ClinicInfoDashboardScreenProps } from "../../Navigator/ClinicInfoNavigator";
import { useAppSelector } from "../../hooks";
import dayjs from "dayjs";
import HTMLView from "react-native-htmlview";
import { StyleSheet } from "react-native";

export default function ClinicInfoDashboardScreen({
  navigation,
  route,
}: ClinicInfoDashboardScreenProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const user = useAppSelector(userInfoSelector);
  const handleChangeClinicInfo = () => {
    navigation.navigate("UpdateClinicInfo");
  };
  return (
    <Box
      mt="5%"
      bgColor="#fff"
      minWidth="90%"
      maxWidth="90%"
      minH="95%"
      maxH="95%"
      alignSelf="center"
      alignItems="center"
      p={5}
      borderRadius={20}
    >
      {clinic ? (
        <ScrollView maxW="100%">
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
              bg="white"
              source={
                clinic.logo
                  ? { uri: clinic.logo }
                  : require("../../assets/images/clinics/default_image_clinic.png")
              }
              size="2xl"
              mb={2}
            />
            <Text
              color={appColor.textTitle}
              fontWeight="extrabold"
              fontSize="17"
            >
              {clinic?.name}
            </Text>
            {/* <Text color={appColor.textSecondary}>{clinic?.description}</Text> */}
            <HTMLView value={clinic.description} stylesheet={styles} />
          </Box>
          <Box alignItems="flex-start" width="100%">
            <VStack space="5">
              <HStack justifyContent="space-between" width="full">
                <Text flex={2} fontWeight="bold" color={appColor.textSecondary}>
                  Địa chỉ
                </Text>
                <Text textAlign="right" flex={4} color={appColor.textSecondary}>
                  {clinic?.address}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={2} fontWeight="bold" color={appColor.textSecondary}>
                  Email liên hệ
                </Text>
                <Text textAlign="right" flex={4} color={appColor.textSecondary}>
                  {clinic?.email}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={2} fontWeight="bold" color={appColor.textSecondary}>
                  SĐT liên hệ
                </Text>
                <Text textAlign="right" flex={4} color={appColor.textSecondary}>
                  {clinic?.phone}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={2} fontWeight="bold" color={appColor.textSecondary}>
                  Ngày mua
                </Text>
                <Text textAlign="right" flex={4} color={appColor.textSecondary}>
                  {dayjs(clinic?.createdAt).format("DD/MM/YYYY")}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={2} fontWeight="bold" color={appColor.textSecondary}>
                  Hạn dùng
                </Text>
                <Text textAlign="right" flex={4} color={appColor.textSecondary}>
                  {dayjs(clinic?.subscriptions[0].expiredAt).format(
                    "DD/MM/YYYY"
                  )}
                </Text>
              </HStack>
            </VStack>
          </Box>
          <Box mt={3}>
            <HStack width="full">
              <Button width="full" onPress={handleChangeClinicInfo}>
                Thay đổi thông tin
              </Button>
            </HStack>
          </Box>
        </ScrollView>
      ) : (
        <Box>
          <Text>
            Hiện tại bạn vẫn chưa chọn phòng khám nào để xem thông tin.{" "}
          </Text>
          <Text>
            Hãy chọn một phòng khám trong danh sách phòng khám của bạn.
          </Text>
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  a: {
    fontWeight: "300",
    color: "#FF3366", // make links coloured pink
  },
});
