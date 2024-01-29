import { Box, HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
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

export default function StaffDashboardScreen({
  navigation,
  route,
}: StaffDashboardScreenProps) {
  const clinic = useAppSelector(ClinicSelector);

  const [staffList, setStaffList] = useState<IClinicMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenAddStaffModal, setIsOpenAddStaffModal] =
    useState<boolean>(false);
  const getStaffList = async () => {
    try {
      const response = await clinicService.getClinicMember(clinic?.id);
      if (response.status && response.data) {
        setStaffList(response.data);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStaffList();
  }, [clinic?.id]);
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
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      {staffList?.length ? (
        <>
          <HStack
            width="full"
            justifyContent="space-between"
            alignItems="center"
            mt={-3}
          >
            <Text my="2" fontWeight="bold" fontSize={20} alignSelf="flex-start">
              Danh sách nhân viên
            </Text>
            <Pressable
              onPress={() => {
                setIsOpenAddStaffModal(true);
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
                        {staff.lastName + " " + staff.firstName}
                      </Text>
                      <HStack space={2} alignItems="center">
                        {!staff.isOwner && (
                          <>
                            <Pressable
                              onPress={() => {
                                navigation.navigate("StaffInfo", { staff });
                              }}
                            >
                              <FontAwesome5
                                name="edit"
                                size={18}
                                color={appColor.primary}
                              />
                            </Pressable>
                            <Pressable
                              onPress={() => {
                                navigation.navigate("StaffSchedule");
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
                    {staff.isOwner && (
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
                          {staff.email}
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
        getStaffList={getStaffList}
      />
    </Box>
  );
}
