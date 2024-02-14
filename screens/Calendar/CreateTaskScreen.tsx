import React, { Fragment, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from 'native-base'
import { CreateTaskNavigatorProps } from "../../Navigator/UserNavigator";
import { CalendarList } from "react-native-calendars";
import moment from "moment";

import DateTimePicker from "react-native-modal-datetime-picker";
import { v4 as uuidv4 } from "uuid";
import SelectDropdown from "react-native-select-dropdown";
//import { useKeyboardHeight } from '@calendar/hooks';
import useStore from "../../store/ClendarStore";
import AddPatientInfo from "./AddPatientInfo";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: vw } = Dimensions.get("window");
moment().format("YYYY/MM/DD");
const chevronDown = require("../../assets/chevron_down.png");


export default function CreateTask({
  navigation,
  route,
}: CreateTaskNavigatorProps) {
  const [visibleHeight, setVisibleHeight] = useState(
    Dimensions.get("window").height
  );
  const [currentDay, setCurrentDay] = useState(moment().format());
  const [selectedDay, setSelectedDay] = useState({
    [`${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
      "DD"
    )}`]: {
      selected: true,
      selectedColor: "#2E66E7",
    },
  });
  const [doctorName, setDoctorName] = useState("");
  const [notesText, setNotesText] = useState("");
  const [isAddPatientInfo, setIsAddPatientInfo] = useState<boolean>(false);

  const renderAddTask = () => {
    return (
      <>
        <View style={styles.backButton}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CalendarNavigator")}
            style={{ marginRight: vw / 2 - 120, marginLeft: 20 }}
          >
            <Image
              alt="back.png"
              style={{ height: 25, width: 40 }}
              source={require("../../assets/back.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.calenderContainer}>
          <CalendarList
            style={{
              width: 350,
              height: 350,
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
            markedDates={selectedDay}
          />
        </View>
        <View style={styles.taskContainer}>
          <Text style={styles.notes}>Ngày hẹn khám</Text>
          <TextInput
            style={{
              height: 25,
              marginTop: 5,
              marginBottom: 10,
              fontSize: 19,
            }}
            value={currentDay.substring(0, 10).split("-").reverse().join("-")}
          />
          <SelectDropdown
            data={["Bác sĩ 1", "Bác sĩ 2"]}
            onSelect={(selectedItem, index) => {
              setDoctorName(selectedItem)
            }}
            defaultButtonText={"Chọn bác sĩ"}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={() => (
              <Image alt="icon" source={chevronDown} size={18} />
            )}
            dropdownIconPosition={"right"}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
          />

          <View style={styles.notesContent} />
          <View>
            <Text style={styles.notes}>Ghi chú</Text>
            <TextInput
              style={{
                height: 25,
                fontSize: 19,
                marginTop: 3,
              }}
              onChangeText={setNotesText}
              value={notesText}
              placeholder="Ghi chú"
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
              Thời gian khám
            </Text>

            <SelectDropdown
              data={[
                "09:00 AM",
                "09:30 AM",
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "11:30 AM",
                "12:00 PM",
                "12:30 PM",
                "01:00 PM",
                "01:30 PM",
                "02:00 PM",
                "02:30 PM",
                "03:00 PM",
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
              defaultButtonText={"09:00 AM"}
            />
          </View>

          <View style={styles.separator} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <View>
              <TouchableOpacity
                disabled={doctorName === ""}
                style={{
                  width: 100,
                  height: 48,
                  alignSelf: "flex-end",
                  transform: [{ translateX: 180 }],
                  marginTop: -10,
                  borderRadius: 5,
                  justifyContent: "center",
                  backgroundColor:
                    doctorName === "" ? "rgba(46, 102, 231,0.5)" : "#2E66E7",
                }}
                onPress={() => setIsAddPatientInfo(true)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Tiếp tục
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            height: visibleHeight,
            paddingBottom: 40,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          >
            {isAddPatientInfo ? (
              <AddPatientInfo setIsAddPatientInfo={setIsAddPatientInfo} />
            ) : (
              <>{renderAddTask()}</>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  createTaskButton: {
    width: 252,
    height: 48,
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 5,
    justifyContent: "center",
  },
  separator: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#979797",
    alignSelf: "center",
    marginVertical: 20,
  },
  notes: {
    color: "#9CAAC4",
    fontSize: 16,
    fontWeight: "600",
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
    height: 420,
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
  calenderContainer: {
    marginTop: 0,
    width: 350,
    height: 350,
    alignSelf: "center",
  },
  newTask: {
    alignSelf: "center",
    fontSize: 20,
    width: 120,
    height: 25,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    marginTop: 5,
    width: "100%",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#eaeef7",
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 46,
    backgroundColor: "#F5F5FC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4D4D5",
  },
  dropdown1BtnTxtStyle: { color: "black", textAlign: "left", fontSize: 13 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF", marginTop: -70, borderRadius: 15 },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
});
