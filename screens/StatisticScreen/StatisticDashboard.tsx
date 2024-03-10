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
  View,
} from "native-base";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
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
import { G } from "react-native-svg";
const { format } = require("number-currency-format");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

export interface IForm {
  startDate?: string | undefined;
  endDate?: string | undefined;
}
export interface IChartData {
  value: number;
  date: string;
  label: string;
  labelTextStyle: any;
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
  const [revenueStatistic, setRevenueStatistic] = useState<lineDataItem[]>();
  const [appointmentStatistic, setAppointmentStatistic] =
    useState<lineDataItem[]>();
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
    // Call API
    if (clinic?.id) {
      try {
        const response = await clinicService.getStatisticPeriod(
          clinic?.id,
          dayjs(startDate).format("YYYY/MM/DD"),
          dayjs(endDate).format("YYYY/MM/DD")
        );
        if (response.status && response.data) {
          // Handle revenue
          const revenueData: IChartData[] = [];
          for (let i = 0; i < response.data.length; i++) {
            const revenueItem: IChartData = {
              value: response.data[i].revenue,
              date: response.data[i].date,
              label:
                (i % 3 === 0) === true
                  ? dayjs(response.data[i].date, "MMM DD YYYY")
                      .locale("en")
                      .format("DD/MM")
                  : "",
              labelTextStyle: {
                color: appColor.textSecondary,
                width: 50,
                marginLeft: -14,
              },
            };
            revenueData.push(revenueItem);
          }
          setRevenueStatistic(revenueData);
          // Handle Appointment
          const appointmentData: IChartData[] = [];
          for (let i = 0; i < response.data.length; i++) {
            const appointmentItem: IChartData = {
              value: response.data[i].numberOfAppointments,
              date: response.data[i].date,
              label:
                (i % 3 === 0) === true
                  ? dayjs(response.data[i].date, "MMM DD YYYY")
                      .locale("en")
                      .format("DD/MM")
                  : "",
              labelTextStyle: {
                color: appColor.textSecondary,
                width: 50,
                marginLeft: -14,
              },
            };
            appointmentData.push(appointmentItem);
          }
          setAppointmentStatistic(appointmentData);
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
  console.log(StatisticCurrentDay);
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
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
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
            fontSize={14}
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
        <Box width="full" alignItems="center" py={3} mb={3}>
          <Text
            alignSelf="flex-start"
            fontSize={25}
            fontWeight="bold"
            color={appColor.textTitle}
            width="full"
            mt={-4}
          >
            Thống kê
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
          <View mt={4} w="full">
            <Text
              fontSize={16}
              fontWeight="bold"
              color={appColor.inputLabel}
              mb={4}
            >
              Biểu đồ doanh thu
            </Text>
            <LineChart
              isAnimated
              areaChart
              width={280}
              curved
              data={revenueStatistic}
              height={300}
              // showVerticalLines
              spacing={30}
              initialSpacing={25}
              endSpacing={30}
              color1={appColor.primary}
              textColor1={appColor.primary}
              hideDataPoints={false}
              dataPointsColor1={appColor.primary}
              startFillColor1={appColor.primary}
              startOpacity={0.8}
              endOpacity={0.3}
              yAxisTextStyle={{
                color: appColor.textSecondary,
              }}
              // maxValue={5000000}
              yAxisLabelWidth={50}
              yAxisLabelSuffix="M"
              formatYLabel={(label: string) => {
                const newVal = parseInt(label) / 1000000;
                return format(newVal, {
                  decimalsDigits: 2,
                  decimalSeparator: ".",
                });
              }}
              pointerConfig={{
                pointerStripHeight: 160,
                pointerStripColor: "#fe6837",
                pointerStripWidth: 4,
                pointerColor: "lightgray",
                radius: 6,
                pointerLabelWidth: 100,
                pointerLabelHeight: 90,
                activatePointersOnLongPress: true,
                autoAdjustPointerLabelPosition: false,
                pointerLabelComponent: (items: any) => {
                  return (
                    <View
                      style={{
                        height: 90,
                        width: 100,
                        justifyContent: "center",
                        marginTop: -30,
                        marginLeft: -40,
                      }}
                    >
                      <Text
                        style={{
                          // color: appColor.primary,
                          fontSize: 14,
                          textAlign: "center",
                        }}
                      >
                        {dayjs(items[0].date, "MMM DD YYYY")
                          .locale("en")
                          .format("DD/MM")}
                      </Text>

                      <View
                      // style={{
                      //   paddingHorizontal: 14,
                      //   paddingVertical: 6,
                      //   borderRadius: 16,
                      //   backgroundColor: "white",
                      // }}
                      >
                        <Text
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {format(items[0].value, {
                            decimalsDigits: 0,
                            decimalSeparator: "",
                          })}
                          đ
                        </Text>
                      </View>
                    </View>
                  );
                },
              }}
            />
          </View>
          {/**Appointment chart */}
          <View mt={4} w="full">
            <Text
              fontSize={16}
              fontWeight="bold"
              color={appColor.inputLabel}
              mb={4}
            >
              Biểu đồ lịch hẹn khám
            </Text>
            <LineChart
              isAnimated
              areaChart
              width={280}
              curved
              data={appointmentStatistic}
              height={300}
              // showVerticalLines
              spacing={30}
              initialSpacing={25}
              endSpacing={30}
              color1={appColor.primary}
              textColor1={appColor.primary}
              hideDataPoints={false}
              dataPointsColor1={appColor.primary}
              startFillColor1={appColor.primary}
              startOpacity={0.8}
              endOpacity={0.3}
              yAxisTextStyle={{
                color: appColor.textSecondary,
              }}
              // maxValue={}
              yAxisLabelWidth={50}
              pointerConfig={{
                pointerStripHeight: 160,
                pointerStripColor: "#fe6837",
                pointerStripWidth: 4,
                pointerColor: "lightgray",
                radius: 6,
                pointerLabelWidth: 100,
                pointerLabelHeight: 90,
                activatePointersOnLongPress: true,
                autoAdjustPointerLabelPosition: false,
                pointerLabelComponent: (items: any) => {
                  return (
                    <View
                      style={{
                        height: 90,
                        width: 100,
                        justifyContent: "center",
                        marginTop: -30,
                        marginLeft: -40,
                      }}
                    >
                      <Text
                        style={{
                          // color: appColor.primary,
                          fontSize: 14,
                          textAlign: "center",
                        }}
                      >
                        {dayjs(items[0].date, "MMM DD YYYY")
                          .locale("en")
                          .format("DD/MM")}
                      </Text>

                      <View
                      // style={{
                      //   paddingHorizontal: 14,
                      //   paddingVertical: 6,
                      //   borderRadius: 16,
                      //   backgroundColor: "white",
                      // }}
                      >
                        <Text
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {items[0].value}
                        </Text>
                      </View>
                    </View>
                  );
                },
              }}
            />
          </View>
        </Box>
        <Button
          onPress={() => {
            navigation.goBack();
          }}
        >
          Quay lại
        </Button>
      </ScrollView>
    </Box>
  );
}
