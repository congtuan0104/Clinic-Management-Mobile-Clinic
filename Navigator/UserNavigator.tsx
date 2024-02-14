import ClinicInfoNavigator from "./ClinicInfoNavigator";
import ClinicListNavigator from "../screens/ClinicListScreen/ClinicList";
import * as React from "react";
import { UserNavigatorProps } from "./StackNavigator";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { appColor } from "../theme";
import CalendarScreen from "../screens/Calendar/CalendarScreen";
import CreateTaskScreen from "../screens/Calendar/CreateTaskScreen";
import UpdateUserInfoScreen from "../screens/UpdateUserInfo/UpdateUserInfoScreen";
import CategoryScreen from "../screens/CategoryScreen/CategoryScreen";
import CategoryPriceScreen from "../screens/CategoryPriceScreen/CategoryPriceScreen";
import CustomDrawer from "../components/CustomDrawer/CustomDrawer";
import ChattingNavigator from "./ChattingNavigator";
import ProfileNavigator from "./ProfileNavigator";
import SubscriptionNavigator from "./SubscriptionNavigator";
import NotificationNavigator from "./NotificationNavigator";
import { clinicService } from "../services";
import ToastAlert from "../components/Toast/Toast";
import { useToast } from "native-base";
import { LoadingSpinner } from "../components/LoadingSpinner/LoadingSpinner";
import { IClinicInfo } from "../types/clinic.types";
import RoleNavigator from "./RoleNavigator";
// Import custom icons
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { NavigationContainerRef } from "@react-navigation/native";
import EquipmentListScreen from "../screens/EquipmentNavigator/EquipmentListScreen";
import MedicalSuppliesScreen from "../screens/EquipmentNavigator/EquipmentListScreen";

export type UserNavigatorDrawerParamList = {
  // undefined: the route doesn't have params
  ProfileNavigator: undefined;
  UpdateUserInfo: undefined;
  ChattingNavigator: undefined;
  SubscriptionNavigator: undefined;
  NotificationNavigator: undefined;
  ClinicInfoNavigator: { clinic: IClinicInfo };
  ClinicListNavigator: {
    clinic: IClinicInfo;
    clinicList: IClinicInfo[];
    setClinic: (clinic: IClinicInfo) => void;
  };
  RoleNavigator: undefined;
  CalendarNavigator: undefined;
  CreateTaskNavigator: undefined;
  CategoryNavigator: undefined;
  CategoryPriceNavigator: undefined;
  MedicalSuppliesNavigator: undefined;
};

export const userNavigationRef =
  React.createRef<NavigationContainerRef<UserNavigatorDrawerParamList>>();

export type ProfileNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "ProfileNavigator"
>;
export type UpdateProfileNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "UpdateUserInfo"
>;
export type ChattingNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "ChattingNavigator"
>;
export type SubscriptionNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "SubscriptionNavigator"
>;
export type NotificationNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "NotificationNavigator"
>;

export type ClinicListNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "ClinicListNavigator"
>;

export type ClinicInfoNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "ClinicInfoNavigator"
>;

export type RoleNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "RoleNavigator"
>;

export type CalendarNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "CalendarNavigator"
>;

export type CreateTaskNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "CreateTaskNavigator"
>;

export type CategoryNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "CategoryNavigator"
>;

export type CategoryPriceNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "CategoryPriceNavigator"
>;

export type MedicalSuppliesNavigatorProps = NativeStackScreenProps<
  UserNavigatorDrawerParamList,
  "MedicalSuppliesNavigator"
>;

const UserNavigatorDrawer =
  createDrawerNavigator<UserNavigatorDrawerParamList>();

