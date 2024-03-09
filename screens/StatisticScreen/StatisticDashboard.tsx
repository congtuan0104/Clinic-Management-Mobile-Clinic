import { Box, HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import { IClinicMember } from "../../types";
import { clinicService } from "../../services";
import { StatisticDashboardProps } from "../../Navigator/StatisticNavigator";

export default function StatisticDashboardScreen({
  navigation,
  route,
}: StatisticDashboardProps) {
  const clinic = useAppSelector(ClinicSelector);

  const [staffList, setStaffList] = useState<IClinicMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenAddStaffModal, setIsOpenAddStaffModal] =
    useState<boolean>(false);
  const [isReRender, setIsReRender] = useState(false);

  const handleReRender = () => setIsReRender(!isReRender);
  const getStaffList = async () => {
    try {
      if (clinic?.id) {
        const response = await clinicService.getStaffClinic(clinic?.id);
        if (response.status && response.data) {
          setStaffList(response.data);
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getStaffList();
    }, [clinic?.id, isReRender])
  );
  return (
    <Box
      bgColor="#fff"
      minWidth="90%"
      maxWidth="90%"
      minH="95%"
      maxH="95%"
      alignSelf="center"
      alignItems="center"
      p={5}
      borderBottomRadius={20}
    >
      <Text>sf</Text>
    </Box>
  );
}
