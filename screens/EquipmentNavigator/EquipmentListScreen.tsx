import {
  Box,
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useEffect, useState, useCallback } from "react";
import { clinicServiceApi, medicalSuppliesServices } from "../../services";
import { useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { appColor } from "../../theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { IClinicService } from "../../types";
import { Searchbar } from "react-native-paper";
import { MedicalSuppliesNavigatorProps } from "../../Navigator/UserNavigator";
import { IMedicalSupplies } from "../../types/medical-supplies.types";
import ToastAlert from "../../components/Toast/Toast";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";

export default function MedicalSuppliesScreen({
  navigation,
  route,
}: MedicalSuppliesNavigatorProps) {
  const clinic = useAppSelector(ClinicSelector);
  const toast = useToast();

  const [medicalSuppliesList, setMedicalSuppliesList] = useState<
    IMedicalSupplies[]
  >([]);
  const [searchFilterList, setSearchFilterList] = useState<IMedicalSupplies[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getClinicServiceList = async () => {
    try {
      if (clinic?.id) {
        const response = await medicalSuppliesServices.getMedicalSupplies(
          clinic.id
        );
        if (response.status && response.data) {
          setMedicalSuppliesList(response.data);
          setSearchFilterList(response.data);
        } else {
          setMedicalSuppliesList([]);
          setSearchFilterList([]);
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Lỗi"
              description={error.response.data.message}
              status="error"
            />
          );
        },
      });
    }
  };
  useFocusEffect(
    useCallback(() => {
      getClinicServiceList();
    }, [clinic?.id])
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
      borderRadius={20}
      mt="5%"
    >
      <Searchbar
        style={{ height: 40, marginBottom: 15 }}
        placeholder="Tìm kiếm thuốc, vật tư"
        onChangeText={() => {}}
        value={"zz"}
        inputStyle={{
          paddingBottom: 20,
          paddingTop: 5,
          fontFamily: "Montserrat-SemiBold",
          fontSize: 15,
          color: appColor.textTitle,
        }}
        placeholderTextColor={appColor.textSecondary}
      />
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      {medicalSuppliesList?.length ? (
        <>
          <HStack
            width="full"
            justifyContent="space-between"
            alignItems="center"
            mt={-3}
          >
            <Text my="2" fontWeight="bold" fontSize={20}>
              Kho thuốc, vật tư
            </Text>
            <Pressable onPress={() => {}}>
              <Ionicons
                name="add-circle-outline"
                size={25}
                color={appColor.primary}
              />
            </Pressable>
          </HStack>
          <ScrollView>
            <VStack space={5}>
              {searchFilterList.length
                ? searchFilterList.map(
                    (medicalSupply: IMedicalSupplies, index: number) => {
                      return (
                        <Box
                          borderRadius={20}
                          backgroundColor={appColor.background}
                          key={index}
                          p={3}
                          minW="100%"
                          maxW="100%"
                        >
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Text
                              fontWeight="bold"
                              color={appColor.textTitle}
                              fontSize={16}
                              maxWidth={"70%"}
                            >
                              {medicalSupply.medicineName}
                            </Text>
                            <HStack space={2} alignItems="center">
                              <Pressable onPress={() => {}}>
                                <FontAwesome5
                                  name="edit"
                                  size={18}
                                  color={appColor.primary}
                                />
                              </Pressable>
                              <Pressable onPress={() => {}}>
                                <MaterialIcons
                                  name="delete"
                                  size={24}
                                  color={appColor.primary}
                                />
                              </Pressable>
                            </HStack>
                          </HStack>

                          <HStack space={4} mt={2}>
                            <VStack>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Loại vật tư:
                              </Text>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Số lượng tồn:
                              </Text>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Nhà sản xuất:
                              </Text>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Hạn sử dụng:
                              </Text>
                            </VStack>
                            <VStack>
                              <Text color={appColor.textSecondary}>
                                {medicalSupply.categoryName}
                              </Text>
                              <Text color={appColor.textSecondary}>
                                {medicalSupply.stock} {medicalSupply.unit}
                              </Text>
                              <Text color={appColor.textSecondary}>
                                {medicalSupply.vendor
                                  ? medicalSupply.vendor
                                  : "Không có"}
                              </Text>
                              <Text color={appColor.textSecondary}>
                                {medicalSupply.expiredAt
                                  ? dayjs(medicalSupply.expiredAt).format(
                                      "DD/MM/YYYY"
                                    )
                                  : "Không có"}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                      );
                    }
                  )
                : medicalSuppliesList.map(
                    (medicalSupply: IMedicalSupplies, index: number) => {
                      return (
                        <Box
                          borderRadius={20}
                          backgroundColor={appColor.background}
                          key={index}
                          p={3}
                          minW="100%"
                          maxW="100%"
                        >
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Text
                              fontWeight="bold"
                              color={appColor.textTitle}
                              fontSize={16}
                              maxWidth={"70%"}
                            >
                              {medicalSupply.medicineName}
                            </Text>
                            <HStack space={2} alignItems="center">
                              <Pressable onPress={() => {}}>
                                <FontAwesome5
                                  name="edit"
                                  size={18}
                                  color={appColor.primary}
                                />
                              </Pressable>
                              <Pressable onPress={() => {}}>
                                <MaterialIcons
                                  name="delete"
                                  size={24}
                                  color={appColor.primary}
                                />
                              </Pressable>
                            </HStack>
                          </HStack>

                          <HStack space={4} mt={2}>
                            <VStack>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Loại vật tư:
                              </Text>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Số lượng tồn:
                              </Text>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Nhà sản xuất:
                              </Text>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Hạn sử dụng:
                              </Text>
                            </VStack>
                            <VStack>
                              <Text color={appColor.textSecondary}>
                                {medicalSupply.categoryName}
                              </Text>
                              <Text color={appColor.textSecondary}>
                                {medicalSupply.stock} {medicalSupply.unit}
                              </Text>
                              <Text color={appColor.textSecondary}>
                                {medicalSupply.vendor
                                  ? medicalSupply.vendor
                                  : "Không có"}
                              </Text>
                              <Text color={appColor.textSecondary}>
                                {medicalSupply.expiredAt
                                  ? dayjs(medicalSupply.expiredAt).format(
                                      "DD/MM/YYYY"
                                    )
                                  : "Không có"}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                      );
                    }
                  )}
            </VStack>
          </ScrollView>
        </>
      ) : (
        <Text>Danh sách rỗng</Text>
      )}
    </Box>
  );
}
