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
import SelectDropdown from "react-native-select-dropdown";
import { CalendarNavigatorProps } from "../../Navigator/UserNavigator";
import Timeline from "react-native-timeline-flatlist";
import moment from "moment";

import { IAppointment } from "../../types";
import { APPOINTMENT_STATUS } from "../../enums";

import CalendarStrip from "react-native-calendar-strip";
import Task from "./Task";

import { SafeAreaView } from "react-native-safe-area-context";

const leftArrowIcon = require("../../assets/left-arrow.png");
const rightArrowIcon = require("../../assets/right-arrow.png");

const appointments: Array<IAppointment> = [
  {
    id: "1",
    doctorId: "1",
    doctorName: "Doctor 1",
    patientId: "1",
    patientName: "Patient 1",
    startTime: new Date("2024-01-21T13:45:00+07:00"),
    endTime: new Date("2024-01-21T14:00:00+07:00"),
    note: "Note 1",
    status: APPOINTMENT_STATUS.BOOK,
  },
  {
    id: "2",
    doctorId: "2",
    doctorName: "Doctor 2",
    patientId: "2",
    patientName: "Patient 2",
    startTime: new Date("2024-01-28T15:45:00+07:00"),
    endTime: new Date("2024-01-28T16:00:00+07:00"),
    note: "Note 2",
    status: APPOINTMENT_STATUS.CANCEL,
  },
  {
    id: "3",
    doctorId: "3",
    doctorName: "Doctor 3",
    patientId: "3",
    patientName: "Patient 3",
    startTime: new Date("2024-01-28T15:45:00+07:00"),
    endTime: new Date("2024-01-28T16:15:00+07:00"),
    note: "Note 3",
    status: APPOINTMENT_STATUS.CHECK_IN,
  },
  {
    id: "4",
    doctorId: "4",
    doctorName: "Doctor 4",
    patientId: "4",
    patientName: "Patient 4",
    startTime: new Date("2024-01-28T16:45:00+07:00"),
    endTime: new Date("2024-01-28T17:00:00+07:00"),
    note: "Note 4",
    status: APPOINTMENT_STATUS.CHECK_OUT,
  },
  {
    id: "5",
    doctorId: "5",
    doctorName: "Doctor 5",
    patientId: "5",
    patientName: "Patient 5",
    startTime: new Date("2024-01-28T17:45:00+07:00"),
    endTime: new Date("2024-01-28T18:00:00+07:00"),
    note: "Note 5",
    status: APPOINTMENT_STATUS.BOOK,
  },
];

const datesWhitelist = [
  {
    start: moment(),
    end: moment().add(365, "days"), // total 4 days enabled
  },
];

