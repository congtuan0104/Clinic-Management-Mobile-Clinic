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

export const StepOneScreen = (props: any) => {
  const userInfo = useAppSelector(userInfoSelector);
  const { planData, changePosition, setSubscriptionPlanId } = props;
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
    planId: yup.string().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IClinicCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: userInfo?.firstName,
      email: userInfo?.email,
      phone: "",
      address: "",
      logo: "",
      description: "",
      planId: planData.id.toString(),
    },
  });

  // send data to server to create clinic
  const onSubmit = async (data: IClinicCreate) => {
    try {
      const response = await clinicService.createClinic(data);
      if (response.status) {
        setSubscriptionPlanId(response.data.subscription.id);
        changePosition(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <VStack space={5} maxH="100%" minH="50%">
      <Heading>Bước 1: Thông tin của bạn</Heading>
      <ScrollView>
        <PlanDataCard planData={planData} />
        <VStack space={5}>
          <FormControl isRequired isInvalid={errors.name ? true : false}>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Tên người mua
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
          <FormControl isRequired isInvalid={errors.address ? true : false}>
            <FormControl.Label
              _text={{
                bold: true,
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
          <HStack
            width="full"
            justifyContent="space-between"
            alignSelf="center"
          >
            <Button
              borderRadius={20}
              onPress={() => {
                changePosition(false);
              }}
            >
              Quay lại
            </Button>
            <Button borderRadius={20} onPress={handleSubmit(onSubmit)}>
              Tiếp tục
            </Button>
          </HStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
};
