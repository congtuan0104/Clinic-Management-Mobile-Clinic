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
} from "native-base";
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
  description: yup.string(),
  planId: yup.string(),
});

export default function UpdateClinicInfoScreen({
  navigation,
  route,
}: UpdateClinicInfoScreenProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IClinicCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: clinic?.name,
      email: clinic?.email,
      phone: clinic?.phone,
      address: clinic?.address,
      logo: clinic?.logo,
      description: clinic?.description,
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = async (data: IClinicCreate) => {
    const { planId, ...requestData } = data;
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
        <Heading mb={2}>Cập nhật phòng khám</Heading>
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
              {/**Logo */}
              <FormControl isInvalid={errors.logo ? true : false}>
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
          borderColor={appColor.backgroundPrimary}
          borderWidth={1}
          backgroundColor={appColor.white}
          flex={1}
          onPress={() => {
            navigation.navigate("ClinicInfoDashboard");
          }}
          _pressed={{
            backgroundColor: "primary.100",
          }}
        >
          <Text>Quay lại</Text>
        </Button>
        <Button flex={1} onPress={handleSubmit(onSubmit)}>
          Thay đổi thông tin
        </Button>
      </HStack>
    </>
  );
}
