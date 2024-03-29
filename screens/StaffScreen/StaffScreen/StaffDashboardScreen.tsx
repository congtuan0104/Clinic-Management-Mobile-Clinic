import { Box, HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { clinicService } from "../../../services";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { ClinicSelector } from "../../../store";
import { IRole } from "../../../types/role.types";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { appColor } from "../../../theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { IClinicMember } from "../../../types/staff.types";
import AddStaffModal from "./AddStaffModal";
import { StaffDashboardScreenProps } from "../../../Navigator/StaffInfoNavigator";
import { useFocusEffect } from "@react-navigation/native";

export default function StaffDashboardScreen({
  navigation,
  route,
}: StaffDashboardScreenProps) {
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
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      {staffList?.length ? (
        <>
          <HStack
            width="full"
            justifyContent="flex-start"
            alignItems="center"
            mt={0}
            mb={3}
          >
            <Pressable
              onPress={() => {
                setIsOpenAddStaffModal(true);
              }}
              mr={2}
            >
              <Ionicons
                name="add-circle-outline"
                size={25}
                color={appColor.primary}
              />
            </Pressable>
            <Text color={appColor.inputLabel} fontWeight="bold" fontSize={16}>
              Thêm nhân viên
            </Text>
          </HStack>
          <ScrollView>
            <VStack space={5}>
              {staffList.map((staff: IClinicMember, index: number) => {
                return (
                  <Box
                    borderRadius={20}
                    backgroundColor={appColor.background}
                    key={index}
                    p={3}
                    minW="100%"
                    maxW="100%"
                  >
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text
                        fontWeight="bold"
                        color={appColor.textTitle}
                        fontSize={16}
                      >
                        {staff.users
                          ? staff.users.firstName + " " + staff.users.lastName
                          : null}
                      </Text>
                      <HStack space={2} alignItems="center">
                        {staff.role.name !== "Admin" && (
                          <>
                            <Pressable
                              onPress={() => {
                                navigation.navigate("StaffInfo", { staff });
                              }}
                            >
                              <FontAwesome5
                                name="eye"
                                size={18}
                                color={appColor.primary}
                              />
                            </Pressable>
                            <Pressable
                              onPress={() => {
                                // navigation.navigate("StaffSchedule");
                              }}
                            >
                              <MaterialIcons
                                name="delete"
                                size={24}
                                color={appColor.primary}
                              />
                            </Pressable>
                          </>
                        )}
                      </HStack>
                    </HStack>
                    {staff.role.name === "Admin" && (
                      <Text fontWeight="bold" color="#ca3c0c">
                        Chủ phòng khám
                      </Text>
                    )}
                    <HStack space={4} mt={2}>
                      <VStack>
                        <Text fontWeight="bold" color={appColor.textSecondary}>
                          Email:
                        </Text>
                        <Text fontWeight="bold" color={appColor.textSecondary}>
                          Vai trò:
                        </Text>
                      </VStack>
                      <VStack>
                        <Text color={appColor.textSecondary}>
                          {staff.users ? staff.users.email : null}
                        </Text>
                        <Text color={appColor.textSecondary}>
                          {staff.role.name}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          </ScrollView>
        </>
      ) : (
        <Text>Danh sách rỗng</Text>
      )}
      <AddStaffModal
        isOpen={isOpenAddStaffModal}
        onClose={() => {
          setIsOpenAddStaffModal(false);
        }}
        handleReRender={handleReRender}
      />
    </Box>
  );
}