export default function UserScreen({ navigation, route }: UserNavigatorProps) {
  const { setLogout } = route.params?.params;
  const [clinic, setClinic] = React.useState<IClinicInfo | any>(null);
  return (
    <>
      <UserNavigatorDrawer.Navigator
        initialRouteName="ClinicListNavigator"
        screenOptions={{
          headerStyle: {
            backgroundColor: appColor.white,
          },
          headerTintColor: appColor.title,
          headerTitleStyle: {
            fontWeight: "bold",
            fontFamily: "Montserrat-Bold",
            fontSize: 20,
          },
          headerTitleAlign: "center",
          drawerStyle: {
            backgroundColor: appColor.background,
            marginBottom: 0,
            borderBottomRightRadius: 20,
          },
          drawerLabelStyle: {
            marginLeft: -18,
            fontSize: 15,
          },
          drawerActiveTintColor: "#fff",
          drawerActiveBackgroundColor: appColor.primary,
          drawerInactiveTintColor: appColor.primary,
        }}
        drawerContent={(props) => (
          <CustomDrawer {...props} logOut={setLogout} />
        )}
      >
        <UserNavigatorDrawer.Screen
          options={{
            title: "Tài khoản",
            drawerIcon: ({ color }) => (
              <MaterialIcons name="account-circle" size={26} color={color} />
            ),
          }}
          name="ProfileNavigator"
          component={ProfileNavigator}
        />
        <UserNavigatorDrawer.Screen
          name="ClinicInfoNavigator"
          options={{
            title: "Thông tin phòng khám",
            drawerIcon: ({ color }) => (
              <FontAwesome5 name="clinic-medical" size={24} color={color} />
            ),
          }}
          component={ClinicInfoNavigator}
          initialParams={{
            clinic,
          }}
        />
        <UserNavigatorDrawer.Screen
          options={{
            title: "Cập nhật thông tin tài khoản",
            drawerLabel: () => null, // Set drawerLabel to null to hide it in the drawer
            drawerItemStyle: { height: 0 },
          }}
          name="UpdateUserInfo"
          component={UpdateUserInfoScreen}
        />
        <UserNavigatorDrawer.Screen
          options={{
            title: "Tạo phòng khám mới",
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="package" size={26} color={color} />
            ),
            drawerItemStyle: {
              display: "none",
            },
          }}
          name="SubscriptionNavigator"
          component={SubscriptionNavigator}
        />
        <UserNavigatorDrawer.Screen
          name="ClinicListNavigator"
          options={{
            title: "Phòng khám",
            drawerIcon: ({ color }) => (
              <FontAwesome5 name="th-list" size={24} color={color} />
            ),
          }}
          component={ClinicListNavigator}
          initialParams={{
            clinic,
            setClinic,
          }}
        />

        {clinic && (
          <>
            <UserNavigatorDrawer.Screen
              name="RoleNavigator"
              options={{
                title: "Quản lý nhân viên",
                drawerIcon: ({ color }) => (
                  <FontAwesome name="users" size={24} color={color} />
                ),
              }}
              component={RoleNavigator}
            />
            <UserNavigatorDrawer.Screen
              name="CategoryNavigator"
              options={{
                title: "Danh mục, phân loại",
                drawerIcon: ({ color }) => (
                  <MaterialIcons name="category" size={24} color={color} />
                ),
              }}
              component={CategoryScreen}
            />
            <UserNavigatorDrawer.Screen
              name="CategoryPriceNavigator"
              options={{
                title: "Bảng giá dịch vụ",
                drawerIcon: ({ color }) => (
                  <Entypo name="price-tag" size={24} color={color} />
                ),
              }}
              component={CategoryPriceScreen}
            />
            <UserNavigatorDrawer.Screen
              name="MedicalSuppliesNavigator"
              options={{
                title: "Kho thuốc, vật tư",
                drawerIcon: ({ color }) => (
                  <MaterialIcons name="device-hub" size={24} color={color} />
                ),
              }}
              component={MedicalSuppliesScreen}
            />
            <UserNavigatorDrawer.Screen
              name="CalendarNavigator"
              options={{
                title: "Lịch hẹn khám",
                drawerIcon: ({ color }) => (
                  <FontAwesome name="calendar" size={24} color={color} />
                ),
              }}
              component={CalendarScreen}
            />
            <UserNavigatorDrawer.Screen
              name="ChattingNavigator"
              options={{
                title: "Nhắn tin",
                drawerIcon: ({ color }) => (
                  <Entypo name="chat" size={24} color={color} />
                ),
              }}
              component={ChattingNavigator}
            />
            <UserNavigatorDrawer.Screen
              name="NotificationNavigator"
              options={{
                title: "Thông báo",
                drawerIcon: ({ color }) => (
                  <Ionicons name="notifications" size={24} color={color} />
                ),
              }}
              component={NotificationNavigator}
            />
            <UserNavigatorDrawer.Screen
              name="CreateTaskNavigator"
              component={CreateTaskScreen}
              options={{
                title: "Thêm lịch hẹn",
                drawerLabel: () => null, // Set drawerLabel to null to hide it in the drawer
                drawerItemStyle: { height: 0 },
              }}
            />
          </>
        )}
      </UserNavigatorDrawer.Navigator>
    </>
  );
}
