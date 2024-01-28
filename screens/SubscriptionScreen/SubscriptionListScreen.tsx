import {
  Box,
  Button,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Text,
  VStack,
  View,
} from "native-base";
import { SubscriptionListScreenProps } from "../../Navigator/SubscriptionNavigator";
import { appColor } from "../../theme";
import React, { useEffect, useState } from "react";
import { Fontisto, FontAwesome } from "@expo/vector-icons";
import { clinicService } from "../../services";
import { planService } from "../../services/plan.services";
const { format } = require("number-currency-format");

export default function SubscriptionListScreen({
  navigation,
  route,
}: SubscriptionListScreenProps) {
  const [planList, setPlanList] = useState<any>([]);
  // Call API to get all subscriptions
  useEffect(() => {
    const getPlanList = async () => {
      try {
        const response = await planService.getPlanList();
        if (response.status) {
          setPlanList(response.data);
        } else {
          setPlanList([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPlanList();
  }, []);

  const handleBuyingSubscription = (planId: any) => {
    // find plan by planId
    const planData = planList.find((plan: any) => plan.id === planId);
    navigation.navigate("SubscriptionRegistration", { planData: planData });
  };
  return (
    <VStack space={5} my={5}>
      <Box width="90%" alignSelf="center" alignItems="center">
        <Heading fontFamily="heading">Danh sách gói hiện có</Heading>
      </Box>
      <ScrollView
        width="90%"
        alignSelf="center"
        minH="90%"
        maxH="90%"
        backgroundColor={appColor.white}
        borderRadius={20}
      >
        <VStack space={5} width="90%" alignSelf="center" my={5}>
          {planList.map((plan: any, index: any) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  handleBuyingSubscription(plan.id);
                }}
              >
                <Box backgroundColor="#DAD9FF" borderRadius={16} p={3}>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack>
                      <Text
                        fontWeight="bold"
                        color={appColor.textTitle}
                        fontSize={16}
                      >
                        {plan.planName}
                      </Text>
                      <Text fontSize={14} fontFamily="mono">
                        - {plan.duration} ngày
                      </Text>

                      <HStack justifyContent="space-between" width="90%">
                        <Text fontSize={14} fontFamily="mono">
                          - {plan.planOptions.length} chức năng
                        </Text>
                        <Text
                          fontSize={15}
                          color="#b92a00"
                          fontWeight="bold"
                          fontFamily="body"
                        >
                          {format(plan.currentPrice, {
                            decimalsDigits: 0,
                            decimalSeparator: "",
                          })}
                          đ
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              </Pressable>
            );
          })}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
