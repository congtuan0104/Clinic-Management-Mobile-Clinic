import {
  Text,
  Button,
  View,
  Box,
  Heading,
  Center,
  Image,
  VStack,
  HStack,
  Link,
  useToast,
} from "native-base";
import { ValidateNotificationProps } from "../../../Navigator/StackNavigator";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import React from "react";
import ToastAlert from "../../../components/Toast/Toast";
import { authApi } from "../../../services";
const ValidateNotification: React.FC<ValidateNotificationProps> = ({
  navigation,
  route,
}: ValidateNotificationProps) => {
  const toast = useToast();
  const { setLogin, email } = route.params;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleResendVerifyEmail = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.resendVerifyEmail(email);
      if (response.status) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thành công!"
                description="Đã gửi lại email xác thực. Vui lòng kiểm tra lại email của bạn."
                status="success"
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
              title="Thất bại!"
              description="Không gửi được email. Vui lòng thử lại sau."
              status="error"
            />
          );
        },
      });
    }
    setIsLoading(false);
  };
  return (
    <Center flex="1">
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Center w="100%" h="100%">
        <Box alignItems="" safeArea w="100%" h="100%">
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
            justifyContent="space-between"
            borderTopRadius={20}
            mt="-20"
            backgroundColor="#fff"
            flex={1}
            p="5"
            pt="10"
          >
            <Box>
              <Heading
                fontWeight="bold"
                fontFamily="heading"
                fontSize="40"
                color="coolGray.600"
              >
                Xin chào
              </Heading>
              <Heading
                fontWeight="medium"
                mt="1"
                _dark={{
                  color: "warmGray.200",
                }}
                color="coolGray.600"
              >
                Chào mừng bạn đã đến với Clinus
              </Heading>
              <Text color="gray.600">
                Chúng tôi đã gửi một đường link xác thực đến email
                <Text color="green.600"> {email}</Text>.
              </Text>
              <Text color="gray.600">
                Vui lòng xác thực để tiếp tục sử dụng ứng dụng.
              </Text>
            </Box>
            <HStack
              space={5}
              justifyContent="space-between"
              minW="100%"
              maxW="100%"
            >
              <Button
                backgroundColor="#fff"
                borderWidth={1}
                borderColor="secondary.300"
                flex={1}
                _text={{
                  color: "secondary.300",
                }}
                _pressed={{
                  backgroundColor: "secondary.100",
                }}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                Quay lại
              </Button>
              <Button onPress={handleResendVerifyEmail} flex={1}>
                Gửi lại email
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Center>
    </Center>
  );
};

export default ValidateNotification;
