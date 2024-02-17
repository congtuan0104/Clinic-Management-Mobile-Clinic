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
import React, { useState, useEffect, useMemo } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { ClinicSelector, updateClinic, userInfoSelector } from "../../store";
import { appColor } from "../../theme";
import ToastAlert from "../../components/Toast/Toast";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAppDispatch, useAppSelector } from "../../hooks";
import * as yup from "yup";
import { IAddPatientInfo, ICreatePatientPayload, IUserInfo } from "../../types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { patientApi, authApi } from "../../services";
import { AuthModule } from "../../enums";

const chevronDown = require("../../assets/chevron_down.png");
interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birth: string;
  gender: string;
  address?: string;
  idCard?: string;
  healthInsuranceCode?: string;
  blood?: string;
  anamnesis?: string;
}

// Validate
const schema: yup.ObjectSchema<IFormData> = yup.object({
  firstName: yup.string().required("Họ không được để trống"),
  lastName: yup.string().required("Tên không được để trống"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  phone: yup.string().required("Số điện thoại không được để trống"),
  birth: yup.string().required("Ngày sinh không được để trống"),
  gender: yup.string().required("Giới tính không được để trống"),
  address: yup.string(),
  idCard: yup.string(),
  healthInsuranceCode: yup.string(),
  blood: yup.string(),
  anamnesis: yup.string(),
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
  const [userId, setUserId] = useState<string>();
  const [emailInput, setEmailInput] = useState<string>();
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const [isNotifyVisible, setIsNotifyVisible] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  console.log("render lai");
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
    getValues,
    setValue,
    reset,
    setError,
  } = useForm<IFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailInput? emailInput : "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      birth: "",
      gender: "",
      blood: "",
      idCard: "",
      healthInsuranceCode: "",
      anamnesis: "",
  }
  });
  const dispatch = useAppDispatch();

  const handleSetEmail = async () => {
    let emailSet = getValues('email')
    setEmailInput(emailSet)
    console.log("email trong handle :", emailInput)
    console.log('emaiSet', emailSet)
  };

  const handleCheckEmail = async () => {
    console.log("go here");
    console.log('getvalues:', getValues("email"));
    let emailSet = getValues('email')
    await handleSetEmail();
    console.log("email luc nay:", emailInput)
    if (!emailSet || emailSet == "") {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Chưa nhập thông tin email"
              description="Vui lòng nhập thông tin email!"
              status="error"
            />
          );
        },
      });
    } else {
      const res = await authApi.findUserByEmail(getValues("email"));
      console.log("check email benh nhan:", res);
      if (res.status && res.data) {
        const patientInfo: IUserInfo = res.data;

        if (patientInfo.moduleId !== AuthModule.Patient) {
          setError("email", { message: "Email đã tồn tại" });
          return;
        }

        setUserId(patientInfo.id);
        setValue("firstName", patientInfo.firstName);
        setValue("lastName", patientInfo.lastName);
        patientInfo.phone && setValue("phone", patientInfo.phone);
        setValue("address", patientInfo.address);
        setValue("birth", patientInfo.birthday!);
        setValue(
          "gender",
          patientInfo.gender ? patientInfo.gender.toString() : ""
        );
        setIsNotifyVisible(true);
        setIsDisabled(true);
      } else {
        if (res.status && res.data === null) setIsDisplay(true);
      }
    }
  };

  const handleSubmitForm = async (data: IFormData) => {
    if (!clinic?.id) return;

    const payload: ICreatePatientPayload = {
      clinicId: clinic.id,
      userId: userId,
      userInfo: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        gender: Number(data.gender),
      },
      bloodGroup: data.blood,
      anamnesis: data.anamnesis,
      idCard: data.idCard,
      healthInsuranceCode: data.healthInsuranceCode,
    };

    if (payload.userId && payload.userId !== "") {
      delete payload.userInfo;
    }

    console.log(payload);

    const res = await patientApi.createPatient(payload);

    if (res.status) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thành công"
              description="Thêm bệnh nhân thành công!"
              status="success"
            />
          );
        },
      });
    }
  };

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
                      isDisabled={isDisabled}
                      onChangeText={(val) => onChange(val)}
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
              {!isDisplay && !isNotifyVisible ? (
                <Button onPress={handleCheckEmail}>Tiếp tục</Button>
              ) : null}
              {isNotifyVisible ? (
                <>
                  <Text>
                    Tài khoản bệnh nhân đã tồn tại, thông tin bệnh nhân sẽ được
                    cập nhật từ tài khoản này
                  </Text>
                  <Button onPress={handleCheckEmail}>Xác nhận</Button>
                </>
              ) : null}
              {isDisplay ? (
                <>
                  {/**Họ */}
                  <FormControl
                    isRequired
                    isInvalid={errors.firstName ? true : false}
                  >
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      Họ
                    </FormControl.Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          type="text"
                          placeholder="Họ "
                          onChangeText={onChange}
                          value={value}
                          onBlur={onBlur}
                        />
                      )}
                      name="firstName"
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.firstName && (
                        <Text>{errors.firstName.message}</Text>
                      )}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  {/**lastName */}
                  <FormControl
                    isRequired
                    isInvalid={errors.lastName ? true : false}
                  >
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      Tên
                    </FormControl.Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          type="text"
                          placeholder="Tên "
                          onChangeText={onChange}
                          value={value}
                          onBlur={onBlur}
                        />
                      )}
                      name="lastName"
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.lastName && (
                        <Text>{errors.lastName.message}</Text>
                      )}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  {/**Giới tính */}
                  <FormControl
                    isRequired
                    isInvalid={errors.phone ? true : false}
                  >
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
                      {errors.gender && <Text>{errors.gender.message}</Text>}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  {/** Ngày sinh */}
                  <FormControl
                    isRequired
                    isInvalid={errors.birth ? true : false}
                  >
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
                      {errors.birth && <Text>{errors.birth.message}</Text>}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  {/**Phone */}
                  <FormControl
                    isRequired
                    isInvalid={errors.phone ? true : false}
                  >
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
                  {/** Địa chỉ */}
                  <FormControl
                    isRequired
                    isInvalid={errors.address ? true : false}
                  >
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      Địa chỉ
                    </FormControl.Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          type="text"
                          placeholder="Nhập địa chỉ"
                          onChangeText={onChange}
                          value={value}
                          onBlur={onBlur}
                        />
                      )}
                      name="address"
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.address && <Text>{errors.address.message}</Text>}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  {/**Nhóm máu */}
                  <FormControl
                    isRequired
                    isInvalid={errors.blood ? true : false}
                  >
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
                  {/**CMND/CCCD */}
                  <FormControl
                    isRequired
                    isInvalid={errors.idCard ? true : false}
                  >
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      CMND/CCCD
                    </FormControl.Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          type="text"
                          placeholder="CMND/CCCD"
                          onChangeText={onChange}
                          value={value}
                          onBlur={onBlur}
                        />
                      )}
                      name="idCard"
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.idCard && <Text>{errors.idCard.message}</Text>}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  {/** Mã BHYT */}
                  <FormControl
                    isRequired
                    isInvalid={errors.address ? true : false}
                  >
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      Mã thẻ BHYT
                    </FormControl.Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          type="text"
                          placeholder="Mã thẻ BHYT"
                          onChangeText={onChange}
                          value={value}
                          onBlur={onBlur}
                        />
                      )}
                      name="healthInsuranceCode"
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.healthInsuranceCode && (
                        <Text>{errors.healthInsuranceCode.message}</Text>
                      )}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  {/**Tiền sử bệnh */}
                  <FormControl isInvalid={errors.anamnesis ? true : false}>
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      Tiền sử bệnh(nếu có){" "}
                    </FormControl.Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          type="text"
                          placeholder="Nhập tiền sử bệnh"
                          onChangeText={onChange}
                          value={value}
                          onBlur={onBlur}
                        />
                      )}
                      name="anamnesis"
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.anamnesis && (
                        <Text>{errors.anamnesis.message}</Text>
                      )}
                    </FormControl.ErrorMessage>
                  </FormControl>
                </>
              ) : null}
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
        {isDisplay ? (
          <Button flex={1} onPress={handleSubmit(handleSubmitForm)}>
            Thêm bệnh nhân
          </Button>
        ) : null}
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
