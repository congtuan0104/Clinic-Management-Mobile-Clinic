import React from "react";
import { ResetPasswordNotificationScreenProps } from "../../Navigator/StackNavigator";
import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  NativeBaseProvider,
  Text,
  Icon,
  Link,
  HStack,
  Image,
  ScrollView,
} from "native-base";
import { authApi } from "../../services";
import { useToast } from "native-base";
import { appColor, theme } from "../../theme";
import ToastAlert from "../../components/Toast/Toast";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";



const ResetPasswordNotificationScreen: React.FC<ResetPasswordNotificationScreenProps> = ({
  navigation,
  route,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { setLogin } = route.params;
  const { email } = route.params;
  const toast = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);

    // Send data to server
    await authApi
      .resetPassword(email)
      .then(async (response) => {
        console.log(response);
        if (response.status) {
            
            toast.show({
                render: () => {
                  return (
                    <ToastAlert
                      title="Thành công"
                      description="Gửi email reset password thành công!"
                      status="success"
                    />
                  );
                },
              });
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
            <VStack
              mb="3"
              space={1}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Text fontSize={18}>Chúng tôi đã gửi một email để cập nhật lại mật khẩu đến</Text>
              <Link
                isUnderlined={false}
                _text={{
                  color: "primary.300",
                  fontSize: 18,
                }}
              >
                {email}
              </Link>
            </VStack>
            <VStack space={2}>
              
             
              
              <VStack space={2} mt={5}>
                <Button
                  onPress={handleSubmit}
                  colorScheme="info"
                  _text={{
                    color: "white",
                  }}
                >
                  Gửi lại email reset password
                </Button>
              </VStack>
              <VStack space={2} mt={5}>
                <Button
                  onPress={() => navigation.navigate("Login", { setLogin })}
                  colorScheme="info"
                  _text={{
                    color: "white",
                  }}
                >
                  Về trang chủ
                </Button>
              </VStack>
            </VStack>
          </ScrollView>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default ResetPasswordNotificationScreen;
