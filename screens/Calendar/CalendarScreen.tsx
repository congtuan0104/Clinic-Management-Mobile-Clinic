import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useToast } from 'native-base'
import { useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import SelectDropdown from "react-native-select-dropdown";
import { CalendarNavigatorProps } from "../../Navigator/UserNavigator";
import Timeline from "react-native-timeline-flatlist";
import moment from "moment";
import { CalendarList } from "react-native-calendars";
import { IAppointment, IUpdateAppointmentPayload } from "../../types";
import { APPOINTMENT_STATUS } from "../../enums";
import { appointmentApi } from '../../services'
import ToastAlert from "../../components/Toast/Toast";
import Task from "./Task";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { SafeAreaView } from "react-native-safe-area-context";

const leftArrowIcon = require("../../assets/left-arrow.png");
const rightArrowIcon = require("../../assets/right-arrow.png");


const datesWhitelist = [
  {
    start: moment(),
    end: moment().add(365, "days"), // total 4 days enabled
  },
];



type TimelineEventsState = {
  time: string;
  title: string;
  description: string;
  circleColor: string;
  lineColor: string;
};

export default function CalendarScreen({ navigation }: CalendarNavigatorProps) {
  const clinic = useAppSelector(ClinicSelector);
  //const [markedDate, setMarkedDate] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState(
    `${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
      "DD"
    )}`
  );
  //const [todoList, setTodoList] = useState<Array<IAppointment> | undefined>();
  const [appointmentList, setAppointmentList] = useState<IAppointment[]>([])
  const [currentDay, setCurrentDay] = useState(moment().format());
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<IAppointment | undefined>();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEventsState[] >();
  const [isReRender, setIsReRender] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<APPOINTMENT_STATUS>()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState({
    [`${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
      "DD"
    )}`]: {
      selected: true,
      selectedColor: "#2E66E7",
    },
  });
  // const vietnamMoment = moment().utcOffset("+07:00"); // Đặt múi giờ UTC+7 cho Việt Nam
  // const formattedDate = `${vietnamMoment.format("YYYY-MM-DD")}`;
  const toast = useToast();
  const handleReRender = () => setIsReRender(!isReRender)
  const getAppointmentList = async () => {
    try {
      if (clinic?.id)
      {
        const response = await appointmentApi.getAppointmentList({
          clinicId: clinic?.id,
        })
        console.log('response: ', response);
        if (response.status && response.data) {
          setAppointmentList(response.data)
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() =>{
    getAppointmentList();
    console.log('vao day')
  }, [clinic?.id, isReRender])

  console.log('render lai trang lich')
  const currentDateAppointments: Array<IAppointment> = useMemo(() => {
    //const currentDateObj = new Date(currentDate);
    return appointmentList.filter((item) => {
      return (     
        currentDate === item.date
      );
    });
  }, [currentDate]);

  const markedDate = useMemo(
    () =>
      appointmentList.reduce((accumulator: any, item) => {
        const key = item.date;
  
        // Nếu key đã tồn tại trong accumulator, thì cập nhật thuộc tính marked
        if (accumulator[key]) {
          accumulator[key].marked = true;
        } else {
          // Nếu key chưa tồn tại, tạo mới với thuộc tính marked
          accumulator[key] = { marked: true, dotColor: 'blue'};
        }
  
        return accumulator;
      }, {}),
    [appointmentList]
  );
  console.log("markedDate: ", markedDate);
  useEffect(() => {
    console.log("toldoList before: ", currentDateAppointments);
    console.log("current day: ", currentDate);
    const fetchData = async () => {
      try {
        await getTimelineEvents();
        console.log(
          "timeline events after getTimelineEvents: ",
          timelineEvents
        );
        console.log("currentDateAppointments after: ", currentDateAppointments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    console.log("currentDateAppointments after after: ", currentDateAppointments);
  }, [currentDate]);

  const handleModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  const getTimelineEvents = async () => {
    console.log("appointment list in settimelineevent: ", currentDateAppointments);
    const newArray = currentDateAppointments?.map((item: IAppointment) => {
      // console.log('start time string: ', startTimeString);
      return {
        time: item.startTime,
        title: item.patient.firstName + ' ' + item.patient.lastName,
        description: item.description? item.description : "",
        circleColor: "#009688",
        lineColor: "#009688",
      };
    });

    setTimelineEvents(newArray);
    console.log("timelineevent in gettimelineEvent after: ", timelineEvents);
  };

  const handleUpdateAppointment = async () => {
    setIsLoading(true)
    const payload: IUpdateAppointmentPayload = {
      clinicId: clinic!.id,
      doctorId: parseInt(selectedTask!.doctorId),
      serviceId: selectedTask!.serviceId,
      date: selectedTask!.date,
      patientId: parseInt(selectedTask!.patientId),
      startTime: selectedTask!.startTime,
      endTime: selectedTask!.endTime,
      description: selectedTask!.description,
      status: selectedStatus!
    }
    console.log('payload:', payload);
    const res = await appointmentApi.updateAppointment(parseInt(selectedTask!.id), payload)
    setModalVisible(false)
    setIsLoading(false)
    if (res.status) {
      toast.show({
        render: () => {
            return (
            <ToastAlert
                title="Thành công"
                description="Cập nhật lịch hẹn thành công!"
                status="success"
            />
            );
        },
        });
    }
    else {
        toast.show({
            render: () => {
            return (
                <ToastAlert
                title="Lỗi"
                description="Cập nhật thất bại. Vui lòng kiểm tra lại thông tin."
                status="error"
                />
            );
            },
        });
    }

  }


  return (
    <Fragment>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      {selectedTask !== null && (
        <>
          <Task {...{ setModalVisible, isModalVisible }}>
            
            <View style={styles.taskContainer}>
              <Text
                style={{
                  color: "#9CAAC4",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 5
                }}
              >
                Tên bệnh nhân
              </Text>
              <TextInput
                style={styles.title}
                onChangeText={(text) => {
                  let prevSelectedTask = JSON.parse(
                    JSON.stringify(selectedTask)
                  );
                  prevSelectedTask.title = text;
                  setSelectedTask(prevSelectedTask);
                }}
                value={selectedTask?.patient.firstName + ' ' + selectedTask?.patient.lastName}
                placeholder="Tên bệnh nhân?"
              />
              <Text
                style={{
                  color: "#9CAAC4",
                  fontSize: 16,
                  fontWeight: "600",
                  marginVertical: 10,
                }}
              >
                Bác sĩ
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text>{selectedTask?.doctor.firstName + ' ' + selectedTask?.doctor.lastName}</Text>
              </View>
              <View style={styles.notesContent} />
              <View>
                <Text
                  style={{
                    color: "#9CAAC4",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Ghi chú
                </Text>
                <TextInput
                  style={{
                    height: 25,
                    fontSize: 19,
                    marginTop: 3,
                  }}
                  onChangeText={(text) => {
                    let prevSelectedTask = JSON.parse(
                      JSON.stringify(selectedTask)
                    );
                    prevSelectedTask.notes = text;
                    setSelectedTask(prevSelectedTask);
                  }}
                  value={selectedTask?.description}
                  placeholder=""
                />
              </View>
              <View style={styles.separator} />
              <View>
                <Text
                  style={{
                    color: "#9CAAC4",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Thời gian
                </Text>
                <TouchableOpacity
                  onPress={() => null}
                  style={{
                    height: 25,
                    marginTop: 3,
                  }}
                >
                  <Text style={{ fontSize: 19 }}>
                    {selectedTask?.startTime}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "#9CAAC4",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Trạng thái
                  </Text>
                  
                  <SelectDropdown
                    data={[
                      APPOINTMENT_STATUS.PENDING,
                      APPOINTMENT_STATUS.CONFIRM,
                      APPOINTMENT_STATUS.CHECK_IN,                      
                      APPOINTMENT_STATUS.CANCEL,
                    ]}
                    onSelect={(selectedItem, index) => {
                      setSelectedStatus(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item;
                    }}
                    defaultButtonText={selectedTask?.status}
                  />
                </View>
                {/* <Switch
                value={selectedTask?.alarm?.isOn || false}
                onValueChange={handleAlarmSet}
              /> */}
              </View>
              <View>
              <TouchableOpacity
                style={{
                  width: 180,
                  height: 48,
                  alignSelf: "flex-end",
                  marginTop: 15,
                  borderRadius: 5,
                  justifyContent: "center",
                  backgroundColor:
                     "#2E66E7",
                }}
                onPress={handleUpdateAppointment}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Cập nhật trạng thái
                </Text>
              </TouchableOpacity>
            </View>
            </View>
          </Task>
        </>
      )}
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        
        
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateTaskNavigator")}
          style={styles.viewTask}
        >
          <Image
            source={require("../../assets/plus.png")}
            style={{
              height: 30,
              width: 30,
            }}
            alt="plus"
          />
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            height: Dimensions.get("window").height - 170,
            marginTop: -20
          }}
        >           
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            nestedScrollEnabled={true}
          >
            <CalendarList
              style={{
                width: 350,
                height: 350,
                alignSelf: 'center', 
              }}
              current={currentDay}
              minDate={moment().format()}
              horizontal
              pastScrollRange={0}
              pagingEnabled
              calendarWidth={350}
              onDayPress={(day) => {
                setSelectedDay({
                  [day.dateString]: {
                    selected: true,
                    selectedColor: "#2E66E7",
                  },
                });
                setCurrentDay(day.dateString);
                setCurrentDate(day.dateString);
              }}
              monthFormat="yyyy MMMM"
              hideArrows
              markingType="custom"
              theme={{
                selectedDayBackgroundColor: "#2E66E7",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#2E66E7",
                backgroundColor: "#eaeef7",
                calendarBackground: "#eaeef7",
                textDisabledColor: "#d9dbe0",
              }}
              //markedDates={selectedDay}
              markedDates={{
                ...markedDate,
                ...selectedDay,

              }}
            />
            <Timeline
              style={{ flex: 1 }}
              data={timelineEvents}
              separator={true}
              circleSize={20}
              circleColor="rgb(45,156,219)"
              lineColor="rgb(45,156,219)"
              timeContainerStyle={{ minWidth: 52, marginTop: 0 }}
              timeStyle={{
                textAlign: "center",
                backgroundColor: "#ff9797",
                color: "white",
                padding: 5,
                borderRadius: 13,
                overflow: "hidden"
              }}
              descriptionStyle={{ color: "gray" }}
            />
            {currentDateAppointments?.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTask(item);
                  setModalVisible(true);
                }}
                key={item.id}
                style={styles.taskListContent}
              >
                <View
                  style={{
                    marginLeft: 13,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: "#64d4d2",
                        marginRight: 8,
                      }}
                    />
                    <Text
                      style={{
                        color: "#554A4C",
                        fontSize: 20,
                        fontWeight: "700",
                      }}
                    >
                      {item.patient.firstName + " " + item.patient.lastName}
                    </Text>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: 20,
                      }}
                    >
                      <Text
                        style={{
                          color: "#BBBBBB",
                          fontSize: 16,
                          marginRight: 5,
                        }}
                      >{item.startTime + "    "}</Text>
                      <Text
                        style={{
                          color: "#BBBBBB",
                          fontSize: 16,
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: 80,
                    width: 5,
                    backgroundColor: "#64d4d2",
                    borderRadius: 5,
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  taskListContent: {
    height: 100,
    width: 327,
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "#2E66E7",
    backgroundColor: "#ffffff",
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewTask: {
    position: "absolute",
    bottom: 40,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: "#2E66E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E66E7",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  deleteButton: {
    backgroundColor: "#ff6347",
    width: 100,
    height: 38,
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 5,
    justifyContent: "center",
  },
  updateButton: {
    backgroundColor: "#2E66E7",
    width: 100,
    height: 38,
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 20,
  },
  separator: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#979797",
    alignSelf: "center",
    marginVertical: 20,
  },
  notesContent: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#979797",
    alignSelf: "center",
    marginVertical: 20,
  },
  learn: {
    height: 23,
    width: 51,
    backgroundColor: "#F8D557",
    justifyContent: "center",
    borderRadius: 5,
  },
  design: {
    height: 23,
    width: 59,
    backgroundColor: "#62CCFB",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 7,
  },
  readBook: {
    height: 23,
    width: 83,
    backgroundColor: "#4CD565",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 7,
  },
  title: {
    height: 25,
    borderColor: "#5DD976",
    borderLeftWidth: 1,
    paddingLeft: 8,
    fontSize: 19,
  },
  taskContainer: {
    height: 510,
    width: 327,
    alignSelf: "center",
    borderRadius: 20,
    shadowColor: "#2E66E7",
    backgroundColor: "#ffffff",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22,
  },
});
