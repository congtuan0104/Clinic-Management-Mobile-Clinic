import { Box, HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { medicalRecordApi } from "../../services";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import { IRole } from "../../types/role.types";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { appColor } from "../../theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { IMedicalRecord, IPatient } from "../../types";
import moment from "moment";

//import AddStaffModal from "./AddStaffModal";

import { MedicalRecordNavigatorProps } from "../../Navigator";

export default function PatientScreen({
  navigation,
  route,
}: MedicalRecordNavigatorProps) {
  const patient = route.params?.patient;
  const clinic = useAppSelector(ClinicSelector);

  const [medicalRecordList, setMedicalRecordList] = useState<IMedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IMedicalRecord>()
  const getMedicalRecordList = async () => {
    try {
      if (patient?.id)
      {
        const response = await medicalRecordApi.getMedicalRecords({ patientId: patient?.id });
        console.log('response: ', response);
        if (response.status && response.data) {
            setMedicalRecordList(response.data)
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMedicalRecordList();
  }, [patient?.id]);
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
      {medicalRecordList?.length ? (
        <>
          <HStack
            width="full"
            justifyContent="space-between"
            alignItems="center"
            mt={-3}
          >
            <Text my="2" fontWeight="bold" fontSize={20}>
              Hồ sơ bệnh án
            </Text>
            
          </HStack>
          <ScrollView>
            <VStack space={5}>
              {medicalRecordList.map((record: IMedicalRecord, index: number) => {
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
                        maxWidth={"90%"}
                      >
                        Bác sĩ khám bệnh: {record? record.doctor.firstName + " " + record.doctor.lastName : null}
                      </Text>
                      <HStack space={2} alignItems="center">                       
                          <>
                            <Pressable
                              onPress={() => {
                                navigation.navigate("MedicalRecordDetail", {record: record})
                              }}
                            >
                              <FontAwesome5
                                name="eye"
                                size={18}
                                color={appColor.primary}
                              />
                            </Pressable>
                            {/* <Pressable
                              onPress={() => {
                                //navigation.navigate("StaffSchedule");
                              }}
                            >
                              <MaterialIcons
                                name="delete"
                                size={24}
                                color={appColor.primary}
                              />
                            </Pressable> */}
                          </>
                        
                      </HStack>
                    </HStack>
                    
                    <HStack space={4} mt={2}>
                      <VStack>
                        <Text fontWeight="bold" color={appColor.textSecondary}>
                          Chẩn đoán:
                        </Text>
                        <Text fontWeight="bold" color={appColor.textSecondary}>
                          Ngày khám:
                        </Text>
                      </VStack>
                      <VStack>
                        <Text color={appColor.textSecondary}>
                          {record? record.diagnose: null}
                        </Text>
                        <Text color={appColor.textSecondary}>
                          {record.dateCreated? moment(record.dateCreated).format('DD/MM/YYYY'): null}
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
      
    </Box>
  );
}
