import React, { useCallback } from "react";
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
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import PaymentModal from "./PaymentModal";
import { useFocusEffect } from "@react-navigation/native";
// import MapBox from "../../components/Mapbox/Mapbox";

export default function ClinicListNavigator({
  navigation,
  route,
}: ClinicListNavigatorProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(userInfoSelector);
  const [clinicList, setClinicList] = React.useState<IClinicInfo | any>(null);
  const [showLoading, setShowLoading] = React.useState<boolean>(false);
  const toast = useToast();
  const [openPaymentModal, setOpenPaymentModal] =
    React.useState<boolean>(false);
  const [chosenClinic, setChosenClinic] = React.useState<IClinicInfo>();
  useFocusEffect(
    useCallback(() => {
      setShowLoading(true);
      getActiveClinic();
      setShowLoading(false);
    }, [])
  );
  const getActiveClinic = async () => {
    try {
      const response = await clinicService.getAllClinic(
        user?.id,
        user?.moduleId
      );
      let activeClinic: IClinicInfo[] = [];
      if (response.data) {
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
              description="Có lỗi xảy ra. Vui lòng thử lại sau."
              status="error"
            />
          );
        },
      });
    }
  };
  const handleGoToClinic = (clinicItem: IClinicInfo) => {
    setClinic(clinicItem);
    dispatch(changeClinic(clinicItem));
    navigation.navigate("ClinicInfoNavigator", { clinic: clinicItem });
  };

  const handleRenewSubscription = (clinicItem: IClinicInfo) => {
    alert("Gia hạn gói!");
  };
  const handleActiveClinic = (clinicItem: IClinicInfo) => {
    setChosenClinic(clinicItem);
    setOpenPaymentModal(true);
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
            {user?.moduleId === 2 && (
              <Pressable
                onPress={() => {
                  navigation.navigate("SubscriptionNavigator");
                }}
                mb={3}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={25}
                  color={appColor.primary}
                />
              </Pressable>
            )}
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
                    <HStack justifyContent="space-between" alignItems="center">
                      <VStack flex={3}>
                        <Text
                          color={appColor.textTitle}
                          fontWeight="bold"
                          fontSize={20}
                          textAlign="left"
                        >
                          {clinicItem.name}
                        </Text>
                        <Text color={appColor.textTitle} fontSize={14}>
                          <Text
                            color={appColor.textTitle}
                            fontSize={14}
                            fontWeight="bold"
                          >
                            Địa chỉ:{" "}
                          </Text>
                          {clinicItem?.address}
                        </Text>
                        {clinicItem?.subscriptions[0]?.status === 3 && (
                          <>
                            <Text color={appColor.textTitle} fontSize={14}>
                              <Text
                                color={appColor.textTitle}
                                fontSize={14}
                                fontWeight="bold"
                              >
                                Thời hạn:{" "}
                              </Text>
                              {dayjs(
                                clinicItem.subscriptions[0].expiredAt
                              ).format("DD/MM/YYYY")}{" "}
                            </Text>
                            <Text color={appColor.textTitle} fontSize={14}>
                              <Text>(Còn lại </Text>
                              {dayjs(
                                clinicItem.subscriptions[0].expiredAt
                              ).diff(dayjs(), "day")}
                              <Text> ngày)</Text>
                            </Text>
                          </>
                        )}
                      </VStack>
                    </HStack>
                    {/**Status and navigation button */}
                    <HStack justifyContent="space-between" alignItems="center">
                      {clinicItem?.subscriptions[0]?.status === 3 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="green.600">
                            Đang kích hoạt
                          </Text>
                          <Button
                            onPress={() => {
                              handleGoToClinic(clinicItem);
                            }}
                            flex={1}
                            p={1}
                          >
                            Xem
                          </Button>
                        </>
                      )}
                      {clinicItem?.subscriptions[0]?.status === 2 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="red.600">
                            Đã hết hạn
                          </Text>
                          <Button
                            flex={1}
                            p={1}
                            onPress={() => {
                              handleRenewSubscription(clinicItem);
                            }}
                          >
                            Gia hạn
                          </Button>
                        </>
                      )}
                      {clinicItem?.subscriptions[0]?.status === 1 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="red.600">
                            Đang thanh toán
                          </Text>
                          <Button flex={1} p={1}>
                            Thanh toán
                          </Button>
                        </>
                      )}
                      {clinicItem?.subscriptions[0]?.status === 4 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="amber.600">
                            Chưa kích hoạt
                          </Text>
                          <Button
                            onPress={() => {
                              handleActiveClinic(clinicItem);
                            }}
                            flex={1}
                            p={1}
                          >
                            Kích hoạt
                          </Button>
                        </>
                      )}
                      {clinicItem?.subscriptions[0]?.status === 5 && (
                        <>
                          <Text flex={3} fontWeight="bold" color="amber.600">
                            Pending
                          </Text>
                          <Button flex={1} p={1}>
                            status = 5
                          </Button>
                        </>
                      )}
                    </HStack>
                  </VStack>
                );
              })}
            </VStack>
          </ScrollView>
          <PaymentModal
            isOpen={openPaymentModal}
            onClose={() => {
              setOpenPaymentModal(false);
            }}
            chosenClinic={chosenClinic}
          />
        </Box>
      ) : !showLoading && !clinicList?.length ? (
        <VStack space={5} my={5}>
          <Box
            width="90%"
            height="90%"
            minH="90%"
            maxH="90%"
            alignSelf="center"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <Heading fontSize={20} mb={3}>
                Danh sách phòng khám
              </Heading>
              {user?.moduleId === 2 && (
                <Pressable
                  onPress={() => {
                    navigation.navigate("SubscriptionNavigator");
                  }}
                  mb={3}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={25}
                    color={appColor.primary}
                  />
                </Pressable>
              )}
            </HStack>
            <Text fontSize={20} color="gray.500">
              Hiện tại bạn chưa có hoặc tham gia bất kì phòng khám nào
            </Text>
          </Box>
        </VStack>
      ) : (
        <LoadingSpinner
          showLoading={showLoading}
          setShowLoading={setShowLoading}
        />
      )}
    </VStack>
  );
}
