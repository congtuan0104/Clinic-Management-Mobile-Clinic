import React from "react";
import { ResetPasswordScreenProps } from "../../Navigator/StackNavigator";
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
import { authApi } from "../../services";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { appColor, theme } from "../../theme";
// import { authApi } from "../../../services";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";


const schema = yup.object().shape({ 
  email: yup
    .string()
    .required("Thông tin email là bắt buộc")
    .email("Email không hợp lệ"),  
});

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { setLogin } = route.params;
  const {
    control,
    formState: { errors },
    getValues
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // giá trị mặc định của các field
      
      email: "",
     
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    const emailReset = getValues("email")
    console.log(emailReset);
    // Send data to server
    await authApi
      .resetPassword(emailReset)
      .then(async (response) => {
        console.log(response);
        if (response.status) {
            // Redirect đến trang ResetPassword
          navigation.navigate("ResetPasswordNotification", { setLogin, email: emailReset });

        }

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
            source={require("../../assets/images/common/logo.png")}
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
              Quên mật khẩu?
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
                      placeholder="Nhập email của bạn"
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
              
              <VStack space={2} mt={5}>
                <Button
                  onPress={handleSubmit}
                  colorScheme="info"
                  _text={{
                    color: "white",
                  }}
                >
                  Gửi email reset password
                </Button>
              </VStack>
              
            </VStack>
          </ScrollView>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default ResetPasswordScreen;
