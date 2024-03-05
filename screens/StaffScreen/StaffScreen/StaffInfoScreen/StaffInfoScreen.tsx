import {
  Box,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
  Image,
  Button,
} from "native-base";
import { StaffInfoScreenProps } from "../../../../Navigator/StaffInfoNavigator";
import { appColor } from "../../../../theme";
import { useEffect, useState } from "react";
import { staffApi } from "../../../../services";
import { helpers } from "../../../../utils/helper";
import { IClinicStaff, IRolePermission } from "../../../../types";
import HTMLView from "react-native-htmlview";

export interface ISchedule {
  day: number;
  startTime: string | null;
  endTime: string | null;
}

export default function StaffInfoScreen({
  navigation,
  route,
}: StaffInfoScreenProps) {
  const staffId = route.params.staff.id;
  const [rolePermissions, setRolePermissions] = useState<any | null>(null);
  const [staff, setStaff] = useState<IClinicStaff | null>(null);
  let scheduleArray: ISchedule[] = [
    {
      day: 2,
      startTime: null,
      endTime: null,
    },
    {
      day: 3,
      startTime: null,
      endTime: null,
    },
    {
      day: 4,
      startTime: null,
      endTime: null,
    },
    {
      day: 5,
      startTime: null,
      endTime: null,
    },
    {
      day: 6,
      startTime: null,
      endTime: null,
    },
    {
      day: 7,
      startTime: null,
      endTime: null,
    },
    {
      day: 1,
      startTime: null,
      endTime: null,
    },
  ];
  const [schedule, setSchedule] = useState<ISchedule[] | null>(null);
  const getStaffInfo = async () => {
    const response = await staffApi.getStaff(staffId);
    if (response.data) {
      setStaff(response.data);
      setRolePermissions(response.data.role.permissions);
      getStaffSchedule();
    }
  };
  const getStaffSchedule = async () => {
    const response = await staffApi.getStaffSchedule(staffId);

    if (response.data && response.data.length) {
      for (let i = 0; i < response.data.length; i++) {
        const item = response.data[i];
        const index = scheduleArray.findIndex(
          (scheduleItem) => scheduleItem.day === item.day
        );
        scheduleArray[index].startTime = item.startTime;
        scheduleArray[index].endTime = item.endTime;
      }
      setSchedule(scheduleArray);
    }
  };
  useEffect(() => {
    getStaffInfo();
  }, [staffId]);
  return (
    <ScrollView>
      {staff && (
        <Box
          bgColor="#fff"
          minWidth="90%"
          maxWidth="90%"
          minH="98%"
          maxH="98%"
          alignSelf="center"
          alignItems="center"
          p={5}
          borderBottomRadius={20}
        >
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
              source={
                staff?.users?.avatar
                  ? { uri: staff?.users?.avatar }
                  : require("../../../../assets/user.png")
              }
              alt="avatar"
            />
            {/* <Text color={appColor.textTitle} fontWeight="extrabold" fontSize="17">
              {staff?.lastName + " " + staff?.firstName}
            </Text>
            <Text color={appColor.textSecondary}>{staff?.email}</Text> */}
          </Box>
          <Box
            pb={3}
            mb={3}
            borderBottomWidth={1}
            borderBottomColor="#EDEDF2"
            alignItems="flex-start"
            width="100%"
          >
            <Text
              alignSelf="flex-start"
              fontSize={16}
              fontWeight="bold"
              color={appColor.textTitle}
              width="full"
              mb={3}
            >
              Thông tin cá nhân
            </Text>
            <VStack space="5">
              <HStack justifyContent="space-between" width="full">
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Họ và tên
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff?.users?.firstName + " " + staff?.users?.lastName}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Địa chỉ Email
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff?.users?.email}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Vai trò
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff.role.name}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Địa chỉ
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff?.users?.address
                    ? staff?.users?.address
                    : "Chưa cập nhật"}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Số điện thoại
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff?.users?.phone ? staff?.users?.phone : "Chưa cập nhật"}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Giới tính
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff?.users?.gender === 1
                    ? "Nam"
                    : staff?.users?.gender === 0
                    ? "Nữ"
                    : "Chưa cập nhật"}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Ngày sinh
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff?.users?.birthday
                    ? staff?.users?.birthday
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")
                    : "Chưa cập nhật"}
                </Text>
              </HStack>
            </VStack>
          </Box>
          <Box
            pb={3}
            borderBottomWidth={1}
            borderBottomColor="#EDEDF2"
            width="full"
            mb={3}
          >
            <Text
              alignSelf="flex-start"
              fontSize={16}
              fontWeight="bold"
              color={appColor.textTitle}
              width="full"
              mb={3}
            >
              Thông tin vai trò
            </Text>
            <VStack space="5">
              <HStack>
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Vai trò
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff.role.name}
                </Text>
              </HStack>

              <HStack>
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Chuyên khoa
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff.specialize ? staff.specialize : "Không có"}
                </Text>
              </HStack>
              <HStack>
                <Text flex={1} fontWeight="bold" color={appColor.textSecondary}>
                  Năm KN
                </Text>
                <Text flex={2} textAlign="right" color={appColor.textSecondary}>
                  {staff.experience ? staff.experience : "Không có"}
                </Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" color={appColor.textSecondary}>
                  Các quyền:{" "}
                </Text>
              </HStack>
              <VStack ml={5} space={4}>
                {rolePermissions &&
                  rolePermissions.map((permission: any, index: number) => {
                    return (
                      <Text color={appColor.textSecondary}>
                        - {permission.optionName}
                      </Text>
                    );
                  })}
              </VStack>
              <Text fontWeight="bold" color={appColor.textSecondary}>
                Mô tả:{" "}
              </Text>
              {staff.description ? (
                <HTMLView value={staff.description} />
              ) : (
                <Text color={appColor.textSecondary}>Không có</Text>
              )}
            </VStack>
          </Box>
          <Box width="full" mb={3}>
            <Text
              alignSelf="flex-start"
              fontSize={16}
              fontWeight="bold"
              color={appColor.textTitle}
              width="full"
              mb={3}
            >
              Lịch làm việc
            </Text>
            <VStack space={4}>
              {schedule &&
                schedule.map((scheduleItem: ISchedule, index: number) => {
                  return (
                    <HStack key={index}>
                      <Text
                        flex={2}
                        color={appColor.textSecondary}
                        fontWeight="bold"
                        fontSize={14}
                      >
                        {helpers.getDay(scheduleItem.day) + ":"}
                      </Text>
                      <Text flex={5} color={appColor.textSecondary}>
                        {scheduleItem.startTime &&
                          scheduleItem.endTime &&
                          scheduleItem.startTime + " - " + scheduleItem.endTime}
                        {(!scheduleItem.startTime || !scheduleItem.endTime) &&
                          "  --:--    -    --:--  "}
                      </Text>
                    </HStack>
                  );
                })}
            </VStack>
          </Box>
          <HStack width="full" mt={4} mb={8}>
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
      )}
    </ScrollView>
  );
}