const data = [
  {
    time: "09:00",
    title: "Archery Training",
    description:
      "The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ",
    circleColor: "#009688",
    lineColor: "#009688",
  },
  {
    time: "10:45",
    title: "Play Badminton",
    description:
      "Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.",
  },
  { time: "12:00", title: "Lunch" },
  {
    time: "14:00",
    title: "Watch Soccer",
    description:
      "Team sport played between two teams of eleven players with a spherical ball. ",
    lineColor: "#009688",
  },
  {
    time: "16:30",
    title: "Go to Fitness center",
    description: "Look out for the Best Gym & Fitness Centers around me :)",
    circleColor: "#009688",
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
  //const [markedDate, setMarkedDate] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState(
    `${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
      "DD"
    )}`
  );
  //const [todoList, setTodoList] = useState<Array<IAppointment> | undefined>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<IAppointment | undefined>();
  const [timelineEvents, setTimelineEvents] = useState<
    TimelineEventsState[] | undefined
  >();

  const vietnamMoment = moment().utcOffset("+07:00"); // Đặt múi giờ UTC+7 cho Việt Nam
  const formattedDate = `${vietnamMoment.format("YYYY-MM-DD")}`;

  const todoList: Array<IAppointment> = useMemo(() => {
    const currentDateObj = new Date(currentDate);
    return appointments.filter((item) => {
      return (
        currentDateObj.getFullYear() === item.startTime.getFullYear() &&
        currentDateObj.getMonth() === item.startTime.getMonth() &&
        currentDateObj.getDate() === item.startTime.getDate()
      );
    });
  }, [currentDate]);

  const markedDate = useMemo(
    () =>
      appointments.map((item) => ({
        date: item.startTime,
        dots: [
          {
            color: "blue",
          },
        ],
      })),
    [appointments]
  );
  console.log("markedDate: ", markedDate);

  useEffect(() => {
    console.log("toldoList before: ", todoList);
    console.log("current day: ", currentDate);
    const fetchData = async () => {
      try {
        await getTimelineEvents();
        console.log(
          "timeline events after getTimelineEvents: ",
          timelineEvents
        );
        console.log("todoList after: ", todoList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    console.log("todoList after after: ", todoList);
  }, [currentDate]);

  const handleModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  async function filterTodoListsByDate(currentDateObj: Date) {
    const todoLists = appointments.filter((item) => {
      return (
        currentDateObj.getFullYear() === item.startTime.getFullYear() &&
        currentDateObj.getMonth() === item.startTime.getMonth() &&
        currentDateObj.getDate() === item.startTime.getDate()
      );
    });

    // Other asynchronous operations can be added here if needed

    return todoLists;
  }

  const getTimelineEvents = async () => {
    console.log("to do list in settimelineevent: ", todoList);
    const newArray = todoList?.map((item: IAppointment) => {
      const startTimeString = item.startTime.toISOString();
      // console.log('start time string: ', startTimeString);
      return {
        time: startTimeString.slice(
          startTimeString.indexOf("T") + 1,
          startTimeString.indexOf("T") + 6
        ),
        title: item.patientName,
        description: item.note,
        circleColor: "#009688",
        lineColor: "#009688",
      };
    });

    setTimelineEvents(newArray);
    console.log("timelineevent in gettimelineEvent after: ", timelineEvents);
  };

  return (
    <Fragment>
      {selectedTask !== null && (
        <>
          <Task {...{ setModalVisible, isModalVisible }}>
            {/* <DateTimePicker
            isVisible={isDateTimePickerVisible}
            onConfirm={handleDatePicked}
            onCancel={hideDateTimePicker}
            mode="time"
            date={new Date()}
            isDarkModeEnabled
          /> */}
            <View style={styles.taskContainer}>
              <TextInput
                style={styles.title}
                onChangeText={(text) => {
                  let prevSelectedTask = JSON.parse(
                    JSON.stringify(selectedTask)
                  );
                  prevSelectedTask.title = text;
                  setSelectedTask(prevSelectedTask);
                }}
                value={selectedTask?.patientName}
                placeholder="Tên bệnh nhân?"
              />
              <Text
                style={{
                  fontSize: 14,
                  color: "#BDC6D8",
                  marginVertical: 10,
                }}
              >
                Bác sĩ
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text>{selectedTask?.doctorName}</Text>
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
                  value={selectedTask?.note}
                  placeholder="Enter notes about the task."
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
                    {`${moment(selectedTask?.startTime).format("LT")}`}
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
                  {/* <View
                  style={{
                    height: 25,
                    marginTop: 3
                  }}
                >
                  <Text style={{ fontSize: 19 }}>
                    {moment(selectedTask?.alarm?.time || moment()).format(
                      'h:mm A'
                    )}
                  </Text>
                </View> */}
                  <SelectDropdown
                    data={[
                      "Chưa xác nhận",
                      "Đã xác nhận",
                      "Đã đến hẹn",
                      "Hủy hẹn",
                    ]}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index);
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
                    defaultButtonText={"Chưa xác nhận"}
                  />
                </View>
                {/* <Switch
                value={selectedTask?.alarm?.isOn || false}
                onValueChange={handleAlarmSet}
              /> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <TouchableOpacity
                onPress={async () => {
                  handleModalVisible();
                  console.log('isOn', selectedTask?.alarm.isOn);
                  if (selectedTask?.alarm.isOn) {
                    await updateAlarm();
                  } else {
                    await deleteAlarm();
                  }
                  await updateSelectedTask({
                    date: currentDate,
                    todo: selectedTask
                  });
                  updateCurrentTask(currentDate);
                }}
                style={styles.updateButton}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: '#fff'
                  }}
                >
                  UPDATE
                </Text>
              </TouchableOpacity> */}
                {/* <TouchableOpacity
                onPress={async () => {
                  handleModalVisible();
                  deleteAlarm();
                  await deleteSelectedTask({
                    date: currentDate,
                    todo: selectedTask
                  });
                  updateCurrentTask(currentDate);
                }}
                style={styles.deleteButton}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: '#fff'
                  }}
                >
                  DELETE
                </Text>
              </TouchableOpacity> */}
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
        <CalendarStrip
          calendarAnimation={{ type: "sequence", duration: 30 }}
          daySelectionAnimation={{
            type: "background",
            duration: 200,
            highlightColor: "#2E66E7",
          }}
          style={{
            height: 150,
            paddingTop: 20,
            paddingBottom: 20,
          }}
          calendarHeaderStyle={{ color: "#000000" }}
          dateNumberStyle={{ color: "#000000", paddingTop: 10 }}
          dateNameStyle={{ color: "#BBBBBB" }}
          highlightDateNumberStyle={{
            color: "#fff",
            backgroundColor: "#2E66E7",
            marginTop: 10,
            height: 35,
            width: 35,
            textAlign: "center",
            borderRadius: 17.5,
            overflow: "hidden",
            paddingTop: 6,
            fontWeight: "400",
            justifyContent: "center",
            alignItems: "center",
          }}
          highlightDateNameStyle={{ color: "#2E66E7" }}
          disabledDateNameStyle={{ color: "grey" }}
          disabledDateNumberStyle={{ color: "grey", paddingTop: 10 }}
          datesWhitelist={datesWhitelist}
          iconLeft={leftArrowIcon}
          iconRight={rightArrowIcon}
          iconContainer={{ flex: 0.1 }}
          // If you get this error => undefined is not an object (evaluating 'datesList[_this.state.numVisibleDays - 1].date')
          // temp: https://github.com/BugiDev/react-native-calendar-strip/issues/303#issuecomment-864510769
          markedDates={markedDate}
          selectedDate={moment(currentDate)}
          onDateSelected={(date) => {
            console.log("data calendar strip ", date);
            const selectedDate = `${moment(date).format("YYYY")}-${moment(
              date
            ).format("MM")}-${moment(date).format("DD")}`;
            //updateTodoList(selectedDate);
            setCurrentDate(selectedDate);
          }}
        />
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
            // height: 2000
          }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            nestedScrollEnabled={true}
          >
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
                overflow: "hidden",
              }}
              descriptionStyle={{ color: "gray" }}
              // options={{
              //   style:{paddingTop:5}
              // }}
            />
            {todoList?.map((item) => (
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
                      {item.patientName}
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
                          fontSize: 14,
                          marginRight: 5,
                        }}
                      >{`${moment(item.startTime).format("LLL")}    `}</Text>
                      <Text
                        style={{
                          color: "#BBBBBB",
                          fontSize: 14,
                        }}
                      >
                        {item.note}
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
    height: 475,
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
