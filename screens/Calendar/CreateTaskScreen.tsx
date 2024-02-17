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
import { useToast } from 'native-base'
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import ToastAlert from "../../components/Toast/Toast";
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'native-base'
import { CreateTaskNavigatorProps } from "../../Navigator/UserNavigator";
import { CalendarList } from "react-native-calendars";
import moment from "moment";
import { IClinicStaff, IPatient, IClinicService, INewAppointmentPayload } from '../../types'
import { v4 as uuidv4 } from "uuid";
import SelectDropdown from "react-native-select-dropdown";
import { useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import AddPatientInfo from "./AddPatientInfo";
import { SafeAreaView } from "react-native-safe-area-context";
import { staffApi, patientApi, clinicServiceApi, appointmentApi } from "../../services";
const { width: vw } = Dimensions.get("window");
moment().format("YYYY/MM/DD");
const chevronDown = require("../../assets/chevron_down.png");
import { APPOINTMENT_STATUS, Gender } from '../../enums';


export default function CreateTask({
  navigation,
  route,
}: CreateTaskNavigatorProps) {
  const [visibleHeight, setVisibleHeight] = useState(
    Dimensions.get("window").height
  );
  const clinic = useAppSelector(ClinicSelector);
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
  const [doctorSelected, setDoctorSelected] = useState<IClinicStaff>();
  const [patientSelected, setPatientSelected] = useState<IPatient>();
  const [serviceSelected, setServiceSelected] = useState<IClinicService>();
  const [notesText, setNotesText] = useState("");
  const [isAddPatientInfo, setIsAddPatientInfo] = useState<boolean>(false);
  const [doctorList, setDoctorList] = useState<IClinicStaff[]>([]);
  const [patientList, setPatientList] = useState<IPatient[]>([]);
  const [clinicServiceList, setClinicServiceList] = useState<IClinicService[]>([]);
  const [startTime, setStartTime] = useState<string>("09:00")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  const getDoctorList = async () => {
    try {
      if (clinic?.id)
      {
        const response = await staffApi.getStaffs({ clinicId: clinic?.id });
        console.log('response: ', response);
        if (response.status && response.data) {
          setDoctorList(response.data)
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDoctorList();
  }, [clinic?.id]);

  const getPatientList = async () => {
    try {
      if (clinic?.id)
      {
        const response = await patientApi.getPatients({ clinicId: clinic?.id });
        console.log('response: ', response);
        if (response.status && response.data) {
          setPatientList(response.data)
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getClinicServiceList = async () => {
    try {
      if (clinic?.id)
      {
        const response = await clinicServiceApi.getClinicServices(clinic!.id);
        //console.log('response: ', response);
        if (response.status && response.data) {
          setClinicServiceList(response.data)
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDoctorList();
    getPatientList();
    getClinicServiceList();
  }, [clinic?.id]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload: INewAppointmentPayload = {
      clinicId: clinic!.id,
      doctorId: doctorSelected!.id,
      patientId: patientSelected!.id,
      serviceId: serviceSelected!.id,
      date: currentDay,
      startTime: startTime? startTime : "",
      endTime: startTime? startTime : "",
      description: notesText,
      status: APPOINTMENT_STATUS.CONFIRM
    }

    console.log('payload', payload);
    const res = await appointmentApi.createAppointment(payload);

    if (res.status) {
      toast.show({
        render: () => {
            return (
            <ToastAlert
                title="Thành công"
                description="Thêm lịch hẹn thành công!"
                status="success"
            />
            );
        },
        });
        navigation.navigate("CalendarNavigator")
    }
    else {
      toast.show({
        render: () => {
        return (
            <ToastAlert
            title="Lỗi"
            description="Thêm lịch hẹn thất bại. Vui lòng kiểm tra lại thông tin."
            status="error"
            />
        );
        },
    });
    }
    setIsLoading(false)
  }
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
              setCurrentDay(day.dateString.slice(0,10));
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
            data={doctorList.map((doctor) => (doctor.users? doctor.users.firstName + ' ' + doctor.users.lastName : null))}
            onSelect={(selectedItem, index) => {
              setDoctorName(selectedItem)
              setDoctorSelected(doctorList[index])
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
          <TouchableOpacity
            style={{position: "absolute", top: 155, right: 20}}
            onPress={() => setIsAddPatientInfo(true)}
            >
            <AntDesign name="adduser" size={24} color="black" />
          </TouchableOpacity>
          <View style={{marginTop: 15}}>
            <SelectDropdown
              data={patientList.map((patient) => (patient? patient.firstName + ' ' + patient.lastName : null))}
              onSelect={(selectedItem, index) => {
                setPatientSelected(patientList[index])
              }}
              defaultButtonText={"Chọn bệnh nhân"}
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
          </View>
          <View style={styles.notesContent2} />
          <SelectDropdown
              data={clinicServiceList.map((service) => (service.serviceName))}
              onSelect={(selectedItem, index) => {
                setServiceSelected(clinicServiceList[index])
              }}
              defaultButtonText={"Chọn dịch vụ khám bệnh"}
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
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
              ]}
              onSelect={(selectedItem, index) => {
                //console.log(selectedItem, index);
                setStartTime(selectedItem)
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
              defaultButtonText={"09:00"}
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
                onPress={handleSubmit}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Xác nhận
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
          <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
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
  notesContent2: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#ebebeb",
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
    height: 620,
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
