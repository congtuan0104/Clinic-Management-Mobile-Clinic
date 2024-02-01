import React from "react";
import { ClinicListNavigatorProps } from "../../Navigator/UserNavigator";
import {
  Box,
  Button,
  HStack,
  Heading,
  ScrollView,
  VStack,
  Text,
  Pressable,
  useToast,
  Image,
} from "native-base";
import { appColor } from "../../theme";
import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import { changeClinic, updateClinic, userInfoSelector } from "../../store";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { IClinicInfo } from "../../types/clinic.types";
import { Ionicons } from "@expo/vector-icons";
import { clinicService } from "../../services";
import ToastAlert from "../../components/Toast/Toast";

export default function ClinicListNavigator({
  navigation,
  route,
}: ClinicListNavigatorProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(userInfoSelector);
  const [clinicList, setClinicList] = React.useState<IClinicInfo | any>(null);
  const [showLoading, setShowLoading] = React.useState<boolean>(false);
  const toast = useToast();
  React.useEffect(() => {
    // Call API to get active clinic
    const getActiveClinic = async () => {
      try {
        const response = await clinicService.getAllClinic();
        let activeClinic: IClinicInfo[] = [];
        if (response.data) {
          // Get all clinic with status = 3 (active)
          response.data.map((clinicItem: IClinicInfo) => {
            activeClinic.push(clinicItem);
          });
        }
        setClinicList(activeClinic);
      } catch (error) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Lỗi"
                description="Không có phòng khám. Vui lòng thử lại sau."
                status="error"
              />
            );
          },
        });
      }
    };
    setShowLoading(true);
    getActiveClinic();
    setShowLoading(false);
  }, []);
  const handleGoToClinic = (clinicItem: IClinicInfo) => {
    setClinic(clinicItem);
    dispatch(changeClinic(clinicItem));
    navigation.navigate("ClinicInfoNavigator", { clinic: clinicItem });
  };

  const { clinic, setClinic } = route.params;
  return (
    <VStack
      space={5}
      maxW="90%"
      minW="90%"
      mt="5%"
      maxH="95%"
      minH="95%"
      alignSelf="center"
    >
      {!showLoading && clinicList?.length ? (
        <Box
          alignSelf="center"
          backgroundColor={appColor.white}
          borderRadius={20}
          width="full"
          height="full"
          p={5}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <Heading fontSize={20} mb={3}>
              Danh sách phòng khám
            </Heading>
            <Pressable
              onPress={() => {
                navigation.navigate("SubscriptionNavigator");
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={25}
                color={appColor.primary}
              />
            </Pressable>
          </HStack>
          <ScrollView>
            <VStack space={5}>
              {clinicList.map((clinicItem: IClinicInfo, index: any) => {
                return (
                  <VStack
                    key={index}
                    backgroundColor="#DAD9FF"
                    borderRadius={15}
                    p={3}
                  >
                    {/** Clinic info and image */}
                    <HStack>
                      <VStack flex={3}>
                        <Text
                          color={appColor.textTitle}
                          fontWeight="bold"
                          fontSize={20}
                        >
                          {clinicItem.name}
                        </Text>
                        <Text color={appColor.textSecondary} fontSize={14}>
                          <Text
                            color={appColor.textTitle}
                            fontSize={14}
                            fontWeight="bold"
                          >
                            SĐT:{" "}
                          </Text>
                          {clinicItem.phone}
                        </Text>
                        <Text color={appColor.textSecondary} fontSize={14}>
                          <Text
                            color={appColor.textTitle}
                            fontSize={14}
                            fontWeight="bold"
                          >
                            Đ/c:{" "}
                          </Text>
                          {clinicItem.address}
                        </Text>
                      </VStack>
                      <VStack flex={1} justifyContent="flex-start">
                        <Image
                          source={
                            clinicItem?.logo
                              ? { uri: clinicItem.logo }
                              : require("../../assets/images/clinics/default_image_clinic.png")
                          }
                          borderRadius={100}
                          alt={clinicItem.name}
                          size={16}
                          alignSelf="center"
                        />
                      </VStack>
                    </HStack>
                    {/**Status and navigation button */}
                    <HStack justifyContent="space-between" alignItems="center">
                      {clinicItem.subscriptions[0].status === 3 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="green.600">
                            Đang kích hoạt
                          </Text>
                          <Button
                            onPress={() => {
                              handleGoToClinic(clinicItem);
                            }}
                            flex={1}
                          >
                            Đi đến
                          </Button>
                        </>
                      )}
                      {clinicItem.subscriptions[0].status === 2 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="red.600">
                            Đã hết hạn
                          </Text>
                          <Button flex={1}>Gia hạn</Button>
                        </>
                      )}
                      {clinicItem.subscriptions[0].status === 1 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="red.600">
                            Đang thanh toán
                          </Text>
                          <Button flex={1}>Thanh toán</Button>
                        </>
                      )}
                      {clinicItem.subscriptions[0].status === 4 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="amber.600">
                            Cancel
                          </Text>
                          <Button flex={1}>status = 4</Button>
                        </>
                      )}
                      {clinicItem.subscriptions[0].status === 5 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="amber.600">
                            Pending
                          </Text>
                          <Button flex={1}>status = 5</Button>
                        </>
                      )}
                    </HStack>
                  </VStack>
                );

                return (
                  <HStack
                    key={index}
                    backgroundColor="#DAD9FF"
                    borderRadius={15}
                    p={3}
                  >
                    <HStack
                      flex={3}
                      alignItems="center"
                      justifyContent="space-between"
                    >
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
                      </VStack>
                    </HStack>
                    <VStack flex={1}>
                      <Image
                        source={require("../../assets/images/clinics/default_image_clinic.png")}
                        borderRadius={100}
                        alt={clinicItem.name}
                        size={16}
                      />
                    </VStack>
                  </HStack>
                );
              })}
            </VStack>
          </ScrollView>
        </Box>
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
    </VStack>
  );
}
