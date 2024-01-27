import {
  Avatar,
  Box,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Text,
  VStack,
  Image,
  Button,
} from "native-base";

import { StaffInfoScreenProps } from "../../../../Navigator/StaffInfoNavigator";
import { appColor } from "../../../../theme";

export default function StaffInfoScreen({
  navigation,
  route,
}: StaffInfoScreenProps) {
  const staff = route.params.staff;
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
      borderRadius={20}
    >
      <Heading>Thông tin nhân viên</Heading>
      <Box
        width="full"
        alignItems="center"
        py={3}
        mb={3}
        borderBottomWidth={1}
        borderBottomColor="#EDEDF2"
      >
        <Image
          size={150}
          borderRadius={100}
          source={require("../../../../assets/images/default_avatar.jpg")}
          alt={staff.email}
        />
        {/* <Text color={appColor.textTitle} fontWeight="extrabold" fontSize="17">
          {staff?.lastName + " " + staff?.firstName}
        </Text>
        <Text color={appColor.textSecondary}>{staff?.email}</Text> */}
      </Box>
      <Box alignItems="flex-start" width="100%">
        <VStack space="5">
          <HStack justifyContent="space-between" width="full">
            <Text color={appColor.textSecondary}>Họ và tên</Text>
            <Text color={appColor.textSecondary}>
              {staff.lastName + " " + staff.firstName}
            </Text>
          </HStack>

          <HStack justifyContent="space-between" width="full">
            <Text color={appColor.textSecondary}>Địa chỉ Email</Text>
            <Text color={appColor.textSecondary}>{staff.email}</Text>
          </HStack>

          <HStack justifyContent="space-between" width="full">
            <Text color={appColor.textSecondary}>Vai trò</Text>
            <Text color={appColor.textSecondary}>{staff.role.name}</Text>
          </HStack>
          <HStack width="full">
            <Button
              width="full"
              onPress={() => {
                navigation.navigate("StaffSchedule");
              }}
            >
              Xem lịch làm việc
            </Button>
          </HStack>
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
        </VStack>
      </Box>
    </Box>
  );
}
