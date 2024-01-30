import { SubscriptionRegistrationScreenProps } from "../../Navigator/SubscriptionNavigator";
import {
  Text,
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  VStack,
  View,
  ScrollView,
} from "native-base";
import { appColor } from "../../theme";
import { FontAwesome } from "@expo/vector-icons";
const { format } = require("number-currency-format");

export default function SubscriptionRegistrationScreen({
  navigation,
  route,
}: SubscriptionRegistrationScreenProps) {
  const { planData } = route.params;
  return (
    <Box h="full">
      <Box
        width="90%"
        alignSelf="center"
        alignItems="center"
        borderRadius={20}
        backgroundColor={appColor.white}
        minH="85%"
        maxH="85%"
        mt={5}
      >
        <Box
          width="full"
          alignItems="center"
          justifyContent="center"
          backgroundColor={appColor.backgroundPrimary}
          p={5}
          borderRadius={20}
          flex={1}
        >
          <VStack space={3} alignItems="center" justifyContent="center">
            <Heading
              alignSelf="center"
              fontFamily="heading"
              fontSize={20}
              color="#fff"
              textAlign="center"
            >
              {planData.planName.toUpperCase()}
            </Heading>
            <Heading fontSize={18} color="#fff" size="md">
              {planData.description}
            </Heading>
          </VStack>
        </Box>

        <Box
          flexDirection="column"
          justifyContent="space-between"
          alignItems="flex-start"
          width="full"
          p={5}
          flex={3}
        >
          <ScrollView width="full">
            <VStack space="5">
              {planData.planOptions.map((option: any, index: any) => {
                return (
                  <HStack
                    key={index}
                    space={2}
                    justifyContent="flex-start"
                    alignItems="center"
                    width="full"
                    textAlign="justify"
                  >
                    <FontAwesome
                      name="check"
                      size={24}
                      color={appColor.backgroundPrimary}
                    />
                    <Text fontSize={15} color={appColor.textTitle}>
                      {option.optionName}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          </ScrollView>
          <VStack alignSelf="center" alignItems="center">
            <Heading fontSize={40} color={appColor.primary}>
              {format(planData.currentPrice, {
                decimalsDigits: 0,
                decimalSeparator: "",
              })}
              đ
            </Heading>
            <Heading color={appColor.textSecondary}>
              {planData.duration} ngày
            </Heading>
          </VStack>
        </Box>
      </Box>
      <HStack maxW="90%" minW="90%" alignSelf="center" space={5} mt={5}>
        <Button
          flex={1}
          onPress={() => {
            navigation.goBack();
          }}
          backgroundColor="#fff"
          borderColor="secondary.300"
          borderWidth={1}
          _text={{
            color: "secondary.300",
          }}
          _pressed={{
            backgroundColor: "secondary.100",
          }}
        >
          Quay lại
        </Button>
        <Button
          onPress={() => {
            navigation.navigate("SubscriptionRegistrationProcess", {
              planData,
              paymentResult: null,
            });
          }}
          flex={1}
        >
          <Text fontFamily="body" color={appColor.white}>
            Tiếp tục
          </Text>
        </Button>
      </HStack>
    </Box>
  );
}
