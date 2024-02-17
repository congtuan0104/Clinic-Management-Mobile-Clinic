import {
    NativeStackScreenProps,
    createNativeStackNavigator,
  } from "@react-navigation/native-stack";
import { IPatient } from "../types";
import PatientScreen from "../screens/PatientScreen/PatientScreen";
import PatientInfo from "../screens/PatientInfoScreen/PatientInfo";
import MedicalRecord from "../screens/MedicalRecord/MedicalRecord";
import MedicalRecordDetail from'../screens/MedicalRecord/MedicalRecordDetail'
import { PatientNavigatorProps } from "./UserNavigator";
import { IMedicalRecord, } from "../types";


export type PatientNavigatorParamList = {
    PatientDashboard: undefined;
    PatientInfoNavigator: { patient: IPatient };
    MedicalRecordNavigator: { patient: IPatient };
    MedicalRecordDetail: { record: IMedicalRecord };
}

export type PatientDashboardProps = NativeStackScreenProps<
  PatientNavigatorParamList,
  "PatientDashboard"
>;

export type PatientInfoNavigatorProps = NativeStackScreenProps<
  PatientNavigatorParamList,
  "PatientInfoNavigator"
>;

export type MedicalRecordNavigatorProps = NativeStackScreenProps<
  PatientNavigatorParamList,
  "MedicalRecordNavigator"
>;

export type MedicalRecordDetailProps = NativeStackScreenProps<
  PatientNavigatorParamList,
  "MedicalRecordDetail"
>

const PatientTabNavigator =
  createNativeStackNavigator<PatientNavigatorParamList>();

export default function PatientNavigator({
    navigation,
    route,
  }: PatientNavigatorProps) {
    return(
        <PatientTabNavigator.Navigator initialRouteName="PatientDashboard">
            <PatientTabNavigator.Screen
                name="PatientDashboard"
                component={PatientScreen}
                options={{
                headerShown: false,
                title: "Danh sách bệnh nhân",
                }}
            />
            <PatientTabNavigator.Screen
              name="PatientInfoNavigator"
              options={{
                title: "Hồ sơ bệnh nhân",
                headerShown: false,
              }}
              component={PatientInfo}
            />
            <PatientTabNavigator.Screen
              name="MedicalRecordNavigator"
              options={{
                title: "Hồ sơ bệnh án",
                headerShown: false,
              }}
              component={MedicalRecord}
            />
            <PatientTabNavigator.Screen
              name="MedicalRecordDetail"
              options={{
                title: "Chi tiết hồ sơ bệnh án",
                headerShown: false,
              }}
              component={MedicalRecordDetail}
            />
        </PatientTabNavigator.Navigator>
    )
  }