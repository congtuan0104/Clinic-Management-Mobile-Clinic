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
  TextArea,
  VStack,
  View,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import storage from "@react-native-firebase/storage";
import { SubscriptionDashboardScreenProps } from "../../Navigator/SubscriptionNavigator";
import { ClinicSelector, updateClinic, userInfoSelector } from "../../store";
import { appColor } from "../../theme";
import ToastAlert from "../../components/Toast/Toast";
import { clinicService } from "../../services";
import { UpdateClinicInfoScreenProps } from "../../Navigator/ClinicInfoNavigator";
import { useAppDispatch, useAppSelector } from "../../hooks";
import * as yup from "yup";
import { IClinicCreate } from "../../types/clinic.types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import UploadImageModal from "../../components/UploadImageModal/UploadImageModal";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import MapboxGL from "@rnmapbox/maps";
import { useDebounce } from "use-debounce";
import React from "react";
import { locationApi } from "../../services/location.services";
import { IMapBoxFeature } from "../../types/location.types";
import { Entypo } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import HTMLView from "react-native-htmlview";

MapboxGL.setAccessToken(
  "sk.eyJ1Ijoia2hhbmdubDI0MTEyMDAyIiwiYSI6ImNsczlubWhxODA1Y3IyaW5zM2VzNWkyaDQifQ.vn8nm-_IlboHapYDVdrlPg"
);
// Validate
const schema: yup.ObjectSchema<IClinicCreate> = yup.object({
  name: yup.string().required("Tên không được để trống"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  phone: yup.string().required("Số điện thoại không được để trống"),
  address: yup.string().required("Địa chỉ không được để trống"),
  logo: yup.string(),
  lat: yup.number(),
  long: yup.number(),
  description: yup.string(),
  planId: yup.string(),
});

const AnnotationContent = ({ title }: { title: string }) => (
  <View>
    <Text></Text>
    <TouchableOpacity>
      <Text>{title}</Text>
      <Entypo name="location-pin" size={50} color="red" />
    </TouchableOpacity>
  </View>
);

export default function UpdateClinicInfoScreen({
  navigation,
  route,
}: UpdateClinicInfoScreenProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const INITIAL_COORDINATES: [any, any] = [clinic?.long, clinic?.lat];
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [fileNameImage, setFileNameImage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchAddress, setSearchAddress] = React.useState<string>("");
  const [debounced] = useDebounce(searchAddress, 500);
  const [suggestLocations, setSuggestLocations] = useState<any[]>([]);
  const [point, setPoint] =
    React.useState<GeoJSON.Position>(INITIAL_COORDINATES);
  const [allowOverlapWithPuck, setAllowOverlapWithPuck] =
    React.useState<boolean>(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IClinicCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: clinic?.name,
      email: clinic?.email,
      phone: clinic?.phone,
      address: clinic?.address,
      logo: clinic?.logo ? clinic.logo : "",
      lat: clinic?.lat ? clinic.lat : undefined,
      long: clinic?.long ? clinic.long : undefined,
      description: clinic?.description ? clinic.description : "",
    },
  });
  useEffect(() => {
    getSuggestLocations(searchAddress);
  }, [debounced]);

  const dispatch = useAppDispatch();
  const onInvalid = (errors: any) => console.error(errors);

  const getSuggestLocations = async (address: string) => {
    const res = await locationApi.getSuggestLocations(address);

    if (res.data) {
      const features: IMapBoxFeature[] = res.data.features;
      const suggestLocations: any[] = features.map((feature) => {
        return {
          label: feature.place_name,
          value: feature.center.toString(),
        };
      });
      setSuggestLocations(suggestLocations);
    }
  };

  const onSubmit = async (data: IClinicCreate) => {
    console.log(data);
    setIsLoading(true);
    const { planId, ...requestData } = data;
    let url: string | undefined;
    if (selectedImage !== "") {
      url = await uploadImage(selectedImage, fileNameImage);
    }
    if (url) {
      requestData.logo = url;
    }
    try {
      if (clinic?.id) {
        const response = await clinicService.updateClinicInfo(
          clinic?.id,
          requestData
        );
        if (response.status === true && response.data) {
          // Call to update data in reducer
          dispatch(updateClinic(response.data));
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Thành công"
                  description="Cập nhật phòng khám thành công!"
                  status="success"
                />
              );
            },
          });
          navigation.navigate("ClinicInfoDashboard");
        }
      } else {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Lỗi"
                description="Không cập nhật được thông tin phòng khám. Vui lòng thử lại sau."
                status="error"
              />
            );
          },
        });
      }
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Lỗi"
              description="Không cập nhật được thông tin phòng khám. Vui lòng thử lại sau."
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
    const imageRef = storage().ref(`clinic-logo/${imageName}`);
    await imageRef.putFile(uri, { contentType: "image/jpg" }).catch((error) => {
      throw error;
    });
    const url = await imageRef.getDownloadURL().catch((error) => {
      throw error;
    });
    return url;
  };

  return (
    <Box>
      <Box
        bgColor="#fff"
        minWidth="90%"
        maxWidth="90%"
        minHeight="86%"
        maxHeight="86%"
        alignSelf="center"
        alignItems="center"
        p={5}
        borderRadius={20}
        mt="5%"
      >
        <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
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
            bg="white"
            source={
              selectedImage
                ? { uri: selectedImage }
                : clinic?.logo
                ? { uri: clinic.logo }
                : require("../../assets/images/clinics/default_image_clinic.png")
            }
            size="2xl"
            mb={2}
          />
        </TouchableOpacity>
        <ScrollView minWidth="100%" maxWidth="100%">
          <VStack space={5}>
            <VStack space={5}>
              <FormControl isRequired isInvalid={errors.name ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Tên phòng khám
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
                    color: appColor.inputLabel,
                  }}
                >
                  Email
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
              <FormControl isInvalid={errors.address ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Nhập địa chỉ
                </FormControl.Label>
                <Dropdown
                  style={{
                    marginTop: -10,
                    marginBottom: 30,
                  }}
                  placeholderStyle={{
                    fontSize: 14,
                  }}
                  selectedTextStyle={{
                    fontSize: 14,
                    height: 100,
                    marginTop: 80,
                  }}
                  containerStyle={{
                    borderRadius: 20,
                  }}
                  inputSearchStyle={{
                    borderRadius: 18,
                  }}
                  itemTextStyle={{}}
                  data={suggestLocations}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={clinic?.address}
                  searchPlaceholder="Search..."
                  value={searchAddress}
                  onChangeText={(search) => {
                    setSearchAddress(search);
                  }}
                  onChange={(item) => {
                    setSearchAddress(item.value);
                    const arr = item.value.split(",");
                    setPoint([parseFloat(arr[0]), parseFloat(arr[1])]);
                    setValue("long", parseFloat(arr[0]));
                    setValue("lat", parseFloat(arr[1]));
                  }}
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.address && <Text>{errors.address.message}</Text>}
                </FormControl.ErrorMessage>
                <MapboxGL.MapView
                  style={{ height: 300 }}
                  projection="mercator"
                  zoomEnabled={true}
                  logoEnabled={false}
                  localizeLabels={true}
                  attributionPosition={{ top: 8, left: 8 }}
                  tintColor="#333"
                  styleURL="mapbox://styles/mapbox/streets-v12"
                  rotateEnabled={true}
                >
                  <MapboxGL.Camera
                    defaultSettings={{
                      zoomLevel: 15,
                      centerCoordinate: point,
                    }}
                    centerCoordinate={point}
                    zoomLevel={15}
                    followUserLocation={true}
                  />

                  <MapboxGL.MarkerView
                    coordinate={point}
                    allowOverlapWithPuck={allowOverlapWithPuck}
                  >
                    <AnnotationContent title={""} />
                  </MapboxGL.MarkerView>
                </MapboxGL.MapView>
              </FormControl>
              {/**Description */}
              <FormControl isInvalid={errors.description ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Mô tả{" "}
                </FormControl.Label>
                {/* <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextArea
                      type="text"
                      placeholder="Nhập mô tả"
                      onChangeText={onChange}
                      value={value ? value : undefined}
                      onBlur={onBlur}
                      autoCompleteType={true}
                      fontSize={14}
                    />
                  )}
                  name="description"
                /> */}
                {clinic?.description && <HTMLView value={clinic.description} />}
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.description && (
                    <Text>{errors.description.message}</Text>
                  )}
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
            navigation.navigate("ClinicInfoDashboard");
          }}
          _pressed={{
            backgroundColor: "secondary.50",
          }}
          _text={{
            color: "secondary.300",
          }}
        >
          Quay lại
        </Button>
        <Button flex={1} onPress={handleSubmit(onSubmit, onInvalid)}>
          Thay đổi thông tin
        </Button>
      </HStack>
    </Box>
  );
}
