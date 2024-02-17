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
import { medicalSuppliesServices } from "../../services";
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
import AddMedicalSupplyModal from "./AddMedicalSupplyModal";
import UpdateMedicalSupplyModal from "./UpdateMedicalSupplyModal";
import DeleteMedicalSupplyDialog from "./DeleteDialog";

export default function MedicalSuppliesScreen({
  navigation,
  route,
}: MedicalSuppliesNavigatorProps) {
  const clinic = useAppSelector(ClinicSelector);
  const toast = useToast();
  const [isReRender, setIsReRender] = useState(false);
  const [medicalSuppliesList, setMedicalSuppliesList] = useState<
    IMedicalSupplies[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilterList, setSearchFilterList] = useState<IMedicalSupplies[]>(
    []
  );
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenAddServiceModal, setIsOpenAddServiceModal] =
    useState<boolean>(false);
  const [service, setService] = useState<IMedicalSupplies>();
  const [isOpenServiceModal, setIsOpenServiceModal] = useState<boolean>(false);

  function filterList(text: string) {
    if (text !== "") {
      setSearchFilterList(
        medicalSuppliesList.filter((item) =>
          item.medicineName.toUpperCase().includes(text.toUpperCase())
        )
      );
    } else setSearchFilterList([]);
  }
  const onChangeTextHandler = (query: string) => {
    setSearchQuery(query); // Cập nhật giá trị của searchQuery
    filterList(query);
  };
  const handleReRender = () => setIsReRender(!isReRender);
  const onCloseDialog = () => setIsOpenDialog(false);

  const handleOpenUpdateModal = async (item: IMedicalSupplies) => {
    await handleSetService(item);
    setIsOpenServiceModal(true);
  };
  const handleDeleteButton = async (item: IMedicalSupplies) => {
    await handleSetService(item);
    setIsOpenDialog(true);
  };
  const handleSetService = async (item: IMedicalSupplies) => setService(item);
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
      borderRadius={20}
      mt="5%"
    >
      <Searchbar
        style={{ height: 40, marginBottom: 15 }}
        placeholder="Tìm kiếm thuốc, vật tư"
        onChangeText={onChangeTextHandler}
        value={searchQuery}
        inputStyle={{
          paddingBottom: 20,
          paddingTop: 5,
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
            <Pressable
              onPress={() => {
                setIsOpenAddServiceModal(true);
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
                              <Pressable
                                onPress={() =>
                                  handleOpenUpdateModal(medicalSupply)
                                }
                              >
                                <FontAwesome5
                                  name="edit"
                                  size={18}
                                  color={appColor.primary}
                                />
                              </Pressable>
                              <Pressable
                                onPress={() =>
                                  handleDeleteButton(medicalSupply)
                                }
                              >
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
                              <Pressable
                                onPress={() =>
                                  handleOpenUpdateModal(medicalSupply)
                                }
                              >
                                <FontAwesome5
                                  name="edit"
                                  size={18}
                                  color={appColor.primary}
                                />
                              </Pressable>
                              <Pressable
                                onPress={() =>
                                  handleDeleteButton(medicalSupply)
                                }
                              >
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
      {service && isOpenServiceModal ? (
        <UpdateMedicalSupplyModal
          isOpen={isOpenServiceModal}
          onClose={() => {
            setIsOpenServiceModal(false);
          }}
          service={service} // service <=> medical supply
          handleReRender={handleReRender}
        />
      ) : null}
      {service && isOpenDialog ? (
        <DeleteMedicalSupplyDialog
          isOpen={isOpenDialog}
          onClose={onCloseDialog}
          service={service}
          handleReRender={handleReRender}
        />
      ) : null}
      <AddMedicalSupplyModal
        isOpen={isOpenAddServiceModal}
        onClose={() => {
          setIsOpenAddServiceModal(false);
        }}
        handleReRender={handleReRender}
      />
    </Box>
  );
}
