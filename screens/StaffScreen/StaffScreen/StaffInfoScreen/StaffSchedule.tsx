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
import { useEffect, useState } from "react";
import { staffApi } from "../../../../services";
import { IStaffSchedule } from "../../../../types";
import { helpers } from "../../../../utils/helper";

export interface ISchedule {
  day: number;
  startTime: string | null;
  endTime: string | null;
}
export default function StaffScheduleScreen({
  navigation,
  route,
}: StaffScheduleScreenProps) {
  const staffId = route.params.staffId;
  let scheduleArray: ISchedule[] = [
    {
      day: 1,
      startTime: null,
      endTime: null,
    },
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
  ];
  const [schedule, setSchedule] = useState<ISchedule[] | null>(null);
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
    getStaffSchedule();
  }, []);
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
        <Box>
          <VStack space={4}>
            {schedule &&
              schedule.map((scheduleItem: ISchedule, index: number) => {
                return (
                  <HStack>
                    <Text fontSize={1}>
                      {helpers.getDay(scheduleItem.day) + ":"}
                    </Text>
                    <Text>
                      {scheduleItem.startTime &&
                        scheduleItem.endTime &&
                        scheduleItem.startTime + " - " + scheduleItem.endTime}
                      {(!scheduleItem.startTime || !scheduleItem.endTime) &&
                        "-- : --"}
                    </Text>
                  </HStack>
                );
              })}
          </VStack>
        </Box>
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
