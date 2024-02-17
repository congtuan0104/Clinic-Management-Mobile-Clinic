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
  Image,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import { TouchableOpacity, Alert } from "react-native";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import storage from "@react-native-firebase/storage";
//import 'firebase/storage';
import { useState } from "react";
import { IUserInfo, ILoginResponse } from "../../types";
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import { userInfoSelector, login } from "../../store";
import { appColor } from "../../theme";
import ToastAlert from "../../components/Toast/Toast";
import { UpdateProfileNavigatorProps } from "../../Navigator/UserNavigator";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { IUserInfoUpdateForm, IUserInfoUpdateRequest } from "../../types";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authApi } from "../../services";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import UploadImageModal from "../../components/UploadImageModal/UploadImageModal";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";

const chevronDown = require("../../assets/chevron_down.png");

// Validate
const schema: yup.ObjectSchema<IUserInfoUpdateForm> = yup.object({
  firstName: yup.string().required("Họ không được để trống"),
  lastName: yup.string().required("Tên không được để trống"),
  gender: yup.string(),
  birthday: yup.string(),
  phone: yup.string(),
  address: yup.string(),
  avatar: yup.string(),
});

export default function UpdateUserInfoScreen({
  navigation,
  route,
}: UpdateProfileNavigatorProps) {
  const userInfo = useAppSelector(userInfoSelector);
  const dateString = userInfo?.birthday?.slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateString ? new Date(dateString) : undefined
  );
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [fileNameImage, setFileNameImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    //console.log("date confirmed: ", date);
    hideDatePicker();
    setSelectedDate(date);
  };
  const toast = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IUserInfoUpdateForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName,
      gender: userInfo?.gender ? "Nam" : "Nữ",
      birthday: dateString?.split("-").reverse().join("/"),
      phone: userInfo?.phone ? userInfo?.phone : "",
      address: userInfo?.address ? userInfo?.address : "",
      avatar: userInfo?.avatar ? userInfo?.avatar : "",
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = async (data: IUserInfoUpdateForm) => {
    //console.log('go here')
    setIsLoading(true);

    let genderNumber: number | undefined;
    if (data.gender === "Nam") {
      genderNumber = 1;
    }
    if (data.gender === "Nữ") {
      genderNumber = 0;
    }
    //console.log('data form: ', data)
    let url: string | undefined;
    if (selectedImage !== "") {
      url = await uploadImage(selectedImage, fileNameImage);
    }
    const requestData: IUserInfoUpdateRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: genderNumber ? genderNumber : null,
      // birthday: data.birthday ? data.birthday : null,
      birthday: selectedDate
        ? dayjs(selectedDate).format("MM/DD/YYYY")
        : data.birthday,
      address: data.address ? data.address : null,
      phone: data.phone ? data.phone : null,
      avatar: url ? url : userInfo?.avatar ? userInfo?.avatar : "",
    };
    const token = await AsyncStorage.getItem("token");
    try {
      if (userInfo?.id) {
        const response = await authApi.updateUserInfo(
          requestData,
          userInfo?.id
        );
        if (response.status === true && response.data && token) {
          const userToStorage: IUserInfo = {
            id: userInfo.id,
            email: userInfo.email,
            isInputPassword: userInfo.isInputPassword,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            gender: response.data.gender,
            birthday: response.data.birthday,
            phone: response.data.phone,
            address: response.data.address,
            moduleId: response.data.moduleId,
            avatar: response.data.avatar,
          };
          const userToReduxStore: ILoginResponse = {
            user: userToStorage,
            token: token,
          };
          // Call to update data in reducer
          dispatch(login(userToReduxStore));
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Thành công"
                  description="Cập nhật thông tin thành công!"
                  status="success"
                />
              );
            },
          });
          navigation.navigate("ProfileNavigator");
        }
      } else {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Lỗi"
                description="Không cập nhật được thông tin tài khoản. Vui lòng thử lại sau."
                status="error"
              />
            );
          },
        });
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
    setIsLoading(false);
  };

  // Handle when user press to the button "Take image from camera"
  const onPressCamera = async () => {
    try {
      setShowModal(false);
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        // After take a photo, we will get uri, name and send it to the firebase storage
        // using handlSendImage function
        const uri = result.assets[0].uri;
        const fileName = uri.substring(uri.lastIndexOf("/") + 1);
        //await handleSendImage(fileName, uri);
        setSelectedImage(uri);
        setFileNameImage(fileName);
      } else {
        alert("You did not select any image.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onPressUploadImageGallery = async () => {
    setShowModal(false);
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        // save image
        const uri = result.assets[0].uri;
        const fileName = uri.substring(uri.lastIndexOf("/") + 1);
        // await handleSendImage(fileName, uri);
        setSelectedImage(uri);
        setFileNameImage(fileName);
      } else {
        alert("You did not select any image.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (uri: string, imageName: string) => {
    const imageRef = storage().ref(`avatars/${imageName}`);
    await imageRef.putFile(uri, { contentType: "image/jpg" }).catch((error) => {
      throw error;
    });
    const url = await imageRef.getDownloadURL().catch((error) => {
      throw error;
    });
    return url;
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
        <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
        <DateTimePickerModal
          date={selectedDate}
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <UploadImageModal
          showModal={showModal}
          setShowModal={setShowModal}
          onPressCamera={onPressCamera}
          onPressUploadImageGallery={onPressUploadImageGallery}
        />
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}
        >
          <Avatar
            alignSelf="center"
            bg="grey"
            source={
              selectedImage
                ? { uri: selectedImage }
                : userInfo?.avatar
                ? { uri: userInfo.avatar }
                : require("../../assets/user.png")
            }
            size="2xl"
            mb={2}
          />
        </TouchableOpacity>
        <ScrollView minWidth="100%" maxWidth="100%">
          <VStack space={5}>
            <VStack space={5}>
              <FormControl
                isRequired
                isInvalid={errors.firstName ? true : false}
              >
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Họ
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      placeholder="Họ và tên đệm"
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
                  {errors.firstName && <Text>{errors.firstName.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={errors.lastName ? true : false}
              >
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Tên
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      placeholder="Nhập tên"
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
                  {errors.lastName && <Text>{errors.lastName.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              {/**Gender */}
              <FormControl isRequired isInvalid={errors.gender ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Giới tính
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SelectDropdown
                      data={["Nam", "Nữ"]}
                      onSelect={(selectedItem, index) => {
                        if (index === 0) setValue("gender", "Nam");
                        if (index === 1) setValue("gender", "Nữ");
                      }}
                      defaultButtonText={
                        userInfo?.gender === 1
                          ? "Nam"
                          : userInfo?.gender === 0
                          ? "Nữ"
                          : "Chọn giới tính"
                      }
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
              {/**Phone */}
              <FormControl isRequired isInvalid={errors.phone ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
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
              {/**Address */}
              <FormControl isRequired isInvalid={errors.address ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Địa chỉ{" "}
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
              {/**Avatar */}

              {/**Birthday */}
              <FormControl isInvalid={errors.birthday ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Ngày sinh{" "}
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
                  name="birthday"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.birthday && <Text>{errors.birthday.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>
          </VStack>
        </ScrollView>
      </Box>
      <HStack mt={5} space={5} minW="90%" maxW="90%" alignSelf="center">
        <Button
          borderColor="secondary.300"
          borderWidth={1}
          backgroundColor={appColor.white}
          flex={1}
          onPress={() => {
            navigation.navigate("ProfileNavigator");
          }}
          _pressed={{
            backgroundColor: "secondary.100",
          }}
          _text={{
            color: "secondary.300",
          }}
        >
          Quay lại
        </Button>
        <Button flex={1} onPress={handleSubmit(onSubmit)}>
          Thay đổi thông tin
        </Button>
      </HStack>
    </>
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
  dropdown1BtnTxtStyle: { color: "black", textAlign: "left", fontSize: 15 },
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
