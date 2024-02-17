import {
  Box,
  Button,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";

import { StaffScheduleScreenProps } from "../../../../Navigator/StaffInfoNavigator";
import { appColor } from "../../../../theme";

export default function StaffScheduleScreen({
  navigation,
  route,
}: StaffScheduleScreenProps) {
  return (
    <Box
      bgColor="#fff"
      minWidth="90%"
      maxWidth="90%"
      minH="95%"
      maxH="95%"
      alignSelf="center"
      alignItems="center"
      p={5}
      borderBottomRadius={20}
    >
      <Heading>Lịch làm việc</Heading>
      <Box
        width="full"
        alignItems="center"
        py={3}
        mb={3}
        borderBottomWidth={1}
        borderBottomColor="#EDEDF2"
      >
        <HStack width="full">
          <Button
            width="full"
            onPress={() => {
              navigation.goBack();
            }}
          >
            Quay lại
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
