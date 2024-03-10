import {
  Box,
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
  Image,
  Input,
  FormControl,
  WarningOutlineIcon,
  Button,
} from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import { clinicService } from "../../services";
import { StatisticDashboardProps } from "../../Navigator/StatisticNavigator";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import dayjs from "dayjs";
import { IClinicStatisticOneDay, IClinicStatisticPeriod } from "../../types";
import ToastAlert from "../../components/Toast/Toast";
import { appColor } from "../../theme";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export interface IForm {
  startDate?: string | undefined;
  endDate?: string | undefined;
}
// Validate
const schema: yup.ObjectSchema<IForm> = yup.object({
  startDate: yup.string(),
  endDate: yup.string(),
});

export default function StatisticDashboardScreen({
  navigation,
  route,
}: StatisticDashboardProps) {
  const clinic = useAppSelector(ClinicSelector);
  const [StatisticCurrentDay, setStatisticCurrentDay] =
    useState<IClinicStatisticOneDay | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  // handle start date
  const [startDate, setStartDate] = useState<Date>(new Date());

  const [startDateDatePickerVisible, setStartDateDatePickerVisible] =
    useState<boolean>(false);
  const showStartDateDatePicker = () => {
    setStartDateDatePickerVisible(true);
  };
  const hideStartDateDatePicker = () => {
    setStartDateDatePickerVisible(false);
  };

  const handleConfirmStartDate = (date: Date) => {
    //console.log("date confirmed: ", date);
    hideStartDateDatePicker();
    setStartDate(date);
    handleSubmit(onSubmit)();
  };
  // handle end date
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [EndDateDatePickerVisible, setEndDateDatePickerVisible] =
    useState<boolean>(false);
  const showEndDateDatePicker = () => {
    setEndDateDatePickerVisible(true);
  };
  const hideEndDateDatePicker = () => {
    setEndDateDatePickerVisible(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    //console.log("date confirmed: ", date);
    hideEndDateDatePicker();
    setEndDate(date);
    handleSubmit(onSubmit)();
  };

  // Handle period
  const [periodStatistic, setPeriodStatistic] = useState<
    IClinicStatisticPeriod[] | null
  >(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: dayjs(new Date())
        .format("DD/MM/YYYY")
        ?.split("-")
        .reverse()
        .join("/"),
      endDate: dayjs(new Date())
        .format("DD/MM/YYYY")
        ?.split("-")
        .reverse()
        .join("/"),
    },
  });

  // Handle current date
  const getStatisticCurrentDay = async () => {
    try {
      if (clinic?.id) {
        const response = await clinicService.getStatisticOneDay(
          clinic?.id,
          dayjs(new Date()).format("YYYY/MM/DD")
        );
        if (response.status && response.data) {
          setStatisticCurrentDay(response.data);
        } else {
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Lỗi"
                  description={response.message}
                  status="error"
                />
              );
            },
          });
        }
      }
    } catch (error: any) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Lỗi"
              description={error.response.data.message}
              status="error"
            />
          );
        },
      });
    }
  };

  const onSubmit = async (data: IForm) => {
    console.log("Submit: ", data);
    // Call API
    if (clinic?.id) {
      try {
        const response = await clinicService.getStatisticPeriod(
          clinic?.id,
          dayjs(startDate).format("YYYY/MM/DD"),
          dayjs(endDate).format("YYYY/MM/DD")
        );
        if (response.status && response.data) {
          console.log(response.data);
        } else {
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Lỗi"
                  description={response.message}
                  status="error"
                />
              );
            },
          });
        }
      } catch (error: any) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Lỗi"
                description={error.response.data.message}
                status="error"
              />
            );
          },
        });
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      getStatisticCurrentDay();
    }, [clinic?.id])
  );

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
      mt="5%"
    >
      <DateTimePickerModal
        date={startDate}
        isVisible={startDateDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmStartDate}
        onCancel={hideStartDateDatePicker}
      />
      <DateTimePickerModal
        date={endDate}
        isVisible={EndDateDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmEndDate}
        onCancel={hideEndDateDatePicker}
      />
      <ScrollView showsVerticalScrollIndicator={false} width="full">
        <Box
          width="full"
          alignItems="center"
          py={3}
          mb={3}
          borderBottomWidth={1}
          borderBottomColor="#EDEDF2"
        >
          <Text
            alignSelf="flex-start"
            fontSize={25}
            fontWeight="bold"
            color={appColor.textTitle}
            width="full"
            mt={-4}
          >
            Tổng quan
          </Text>
          <Text
            alignSelf="flex-start"
            fontSize={16}
            fontWeight="bold"
            color={appColor.textTitle}
            width="full"
            mb={3}
          >
            Ngày: {dayjs(new Date()).format("DD/MM/YYYY")}
          </Text>
          <VStack w="full" space={5}>
            <HStack
              justifyContent="space-between"
              backgroundColor="secondary.100"
              borderRadius={20}
              p={3}
              pb={-4}
              px={8}
            >
              <Image
                source={require("../../assets/images/statistic/patient.png")}
                size={20}
              />
              <Box alignItems="flex-end">
                <Text color={appColor.primary} fontSize={16}>
                  Bệnh nhân mới
                </Text>
                <Text fontSize={40} color="primary.400">
                  {StatisticCurrentDay?.totalPatients}
                </Text>
              </Box>
            </HStack>
            <HStack
              px={8}
              justifyContent="space-between"
              backgroundColor="secondary.100"
              borderRadius={20}
              p={3}
              pb={-4}
            >
              <Image
                source={require("../../assets/images/statistic/revenue.png")}
                size={20}
              />
              <Box alignItems="flex-end">
                <Text color={appColor.primary} fontSize={16}>
                  Doanh thu
                </Text>
                <Text fontSize={40} color="primary.400">
                  {StatisticCurrentDay?.totalRevenue}
                </Text>
              </Box>
            </HStack>
            <HStack
              px={8}
              justifyContent="space-between"
              backgroundColor="secondary.100"
              borderRadius={20}
              p={3}
              pb={-4}
            >
              <Image
                source={require("../../assets/images/statistic/appointment.png")}
                size={20}
              />
              <Box alignItems="flex-end">
                <Text color={appColor.primary} fontSize={16}>
                  Lịch hẹn
                </Text>
                <Text fontSize={40} color="primary.400">
                  {StatisticCurrentDay?.totalAppointments}
                </Text>
              </Box>
            </HStack>
            <HStack
              px={8}
              justifyContent="space-between"
              backgroundColor="secondary.100"
              borderRadius={20}
              p={3}
              pb={-4}
            >
              <Image
                source={require("../../assets/images/statistic/examination.png")}
                size={20}
              />
              <Box alignItems="flex-end">
                <Text color={appColor.primary} fontSize={16}>
                  Khám bệnh
                </Text>
                <Text fontSize={40} color="primary.400">
                  {StatisticCurrentDay?.totalExaminations}
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Box>
        <Box
          width="full"
          alignItems="center"
          py={3}
          mb={3}
          borderBottomWidth={1}
          borderBottomColor="#EDEDF2"
        >
          <Text
            alignSelf="flex-start"
            fontSize={25}
            fontWeight="bold"
            color={appColor.textTitle}
            width="full"
            mt={-4}
          >
            Thống kê doanh thu
          </Text>
          <HStack space="5%">
            {/**StartDate */}
            <FormControl isInvalid={errors.startDate ? true : false} flex={1}>
              <FormControl.Label
                _text={{
                  bold: true,
                  color: appColor.inputLabel,
                }}
              >
                Ngày bắt đầu{" "}
              </FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    placeholder=""
                    onChangeText={onChange}
                    value={startDate
                      ?.toISOString()
                      .substring(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")}
                    onBlur={onBlur}
                    onFocus={showStartDateDatePicker}
                  />
                )}
                name="startDate"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.startDate && <Text>{errors.startDate.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
            {/**EndDate */}
            <FormControl flex={1} isInvalid={errors.startDate ? true : false}>
              <FormControl.Label
                _text={{
                  bold: true,
                  color: appColor.inputLabel,
                }}
              >
                Ngày kết thúc{" "}
              </FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    placeholder=""
                    onChangeText={onChange}
                    value={endDate
                      ?.toISOString()
                      .substring(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")}
                    onBlur={onBlur}
                    onFocus={showEndDateDatePicker}
                  />
                )}
                name="endDate"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.endDate && <Text>{errors.endDate.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
          </HStack>
        </Box>
        <Button onPress={handleSubmit(onSubmit)}>fff</Button>
      </ScrollView>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
    </Box>
  );
}
