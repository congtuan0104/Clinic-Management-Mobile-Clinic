import { Box, HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { clinicServiceApi } from "../../services";
import { useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import UpdateServiceModal from "./UpdateServiceModal";
import AddServiceModal from "./AddServiceModal";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { appColor } from "../../theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { IClinicService } from "../../types";
import DeleteDialog from "./DeleteDialog";
import { CategoryPriceNavigatorProps } from "../../Navigator/UserNavigator";
import { Searchbar } from "react-native-paper";

export default function StaffDashboardScreen({
  navigation,
  route,
}: CategoryPriceNavigatorProps) {
  const clinic = useAppSelector(ClinicSelector);
  const [clinicServiceList, setClinicServiceList] = useState<IClinicService[]>(
    []
  );
  const [searchFilterList, setSearchFilterList] = useState<IClinicService[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenAddServiceModal, setIsOpenAddServiceModal] =
    useState<boolean>(false);
  const [isOpenServiceModal, setIsOpenServiceModal] = useState<boolean>(false);
  const [service, setService] = useState<IClinicService>();
  const [expanded, setExpanded] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isReRender, setIsReRender] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeTextHandler = (query: string) => {
    setSearchQuery(query); // Cập nhật giá trị của searchQuery
    filterList(query);
  };
  const handleReRender = () => setIsReRender(!isReRender);
  const onCloseDialog = () => setIsOpenDialog(false);

  const handlePress = () => setExpanded(!expanded);

  const handleSetService = async (item: IClinicService) => setService(item);
  const handleOpenUpdateModal = async (item: IClinicService) => {
    await handleSetService(item);
    setIsOpenServiceModal(true);
  };
  const handleDeleteButton = async (item: IClinicService) => {
    await handleSetService(item);
    setIsOpenDialog(true);
  };
  function filterList(text: string) {
    if (text !== "") {
      setSearchFilterList(
        clinicServiceList.filter((item) =>
          item.serviceName.toUpperCase().includes(text.toUpperCase())
        )
      );
    } else setSearchFilterList([]);
  }
  const getClinicServiceList = async () => {
    try {
      if (clinic?.id) {
        const response = await clinicServiceApi.getClinicServices(clinic!.id);
        //console.log('response: ', response);
        if (response.status && response.data) {
          setClinicServiceList(response.data);
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getClinicServiceList();
  }, [clinic?.id, isReRender]);

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
        placeholder="Tìm kiếm"
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
      {clinicServiceList?.length ? (
        <>
          <HStack
            width="full"
            justifyContent="space-between"
            alignItems="center"
            mt={-3}
          >
            <Text my="2" fontWeight="bold" fontSize={20}>
              Bảng giá dịch vụ
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
                    (serviceItem: IClinicService, index: number) => {
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
                              {serviceItem.serviceName}
                            </Text>
                            <HStack space={2} alignItems="center">
                              <Pressable
                                onPress={() =>
                                  handleOpenUpdateModal(serviceItem)
                                }
                              >
                                <FontAwesome5
                                  name="edit"
                                  size={18}
                                  color={appColor.primary}
                                />
                              </Pressable>
                              <Pressable
                                onPress={() => handleDeleteButton(serviceItem)}
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
                                Giá dịch vụ:
                              </Text>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Trạng thái:
                              </Text>
                            </VStack>
                            <VStack>
                              <Text color={appColor.textSecondary}>
                                {serviceItem.price + "đ"}
                              </Text>
                              <Text color={appColor.textSecondary}>
                                {serviceItem.isDisabled
                                  ? "Không hoạt động"
                                  : "Đang hoạt động"}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                      );
                    }
                  )
                : clinicServiceList.map(
                    (serviceItem: IClinicService, index: number) => {
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
                              {serviceItem.serviceName}
                            </Text>
                            <HStack space={2} alignItems="center">
                              <Pressable
                                onPress={() =>
                                  handleOpenUpdateModal(serviceItem)
                                }
                              >
                                <FontAwesome5
                                  name="edit"
                                  size={18}
                                  color={appColor.primary}
                                />
                              </Pressable>
                              <Pressable
                                onPress={() => handleDeleteButton(serviceItem)}
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
                                Giá dịch vụ:
                              </Text>
                              <Text
                                fontWeight="bold"
                                color={appColor.textSecondary}
                              >
                                Trạng thái:
                              </Text>
                            </VStack>
                            <VStack>
                              <Text color={appColor.textSecondary}>
                                {serviceItem.price + "đ"}
                              </Text>
                              <Text color={appColor.textSecondary}>
                                {serviceItem.isDisabled
                                  ? "Không hoạt động"
                                  : "Đang hoạt động"}
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
        <UpdateServiceModal
          isOpen={isOpenServiceModal}
          onClose={() => {
            setIsOpenServiceModal(false);
          }}
          service={service}
          handleReRender={handleReRender}
        />
      ) : null}
      {service && isOpenDialog ? (
        <DeleteDialog
          isOpen={isOpenDialog}
          onClose={onCloseDialog}
          service={service}
          handleReRender={handleReRender}
        />
      ) : null}
      <AddServiceModal
        isOpen={isOpenAddServiceModal}
        onClose={() => {
          setIsOpenAddServiceModal(false);
        }}
        handleReRender={handleReRender}
      />
    </Box>
  );
}
