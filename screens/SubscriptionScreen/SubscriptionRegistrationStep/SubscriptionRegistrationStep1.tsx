import {
  Box,
  HStack,
  Heading,
  VStack,
  Text,
  Button,
  FormControl,
  Input,
  WarningOutlineIcon,
  ScrollView,
  useToast,
  View,
  Avatar,
} from "native-base";
import { PlanDataCard } from "../../../components/PlanDataCard/PlanDataCard";
import { Controller, Form } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { IClinicCreate } from "../../../types/clinic.types";
import { useAppSelector } from "../../../hooks";
import { userInfoSelector } from "../../../store";
import ToastAlert from "../../../components/Toast/Toast";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Dropdown } from "react-native-element-dropdown";
import { Entypo } from "@expo/vector-icons";
import MapboxGL from "@rnmapbox/maps";
import { TouchableOpacity } from "react-native";
import { locationApi } from "../../../services/location.services";
import { IMapBoxFeature } from "../../../types/location.types";
import { Camera } from "@rnmapbox/maps";
import { appColor } from "../../../theme";
import { clinicService } from "../../../services";
import UploadImageModal from "../../../components/UploadImageModal/UploadImageModal";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

MapboxGL.setAccessToken(
  "sk.eyJ1Ijoia2hhbmdubDI0MTEyMDAyIiwiYSI6ImNsczlubWhxODA1Y3IyaW5zM2VzNWkyaDQifQ.vn8nm-_IlboHapYDVdrlPg"
);
const AnnotationContent = ({ title }: { title: string }) => (
  <View>
    <Text></Text>
    <TouchableOpacity>
      <Text>{title}</Text>
      <Entypo name="location-pin" size={50} color="red" />
    </TouchableOpacity>
  </View>
);
// [10.778203, 106.654055]; //long-lat
const INITIAL_COORDINATES: [number, number] = [
  109.12250081583632, 12.442327030094503,
];

export const StepOneScreen = (props: any) => {
  const camera = useRef<Camera>(null);
  const [point, setPoint] =
    React.useState<GeoJSON.Position>(INITIAL_COORDINATES);
  const [allowOverlapWithPuck, setAllowOverlapWithPuck] =
    React.useState<boolean>(false);
  const [searchAddress, setSearchAddress] = React.useState<string>("");
  const toast = useToast();
  const [debounced] = useDebounce(searchAddress, 500);
  const userInfo = useAppSelector(userInfoSelector);
  const [suggestLocations, setSuggestLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorAddress, setErrorAddress] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [fileNameImage, setFileNameImage] = useState<string>("");
  useEffect(() => {
    camera.current?.setCamera({
      centerCoordinate: [106.654055, 10.778203],
    });
  }, []);
  const { planData, changePosition, setSubscriptionPlanId, handleNavigation } =
    props;
  // Validate
  const schema: yup.ObjectSchema<IClinicCreate> = yup.object({
    name: yup.string().required("Tên không được để trống"),
    email: yup
      .string()
      .required("Email không được để trống")
      .email("Email không hợp lệ"),
    phone: yup.string().required("Số điện thoại không được để trống"),
    address: yup.string().required("Địa chỉ không được để trống"),
    lat: yup.number(),
    long: yup.number(),
    logo: yup.string(),
    description: yup.string(),
    planId: yup.string().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IClinicCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: userInfo?.email,
      phone: "",
      address: "",
      logo: "",
      description: "",
      planId: planData.id.toString(),
    },
  });

  useEffect(() => {
    getSuggestLocations(searchAddress);
  }, [debounced]);

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
  // send data to server to create clinic
  const onSubmit = async (data: IClinicCreate) => {
    setIsLoading(true);
    try {
      let url: string | undefined;
      if (selectedImage !== "") {
        url = await uploadImage(selectedImage, fileNameImage);
      }
      if (url) {
        data.logo = url;
      }
      const response = await clinicService.createClinic(data);
      if (response.status) {
        setSubscriptionPlanId(response.data.subscription.id);
        changePosition(true);
      }
    } catch (error: any) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thất bại!"
              description="Không thể tạo phòng khám. Vui lòng kiểm tra thông tin và thử lại."
              status="error"
            />
          );
        },
      });
    }
    setIsLoading(false);
  };

  return (
    <VStack space={5} maxH="100%" minH="50%">
      <UploadImageModal
        showModal={showModal}
        setShowModal={setShowModal}
        onPressCamera={onPressCamera}
        onPressUploadImageGallery={onPressUploadImageGallery}
      />
      <Heading>Bước 1: Điền thông tin</Heading>

      <ScrollView>
        <PlanDataCard planData={planData} />
        <VStack space={5}>
          <FormControl isRequired isInvalid={errors.name ? true : false}>
            <FormControl.Label
              _text={{
                bold: true,
                color: appColor.inputLabel,
              }}
              mt={5}
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
              placeholder="Địa chỉ"
              searchPlaceholder="Search..."
              value={searchAddress}
              onChangeText={(search) => {
                setSearchAddress(search);
              }}
              onChange={(item) => {
                setSearchAddress(item.value);
                const arr = item.value.split(",");
                setPoint([parseFloat(arr[0]), parseFloat(arr[1])]);
                setValue("address", item.label);
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
              style={{ height: 300, marginTop: 5 }}
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
          {/**Logo */}
          <FormControl>
            <FormControl.Label
              _text={{
                bold: true,
                color: appColor.inputLabel,
              }}
            >
              Logo{" "}
            </FormControl.Label>
            <Avatar
              alignSelf="center"
              bg="white"
              source={
                selectedImage
                  ? { uri: selectedImage }
                  : require("../../../assets/images/clinics/default_image_clinic.png")
              }
              size="2xl"
              mb={2}
            />
            <Button
              onPress={() => {
                setShowModal(true);
              }}
            >
              Chọn Logo
            </Button>
          </FormControl>

          {/* <FormControl isInvalid={errors.logo ? true : false}>
            <FormControl.Label
              _text={{
                bold: true,
                color: appColor.inputLabel,
              }}
            >
              Logo{" "}
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder="Nhập link Logo"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="logo"
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.logo && <Text>{errors.logo.message}</Text>}
            </FormControl.ErrorMessage>
          </FormControl> */}
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
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="text"
                  placeholder="Nhập mô tả"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="description"
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.description && <Text>{errors.description.message}</Text>}
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>
        <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      </ScrollView>
      <HStack width="full" justifyContent="space-between" alignSelf="center">
        <Button
          borderRadius={20}
          onPress={() => {
            handleNavigation();
          }}
        >
          Quay lại
        </Button>
        <Button borderRadius={20} onPress={handleSubmit(onSubmit)}>
          Tiếp tục
        </Button>
      </HStack>
    </VStack>
  );
};
