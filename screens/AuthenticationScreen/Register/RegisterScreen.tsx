import React from "react";
import { RegisterScreenProps } from "../../../Navigator/StackNavigator";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  NativeBaseProvider,
  WarningOutlineIcon,
  Text,
  Icon,
  Link,
  HStack,
  Image,
  ScrollView,
} from "native-base";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { appColor, theme } from "../../../theme";
import { authApi } from "../../../services";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required("Bạn chưa nhập tên"),
  lastName: yup.string().required("Bạn chưa nhập họ"),
  email: yup
    .string()
    .required("Thông tin email là bắt buộc")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Bạn chưa nhập mật khẩu")
    .min(8, "Mật khẩu phải có tối thiểu 8 ký tự"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận lại mật khẩu")
    .oneOf([yup.ref("password"), ""], "Không trùng với mật khẩu đã nhập"),
});

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
  route,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { setLogin } = route.params;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      // giá trị mặc định của các field
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: IRegisterFormData) => {
    setIsLoading(true);
    const { confirmPassword, ...registerData } = data;
    console.log(registerData);
    // Send data to server
    await authApi
      .register(registerData)
      .then(async (response) => {
        if (response.data)
          // Redirect đến trang Validate
          navigation.navigate("ValidateNotification", { setLogin });
      })
      .catch((error) => {
        // Print error to the screen
        console.log(error.response.data);
      });
    setIsLoading(false);
  };

  return (
    <NativeBaseProvider theme={theme}>
      <Box safeArea flex={1} justifyContent="center">
        <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
        <VStack
          backgroundColor="primary.300"
          justifyContent="center"
          alignItems="center"
          h="2/5"
          space={4}
          mt={-8}
        >
          <Image
            source={require("../../../assets/images/common/logo.png")}
            borderRadius={100}
            size="20"
            alt="logo_img"
            mt={-4}
          />
          <Heading
            fontSize={30}
            fontFamily="heading"
            fontWeight="bold"
            color="#fff"
          >
            CLINUS
          </Heading>
        </VStack>
        <VStack
          borderTopRadius={20}
          mt="-20"
          backgroundColor="#fff"
          flex={1}
          p="5"
          pt="10"
        >
          <ScrollView>
            <Heading
              size="xl"
              fontWeight="bold"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              Đăng ký
            </Heading>
            <HStack
              mb="3"
              space={1}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Text fontSize={18}>Đã có tài khoản?</Text>
              <Link
                isUnderlined={false}
                _text={{
                  color: "primary.300",
                  fontSize: 18,
                }}
                onPress={() => navigation.navigate("Login", { setLogin })}
              >
                Đăng nhập
              </Link>
            </HStack>
            <VStack space={2}>
              <HStack space={2} justifyContent="center" alignItems="flex-start">
                {/******************************Last Name ********************************/}
                <FormControl
                  flex={1}
                  isRequired
                  isInvalid={errors.lastName ? true : false}
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
                        placeholder="Họ"
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        bg="light.50"
                      />
                    )}
                    name="lastName"
                    defaultValue=""
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.lastName && <Text>{errors.lastName.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
                {/******************************First Name ********************************/}
                <FormControl
                  flex={1}
                  isRequired
                  isInvalid={errors.firstName ? true : false}
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
                        placeholder="Tên"
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        bg="light.50"
                      />
                    )}
                    name="firstName"
                    defaultValue=""
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.firstName && (
                      <Text>{errors.firstName.message}</Text>
                    )}
                  </FormControl.ErrorMessage>
                </FormControl>
              </HStack>
              {/******************************Email ********************************/}
              <FormControl isRequired isInvalid={errors.email ? true : false}>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Địa chỉ Email
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      placeholder="Địa chỉ email"
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      bg="light.50"
                    />
                  )}
                  name="email"
                  defaultValue=""
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.email && <Text>{errors.email.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              {/******************************Password ********************************/}
              <FormControl
                isRequired
                isInvalid={errors.password ? true : false}
              >
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Mật khẩu
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="password"
                      placeholder="Mật khẩu"
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      bg="light.50"
                    />
                  )}
                  name="password"
                  defaultValue=""
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.password && <Text>{errors.password.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={errors.confirmPassword ? true : false}
              >
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: appColor.inputLabel,
                  }}
                >
                  Xác nhận mật khẩu
                </FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      bg="light.50"
                    />
                  )}
                  name="confirmPassword"
                  defaultValue=""
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.confirmPassword && (
                    <Text>{errors.confirmPassword.message}</Text>
                  )}
                </FormControl.ErrorMessage>
              </FormControl>
              <VStack space={2} mt={5}>
                <Button
                  onPress={handleSubmit(onSubmit)}
                  colorScheme="info"
                  _text={{
                    color: "white",
                  }}
                >
                  Đăng kí
                </Button>
              </VStack>
            </VStack>
          </ScrollView>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default RegisterScreen;
