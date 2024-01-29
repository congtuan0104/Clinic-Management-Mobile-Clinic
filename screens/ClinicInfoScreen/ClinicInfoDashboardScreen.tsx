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
export default function ClinicInfoDashboardScreen({
  navigation,
  route,
}: ClinicInfoDashboardScreenProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
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
            uri: `https://ui-avatars.com/api/?name=${clinic?.name}`,
          }}
          size="xl"
          mb={2}
        >
          ABC
        </Avatar>
        <Text color={appColor.textTitle} fontWeight="extrabold" fontSize="17">
          {clinic?.name}
        </Text>
        <Text color={appColor.textSecondary}>{clinic?.description}</Text>
      </Box>
      <Box alignItems="flex-start" width="100%">
        <VStack space="5">
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Địa chỉ
            </Text>
            <Text color={appColor.textSecondary}>{clinic?.address}</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Email liên hệ
            </Text>
            <Text color={appColor.textSecondary}>{clinic?.email}</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              SĐT liên hệ
            </Text>
            <Text color={appColor.textSecondary}>{clinic?.phone}</Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Ngày mua
            </Text>
            <Text color={appColor.textSecondary}>
              {dayjs(clinic?.createdAt).format("DD/MM/YYYY")}
            </Text>
          </HStack>
          <HStack justifyContent="space-between" width="full">
            <Text fontWeight="bold" color={appColor.textSecondary}>
              Hạn dùng
            </Text>
            <Text color={appColor.textSecondary}>
              {dayjs(clinic?.subscriptions[0].expiredAt).format("DD/MM/YYYY")}
            </Text>
          </HStack>
          <HStack width="full" mt={20}>
            <Button width="full" onPress={handleChangeClinicInfo}>
              Thay đổi thông tin
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
