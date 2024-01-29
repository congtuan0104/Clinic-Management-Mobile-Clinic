import {
  Avatar,
  Box,
  Button,
  FormControl,
  HStack,
  Heading,
  Input,
  ScrollView,
  Text,
  VStack,
  View,
  WarningOutlineIcon,
  useToast,
  Image,
} from "native-base";
import { StyleSheet } from "react-native";

import React, { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { ClinicSelector, updateClinic, userInfoSelector } from "../../store";
import { appColor } from "../../theme";
import ToastAlert from "../../components/Toast/Toast";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAppDispatch, useAppSelector } from "../../hooks";
import * as yup from "yup";
import { IAddPatientInfo } from "../../types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const chevronDown = require("../../assets/chevron_down.png");

// Validate
const schema: yup.ObjectSchema<IAddPatientInfo> = yup.object({
  name: yup.string().required("Tên không được để trống"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  phone: yup.string().required("Số điện thoại không được để trống"),
  birth: yup.string().required("Ngày sinh không được để trống"),
  gender: yup.string().required("Giới tính không được để trống"),
  blood: yup.string(),
  reason: yup.string(),
});

interface AddPatientInfoProps {
  setIsAddPatientInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const dataBlood = ["O", "A", "B", "AB"];
const genderData = ["Nam", "Nữ", "Không rõ"];

const AddPatientInfo: React.FC<AddPatientInfoProps> = ({
  setIsAddPatientInfo,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    console.log("date confirmed: ", date);
    hideDatePicker();
    setSelectedDate(date);
  };
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birth: "",
      gender: "",
      blood: "",
      reason: "",
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = () => {}; // hamf test

  // const onSubmit = async (data: IClinicCreate) => {
  //   const { planId, ...requestData } = data;
  //   try {
  //     if (clinic?.id) {
  //       const response = await clinicService.updateClinicInfo(
  //         clinic?.id,
  //         requestData
  //       );
  //       if (response.status === true && response.data) {
  //         // Call to update data in reducer
  //         dispatch(updateClinic(response.data));
  //         toast.show({
  //           render: () => {
  //             return (
  //               <ToastAlert
  //                 title="Thành công"
  //                 description="Cập nhật phòng khám thành công!"
  //                 status="success"
  //               />
  //             );
  //           },
  //         });

  //       }
  //     } else {
  //       toast.show({
  //         render: () => {
  //           return (
  //             <ToastAlert
  //               title="Lỗi"
  //               description="Không cập nhật được thông tin phòng khám. Vui lòng thử lại sau."
  //               status="error"
  //             />
  //           );
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.show({
  //       render: () => {
  //         return (
  //           <ToastAlert
  //             title="Lỗi"
  //             description="Không cập nhật được thông tin phòng khám. Vui lòng thử lại sau."
  //             status="error"
  //           />
  //         );
  //       },
  //     });
  //   }
  // };

  return (
    <>
      <Box
        bgColor="#fff"
        minWidth="90%"
        maxWidth="90%"
        minHeight="85%"
        maxHeight="85%"
        alignSelf="center"
        alignItems="center"
        p={5}
        borderRadius={20}
      >
        <DateTimePickerModal
          date={selectedDate}
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Heading mb={2}>Nhập thông tin bệnh nhân</Heading>
        <ScrollView
          minWidth="100%"
          maxWidth="100%"
          persistentScrollbar={true}
          nestedScrollEnabled={true}
        >
          <VStack space={5}>
            <VStack space={5}>
              <FormControl isRequired isInvalid={errors.name ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}
                >
                  Họ và tên
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      placeholder="Họ tên bệnh nhân"
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                  name="name"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.name && <Text>{errors.name.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              {/**Email */}
              <FormControl isRequired isInvalid={errors.email ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}
                >
                  Email bệnh nhân
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      placeholder="Nhập email"
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                  name="email"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.email && <Text>{errors.email.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              {/**Phone */}
              <FormControl isRequired isInvalid={errors.phone ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}
                >
                  Số điện thoại
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      placeholder="Nhập SĐT"
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                  name="phone"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.phone && <Text>{errors.phone.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              {/** Ngày sinh */}
              <FormControl isRequired isInvalid={errors.phone ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}
                >
                  Ngày sinh
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      placeholder=""
                      onChangeText={onChange}
                      value={selectedDate
                        ?.toISOString()
                        .substring(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                      onBlur={onBlur}
                      onFocus={showDatePicker}
                    />
                  )}
                  name="birth"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.phone && <Text>{errors.phone.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              {/**Giới tính */}
              <FormControl isRequired isInvalid={errors.phone ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}
                >
                  Giới tính
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SelectDropdown
                      data={genderData}
                      onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index);
                      }}
                      defaultButtonText={"Chọn giới tính"}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={styles.dropdown1BtnStyle}
                      buttonTextStyle={styles.dropdown1BtnTxtStyle}
                      renderDropdownIcon={() => (
                        <Image alt="icon" source={chevronDown} size={18} />
                      )}
                      dropdownIconPosition={"right"}
                      dropdownStyle={styles.dropdown1DropdownStyle}
                      rowStyle={styles.dropdown1RowStyle}
                      rowTextStyle={styles.dropdown1RowTxtStyle}
                    />
                  )}
                  name="gender"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.phone && <Text>{errors.phone.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              {/**Nhóm máu */}
              <FormControl isRequired isInvalid={errors.blood ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}
                >
                  Nhóm máu{" "}
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SelectDropdown
                      data={dataBlood}
                      onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index);
                      }}
                      defaultButtonText={"Chọn nhóm máu"}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={styles.dropdown1BtnStyle}
                      buttonTextStyle={styles.dropdown1BtnTxtStyle}
                      renderDropdownIcon={() => (
                        <Image alt="icon" source={chevronDown} size={18} />
                      )}
                      dropdownIconPosition={"right"}
                      dropdownStyle={styles.dropdown1DropdownStyle}
                      rowStyle={styles.dropdown1RowStyle}
                      rowTextStyle={styles.dropdown1RowTxtStyle}
                    />
                  )}
                  name="blood"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.blood && <Text>{errors.blood.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              {/**Lý do */}
              <FormControl isInvalid={errors.reason ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}
                >
                  Lý do khám bệnh{" "}
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      placeholder="Nhập lý do khám bệnh"
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                  name="reason"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.reason && <Text>{errors.reason.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>
          </VStack>
        </ScrollView>
      </Box>
      <HStack mt={5} space={5} minW="90%" maxW="90%" alignSelf="center">
        <Button
          borderColor={appColor.backgroundPrimary}
          borderWidth={1}
          backgroundColor={appColor.white}
          flex={1}
          onPress={() => {
            setIsAddPatientInfo(false);
          }}
        >
          <Text>Quay lại</Text>
        </Button>
        <Button flex={1} onPress={handleSubmit(onSubmit)}>
          Thêm lịch hẹn
        </Button>
      </HStack>
    </>
  );
};

export default AddPatientInfo;

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    width: "100%",
    height: 46,
    backgroundColor: "#F5F5FC",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D4D4D5",
  },
  dropdown1BtnTxtStyle: { color: "black", textAlign: "left", fontSize: 13 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
});
