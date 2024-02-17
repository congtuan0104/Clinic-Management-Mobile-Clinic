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
  
  import {PatientInfoNavigatorProps } from "../../Navigator";
  import { appColor } from "../../theme";
  
  export default function StaffInfoScreen({
    navigation,
    route,
  }: PatientInfoNavigatorProps) {
    const patient = route.params?.patient;
    return (
      <ScrollView>
        <Box
          bgColor="#fff"
          minWidth="90%"
          maxWidth="90%"
          minH="100%"
          maxH="100%"
          alignSelf="center"
          alignItems="center"
          p={5}
          borderRadius={20}
        >
          <Heading>Thông tin bệnh nhân</Heading>
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
              source={patient.avatar? {uri: patient.avatar} : require("../../assets/images/default_avatar.jpg")}
              alt="avatar"
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
                  {patient.firstName + " " + patient.lastName}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text color={appColor.textSecondary}>Địa chỉ Email</Text>
                <Text color={appColor.textSecondary}>{patient.email}</Text>
              </HStack>
              
              <HStack justifyContent="space-between" width="full">
                <Text color={appColor.textSecondary}>Địa chỉ</Text>
                <Text color={appColor.textSecondary}>{patient.address}</Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text color={appColor.textSecondary}>Số điện thoại</Text>
                <Text color={appColor.textSecondary}>{patient.phone}</Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text color={appColor.textSecondary}>Giới tính</Text>
                <Text color={appColor.textSecondary}>{patient.gender===1? "Nam" : (patient.gender===0? "Nữ" : null)}</Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text color={appColor.textSecondary}>Ngày sinh</Text>
                <Text color={appColor.textSecondary}>{patient.birthday? patient.birthday.slice(0,10).split("-").reverse().join("-") : null}</Text>
              </HStack>
              <HStack width="full">
                <Button
                  width="full"
                  onPress={() => {
                    navigation.navigate("MedicalRecordNavigator", {patient: patient});
                  }}
                >
                  Xem hồ sơ bệnh án
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
      </ScrollView>
    );
  }
  