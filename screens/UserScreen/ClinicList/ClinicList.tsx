import React from "react";
import { ClinicListNavigatorProps } from "../../../Navigator/UserNavigator";
import {
  Box,
  Button,
  HStack,
  Heading,
  ScrollView,
  VStack,
  Text,
  Pressable,
} from "native-base";
import { appColor } from "../../../theme";
import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import { changeClinic, updateClinic } from "../../../store";
import { useAppDispatch } from "../../../hooks";
import { IClinicInfo } from "../../../types/clinic.types";
export default function ClinicListNavigator({
  navigation,
  route,
}: ClinicListNavigatorProps) {
  const dispatch = useAppDispatch();
  const handleGoToClinic = (clinicItem: IClinicInfo) => {
    setClinic(clinicItem);
    dispatch(changeClinic(clinicItem));
    navigation.goBack();
  };
  const { clinic, setClinic, clinicList } = route.params;
  return (
    <VStack space={5} my={5}>
      {clinicList.length ? (
        <ScrollView
          width="90%"
          alignSelf="center"
          minH="90%"
          maxH="90%"
          backgroundColor={appColor.white}
          borderRadius={20}
        >
          <VStack space={5} width="90%" alignSelf="center" my={5}>
            <Heading alignSelf="center" fontSize={20}>
              Danh sách phòng khám
            </Heading>
            {clinicList.map((clinicItem: any, index: any) => {
              return (
                <Box
                  key={index}
                  backgroundColor="#DAD9FF"
                  borderRadius={15}
                  p={3}
                >
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack>
                      <Text
                        color={appColor.textTitle}
                        fontWeight="bold"
                        fontSize={20}
                      >
                        {clinicItem.name}
                      </Text>
                      <Text fontSize={14}>SĐT: {clinicItem.phone}</Text>
                      <Text fontSize={14}>Đ/c: {clinicItem.address}</Text>
                      <Text>
                        Ngày hết hạn:{" "}
                        {dayjs(clinicItem.subscriptions[0].expiredAt).format(
                          "DD/MM/YYYY"
                        )}
                      </Text>
                    </VStack>
                  </HStack>
                  <Pressable
                    alignSelf="flex-end"
                    onPress={() => {
                      handleGoToClinic(clinicItem);
                    }}
                  >
                    <FontAwesome
                      name="arrow-circle-right"
                      size={35}
                      color={appColor.primary}
                    />
                  </Pressable>
                </Box>
              );
            })}
          </VStack>
        </ScrollView>
      ) : (
        <VStack space={5} my={5}>
          <Box
            width="90%"
            height="90%"
            minH="90%"
            maxH="90%"
            alignSelf="center"
          >
            <Text>
              Rất tiếc, hiện tại bạn chưa có bất kì phòng khám nào. Để tạo phòng
              khám mới, bạn hãy vào Mua gói ở mục Quản lý gói.
            </Text>
          </Box>
        </VStack>
      )}
      <Button
        width="90%"
        alignSelf="center"
        onPress={() => {
          navigation.goBack();
        }}
      >
        Quay lại
      </Button>
    </VStack>
  );
}
