import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { ClinicInfoNavigatorProps } from "./UserNavigator";
import ClinicInfoDashboardScreen from "../screens/ClinicInfoScreen/ClinicInfoDashboardScreen";
import { useEffect } from "react";
import { clinicService } from "../services";
import { useToast } from "native-base";
import ToastAlert from "../components/Toast/Toast";
import { useAppDispatch } from "../hooks";
import { updateClinic } from "../store";
import UpdateClinicInfoScreen from "../screens/ClinicInfoScreen/UpdateClinicInfoScreen";

export type SubscriptionNavigatorStackParamList = {
  ClinicInfoDashboard: undefined;
  UpdateClinicInfo: undefined;
};

export type ClinicInfoDashboardScreenProps = NativeStackScreenProps<
  SubscriptionNavigatorStackParamList,
  "ClinicInfoDashboard"
>;

export type UpdateClinicInfoScreenProps = NativeStackScreenProps<
  SubscriptionNavigatorStackParamList,
  "UpdateClinicInfo"
>;

const ClinicInfoStackNavigator =
  createNativeStackNavigator<SubscriptionNavigatorStackParamList>();

export default function ClinicInfoNavigator({
  navigation,
  route,
}: ClinicInfoNavigatorProps) {
  const { clinic } = route.params;
  const toast = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Call API to get clinic detail
    const getClinicDetail = async () => {
      try {
        const response = await clinicService.getClinicByClinicId(clinic?.id);
        if (response.data) {
          dispatch(updateClinic(response.data));
        }
      } catch (error) {
        if (clinic?.id) {
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Lỗi"
                  description="Không lấy được dữ liệu. Vui lòng thử lại sau."
                  status="error"
                />
              );
            },
          });
        }
      }
    };
    getClinicDetail();
  }, [clinic?.id]);
  return (
    <ClinicInfoStackNavigator.Navigator initialRouteName="ClinicInfoDashboard">
      <ClinicInfoStackNavigator.Screen
        name="ClinicInfoDashboard"
        component={ClinicInfoDashboardScreen}
        options={{ headerShown: false }}
      />
      <ClinicInfoStackNavigator.Screen
        name="UpdateClinicInfo"
        component={UpdateClinicInfoScreen}
        options={{ headerShown: false }}
      />
    </ClinicInfoStackNavigator.Navigator>
  );
}
