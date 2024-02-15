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
} from "native-base";
import { PlanDataCard } from "../../../components/PlanDataCard/PlanDataCard";
import { Controller, Form } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { IClinicCreate } from "../../../types/clinic.types";
import { useAppSelector } from "../../../hooks";
import { userInfoSelector } from "../../../store";
import { clinicService } from "../../../services";
import ToastAlert from "../../../components/Toast/Toast";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
// import MapBox from "../../../components/Mapbox/Mapbox";
import { StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import MapboxGL from "@rnmapbox/maps";
import { TouchableOpacity } from "react-native";
import { locationApi } from "../../../services/location.services";
import { IMapBoxFeature } from "../../../types/location.types";
import { Camera } from "@rnmapbox/maps";
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
const INITIAL_COORDINATES: [number, number] = [106.654055, 10.778203];

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

  // send data to server to create clinic
  const onSubmit = async (data: IClinicCreate) => {
    try {
      console.log(data);
      const response = await clinicService.createClinic(data);
      if (response.status) {
        setSubscriptionPlanId(response.data.subscription.id);
        changePosition(true);
      }
    } catch (error) {
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
  };

  return (
    <VStack space={5} maxH="100%" minH="50%">
      <Heading>Bước 1: Điền thông tin</Heading>
      <ScrollView>
        <PlanDataCard planData={planData} />
        <VStack space={5}>
          <FormControl isRequired isInvalid={errors.name ? true : false}>
            <FormControl.Label
              _text={{
                bold: true,
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
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Nhập địa chỉ
          </FormControl.Label>
          <Dropdown
            style={{
              marginTop: -10,
            }}
            placeholderStyle={{}}
            selectedTextStyle={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: 14,
              marginBottom: -5,
            }}
            data={suggestLocations}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Nhập địa chỉ"
            searchPlaceholder="Search..."
            value={searchAddress}
            onChangeText={(search) => {
              setSearchAddress(search);
            }}
            onChange={(item) => {
              console.log(item);
              setSearchAddress(item.value);
              const arr = item.value.split(",");
              setPoint(arr);
            }}
            // renderLeftIcon={() => (
            //   <AntDesign color="black" name="Safety" size={20} />
            // )}
          />

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

          {/**Logo */}
          <FormControl isInvalid={errors.logo ? true : false}>
            <FormControl.Label
              _text={{
                bold: true,
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
          </FormControl>
          {/**Description */}
          <FormControl isInvalid={errors.description ? true : false}>
            <FormControl.Label
              _text={{
                bold: true,
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
