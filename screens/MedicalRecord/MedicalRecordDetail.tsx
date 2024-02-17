import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  HStack,
  Heading,
  Input,
  Modal,
  ScrollView,
  Select,
  Text,
  VStack,
  View,
  WarningOutlineIcon,
  useToast,
  Image,
} from "native-base";
import moment from "moment";
import { AntDesign } from '@expo/vector-icons';
import { ClinicSelector, } from "../../store";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import PrescriptionModal from './PrescriptionModal'
import MedicalRecordServiceModal from './MedicalRecordServiceModal'
import { useAppSelector } from "../../hooks";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { appColor } from "../../theme";
import { MedicalRecordDetailProps } from "../../Navigator";
import {
  ICategory,
  IMedicalRecord,
  IPostClinicServiceParams,
} from "../../types";

const chevronDown = require("../../assets/chevron_down.png");

interface IFormData {
  dateCreated: string;
  height?: string;
  weight?: string;
  bloodPressure?: string;
  temperature?: string;
  diagnose?: string;
  result?: string;
  note?: string;
  doctor: string;
}

// Validate
const schema = yup.object().shape({
  dateCreated: yup.string(),
  height: yup.string(),
  weight: yup.string(),
  bloodPressure: yup.string(),
  temperature: yup.string(),
  diagnose: yup.string(),
  result: yup.string(),
  note: yup.string(),
  doctor: yup.string(),
});

export default function MedicalRecordDetail({
  navigation,
  route,
}: MedicalRecordDetailProps) {
  const toast = useToast();
  const record = route.params.record;
  const clinic = useAppSelector(ClinicSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenPrescriptionModal, setIsOpenPrescriptionModal] = useState<boolean>(false)
  const [isOpenMedicalServiceModal, setIsOpenMedicalServiceModal] = useState<boolean>(false)

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dateCreated: moment(record.dateCreated).format("DD/MM/YYYY"),
      height: record.height ? record.height.toString() : "",
      weight: record.weight ? record.weight.toString() : "",
      bloodPressure: record.bloodPressure
        ? record.bloodPressure.toString()
        : "",
      temperature: record.temperature ? record.temperature.toString() : "",
      diagnose: record.diagnose ? record.diagnose : "",
      result: record.result ? record.result : "",
      note: record.note ? record.note : "",
      doctor: record.doctor
        ? record.doctor.firstName + " " + record.doctor.lastName
        : "",
    },
  });

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Box
      bgColor="#fff"
      minWidth="90%"
      maxWidth="90%"
      minHeight="95%"
      maxHeight="95%"
      alignSelf="center"
      alignItems="center"
      p={5}
      borderRadius={20}
    >
        <PrescriptionModal 
            isOpen={isOpenPrescriptionModal} 
            onClose={() => setIsOpenPrescriptionModal(false)}
            prescriptionList={record.prescriptionDetail}
            />
        <MedicalRecordServiceModal
            isOpen={isOpenMedicalServiceModal}
            onClose={() => setIsOpenMedicalServiceModal(false)}
            medicalServiceList={record.medicalRecordServices}
            />
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Heading mb={2}>Hồ sơ bệnh án</Heading>

      <ScrollView minWidth="100%" maxWidth="100%">
        <VStack space={5}>
          <FormControl
            isRequired
            isInvalid={errors.dateCreated ? true : false}
            isReadOnly={true}
          >
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Ngày khám
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder=""
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="dateCreated"
            />
          </FormControl>
          {/**Chiều cao*/}
          <FormControl
            isRequired
            isInvalid={errors.height ? true : false}
            isReadOnly={true}
          >
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Chiều cao
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder=""
                  onChangeText={onChange}
                  value={value ? value : ""}
                  onBlur={onBlur}
                />
              )}
              name="height"
            />
          </FormControl>
          {/**Cân nặng*/}
          <FormControl
            isRequired
            isInvalid={errors.weight ? true : false}
            isReadOnly={true}
          >
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Cân nặng
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder=""
                  onChangeText={onChange}
                  value={value ? value : ""}
                  onBlur={onBlur}
                />
              )}
              name="weight"
            />
          </FormControl>
          {/* huyết áp */}
          <FormControl
            isRequired
            isInvalid={errors.bloodPressure ? true : false}
            isReadOnly={true}
          >
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Huyết áp
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder=""
                  onChangeText={onChange}
                  value={value ? value : ""}
                  onBlur={onBlur}
                />
              )}
              name="bloodPressure"
            />
          </FormControl>

          {/* Nhiệt độ */}
          <FormControl
            isRequired
            isInvalid={errors.temperature ? true : false}
            isReadOnly={true}
          >
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Nhiệt độ
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder=""
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="temperature"
            />
          </FormControl>
          {/* Bác sĩ */}
          <FormControl
            isRequired
            isInvalid={errors.doctor ? true : false}
            isReadOnly={true}
          >
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Bác sĩ khám bệnh
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder=""
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="doctor"
            />
          </FormControl>
          {/* Chẩn đoán */}
          <FormControl
            isRequired
            isInvalid={errors.diagnose ? true : false}
            isReadOnly={true}
          >
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Chẩn đoán
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder=""
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="diagnose"
            />
          </FormControl>
          {/* Ghi chú */}
          <FormControl
            isRequired
            isInvalid={errors.note ? true : false}
            isReadOnly={true}
          >
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Ghi chú
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder=""
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="note"
            />
          </FormControl>
        </VStack>
      </ScrollView>
      <VStack space={3}>
          <Button.Group space={2} marginTop={10}>
            <Button 
            leftIcon={<AntDesign name="printer" size={24} color="white" />}
            bg="#ff8a63" onPress={() => setIsOpenPrescriptionModal(true)}>
              Xem đơn thuốc
            </Button>
            <Button
             leftIcon={<AntDesign name="medicinebox" size={24} color="white" />}
            bg="#ff8a63" onPress={() => setIsOpenMedicalServiceModal(true)}>
              Xem chỉ định dịch vụ
            </Button>
          </Button.Group>
          <Button
            bg="grey"
            onPress={() => {
              navigation.navigate("PatientDashboard");
            }}
          >
            Quay lại
          </Button>
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    width: "100%",
    height: 46,
    backgroundColor: "#F5F5FC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4D4D5",
  },
  dropdown1BtnTxtStyle: { color: "black", textAlign: "left", fontSize: 13 },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    marginTop: -70,
    borderRadius: 15,
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
});
