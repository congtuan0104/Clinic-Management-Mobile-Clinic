import { Box, HStack, Heading, VStack, Text, Radio, Button } from "native-base";
import { useState } from "react";
import { PlanDataCard } from "../../../components/PlanDataCard/PlanDataCard";

export const StepThreeScreen = (props: any) => {
  const {
    paymentMethod,
    setPaymentMethod,
    planData,
    changePosition,
    handlePayment,
  } = props;

  return (
    <VStack space={5} minH="100%" maxH="100%">
      <Heading>Bước 3: Chọn thanh toán</Heading>
      <PlanDataCard planData={planData} />

      <Radio.Group
        name="myRadioGroup"
        accessibilityLabel="favorite number"
        value={paymentMethod}
        onChange={(nextValue) => {
          setPaymentMethod(nextValue);
        }}
        flex={1}
      >
        <VStack space={5}>
          <Radio value="Zalopay">
            <Text>ZaloPay</Text>
          </Radio>
          <Radio value="Vnpay">
            <Text>VNPay</Text>
          </Radio>
          <Radio value="ATM">
            <Text>ATM</Text>
          </Radio>
          <Radio value="InternationalCard">
            <Text>Thẻ quốc tế</Text>
          </Radio>
        </VStack>
      </Radio.Group>
      <HStack width="full" justifyContent="space-between" alignSelf="center">
        <Button
          borderRadius={20}
          onPress={() => {
            changePosition(false);
          }}
        >
          Quay lại
        </Button>
        <Button borderRadius={20} onPress={handlePayment}>
          Tiếp tục
        </Button>
      </HStack>
    </VStack>
  );
};
