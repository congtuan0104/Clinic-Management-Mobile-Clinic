import { Box, HStack, VStack, Text } from "native-base";
import { appColor } from "../../theme";
const { format } = require("number-currency-format");

export const PlanDataCard = (props: any) => {
  const { planData } = props;
  return (
    <Box backgroundColor="#DAD9FF" borderRadius={20} p={3}>
      <HStack alignItems="center" justifyContent="space-between">
        <VStack>
          <Text fontWeight="bold" color={appColor.textTitle} fontSize={16}>
            {planData.planName}
          </Text>
          <Text fontSize={14}>- {planData.duration} ngày</Text>
          <HStack justifyContent="space-between" width="90%">
            <Text fontSize={14}>- {planData.planOptions.length} chức năng</Text>
            <Text
              fontSize={15}
              color="#b92a00"
              fontWeight="bold"
              fontFamily="body"
            >
              {format(planData.currentPrice, {
                decimalsDigits: 0,
                decimalSeparator: "",
              })}
              đ
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};
