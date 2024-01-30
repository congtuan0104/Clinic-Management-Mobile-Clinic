import { HStack, Heading, VStack, Text, Button } from "native-base";
import { PlanDataCard } from "../../../components/PlanDataCard/PlanDataCard";
const { format } = require("number-currency-format");

export const StepTwoScreen = (props: any) => {
  const { planData, changePosition } = props;
  return (
    <VStack maxH="100%" minH="100%" space={5}>
      <Heading>Bước 2: Xác nhận gói</Heading>
      <PlanDataCard planData={planData} />
      <VStack flex={1} space={5}>
        <HStack justifyContent="space-between">
          <Text>Tiền gói</Text>
          <Text>
            {format(planData.currentPrice, {
              decimalsDigits: 0,
              decimalSeparator: "",
            })}
            đ
          </Text>
        </HStack>
      </VStack>
      <HStack
        mt="20%"
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
        <Button
          borderRadius={20}
          onPress={() => {
            changePosition(true);
          }}
        >
          Tiếp tục
        </Button>
      </HStack>
    </VStack>
  );
};
