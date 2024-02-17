import { Box, HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { patientApi } from "../../services";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import { IRole } from "../../types/role.types";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { appColor } from "../../theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { IClinicMember, IPatient } from "../../types";
//import AddStaffModal from "./AddStaffModal";

import { PatientDashboardProps } from "../../Navigator/PatientNavigator";

export default function PatientScreen({
  navigation,
  route,
}: PatientDashboardProps) {
  const clinic = useAppSelector(ClinicSelector);

  const [patientList, setPatientList] = useState<IPatient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenAddStaffModal, setIsOpenAddStaffModal] =
    useState<boolean>(false);
  const getPatientList = async () => {
    try {
      if (clinic?.id)
      {
        const response = await patientApi.getPatients({ clinicId: clinic?.id });
        console.log('response: ', response);
        if (response.status && response.data) {
            setPatientList(response.data)
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPatientList();
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
      {patientList?.length ? (
        <>
          <HStack
            width="full"
            justifyContent="space-between"
            alignItems="center"
            mt={-3}
          >
            <Text my="2" fontWeight="bold" fontSize={20}>
              Danh sách bệnh nhân
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
              {patientList.map((patient: IPatient, index: number) => {
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
                        {patient? patient.firstName + " " + patient.lastName : null}
                      </Text>
                      <HStack space={2} alignItems="center">                       
                          <>
                            <Pressable
                              onPress={() => {
                                navigation.navigate("PatientInfoNavigator", { patient });
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
                                //navigation.navigate("StaffSchedule");
                              }}
                            >
                              <MaterialIcons
                                name="delete"
                                size={24}
                                color={appColor.primary}
                              />
                            </Pressable>
                          </>
                        
                      </HStack>
                    </HStack>
                    
                    <HStack space={4} mt={2}>
                      <VStack>
                        <Text fontWeight="bold" color={appColor.textSecondary}>
                          Email:
                        </Text>
                        <Text fontWeight="bold" color={appColor.textSecondary}>
                          Trạng thái:
                        </Text>
                      </VStack>
                      <VStack>
                        <Text color={appColor.textSecondary}>
                          {patient? patient.email: null}
                        </Text>
                        <Text color={appColor.textSecondary}>
                          {patient.emailVerified? "Đã xác thực": "Chưa xác thực"}
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
      {/* <AddStaffModal
        isOpen={isOpenAddStaffModal}
        onClose={() => {
          setIsOpenAddStaffModal(false);
        }}
        getStaffList={getStaffList}
      /> */}
    </Box>
  );
}
