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
import { CreateNewRoleScreenProps } from "../../Navigator/RoleNavigator";
export default function CreateNewRoleScreen({
  navigation,
  route,
}: CreateNewRoleScreenProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  return (
    <Box
      bgColor="#fff"
      minWidth="90%"
      maxWidth="90%"
      alignSelf="center"
      alignItems="center"
      p={5}
      borderRadius={20}
    >
      sddsdf
    </Box>
  );
}
