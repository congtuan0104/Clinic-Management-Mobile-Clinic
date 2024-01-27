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
    <Box>
      <ScrollView>
        <Box
          width="90%"
          alignSelf="center"
          alignItems="center"
          borderRadius={20}
          backgroundColor={appColor.white}
          // p={5}
          mt={5}
        >
          <Box
            width="full"
            alignItems="center"
            justifyContent="center"
            height="1/6"
            backgroundColor={appColor.backgroundPrimary}
            p={5}
            borderRadius={20}
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
          <Box alignItems="flex-start" width="100%" minH="80" p={5}>
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
          </Box>
          <VStack alignItems="center">
            <Heading fontSize={50} color={appColor.primary}>
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
          <Box width="full" alignItems="center" py={3}>
            <Button
              onPress={() => {
                navigation.navigate("SubscriptionRegistrationProcess", {
                  planData,
                  paymentResult: null,
                });
              }}
              backgroundColor="secondary.300"
              width="90%"
            >
              <Text
                fontFamily="body"
                fontWeight="bold"
                fontSize={15}
                color={appColor.white}
              >
                MUA NGAY
              </Text>
            </Button>
          </Box>
        </Box>
        <Button
          backgroundColor="primary.300"
          _pressed={{
            backgroundColor: "primary.400",
          }}
          mt={5}
          mb={10}
          width="90%"
          alignSelf="center"
          onPress={() => {
            navigation.goBack();
          }}
        >
          Quay lại
        </Button>
      </ScrollView>
    </Box>
  );
}
