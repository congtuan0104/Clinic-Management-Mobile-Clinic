import { LogBox, StyleSheet } from "react-native";
import React, { useCallback, useEffect } from "react";
import { NavigationContainer, useLinkTo } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/AuthenticationScreen/Login/LoginScreen";
import RegisterScreen from "../screens/AuthenticationScreen/Register/RegisterScreen";
import ResetPasswordScreen from "../screens/ResetPassword/ResetPasswordScreen";
import ResetPasswordNotificationScreen from "../screens/ResetPassword/ResetPasswordNotification";
import { ILoginResponse, IUserInfo } from "../types";
import { NativeBaseProvider, useToast } from "native-base";
import { theme } from "../theme";
import UserNavigator from "./UserNavigator";
import ValidateNotification from "../screens/AuthenticationScreen/ValidateNotification/ValidateNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, restoreUserInfo } from "../store";
import SplashScreen from "../screens/AuthenticationScreen/SplashScreen/SplashScreen";
import { ReactNavigationTheme } from "../config/react-navigation.theme";
import DoctorNavigator from "./DoctorNavigator";
import { useAppDispatch } from "../hooks";
import messaging from "@react-native-firebase/messaging";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { firebase } from "@react-native-firebase/auth";
import { firebaseConfig } from "../config/firebase";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { NavigationContainerRef } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import ToastAlert from "../components/Toast/Toast";

// Create an object type with mappings for route name to the params of the route
export type RootNativeStackParamList = {
  // undefined: the route doesn't have paramsa
  Login: {
    setLogin: (user: IUserInfo | null, token: string | null) => void | any;
  };
  Register: {
    setLogin: (user: IUserInfo | null, token: string | null) => void;
  };

  ResetPassword: {
    setLogin: (user: IUserInfo | null, token: string | null) => void | any;
  };

  ResetPasswordNotification: {
    setLogin: (user: IUserInfo | null, token: string | null) => void | any;
    email: string;
  };

  UserNavigator: {
    screen: string;
    params: { setLogout: () => void };
  };

  DoctorNavigator: { setLogout: () => void };
  ValidateNotification: {
    setLogin: (user: IUserInfo | null, token: string | null) => void;
    email: string;
  };
};

export const navigationRef =
  React.createRef<NavigationContainerRef<RootNativeStackParamList>>();

// Define type of props
export type LoginScreenProps = NativeStackScreenProps<
  RootNativeStackParamList,
  "Login"
>;
export type RegisterScreenProps = NativeStackScreenProps<
  RootNativeStackParamList,
  "Register"
>;

export type UserNavigatorProps = NativeStackScreenProps<
  RootNativeStackParamList,
  "UserNavigator"
>;

export type DoctorNavigatorProps = NativeStackScreenProps<
  RootNativeStackParamList,
  "DoctorNavigator"
>;

export type ValidateNotificationProps = NativeStackScreenProps<
  RootNativeStackParamList,
  "ValidateNotification"
>;

export type ResetPasswordScreenProps = NativeStackScreenProps<
  RootNativeStackParamList,
  "ResetPassword"
>;

export type ResetPasswordNotificationScreenProps = NativeStackScreenProps<
  RootNativeStackParamList,
  "ResetPasswordNotification"
>;

const StackNavigator = () => {
  const toast = useToast();
  // define userToken for validation
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<IUserInfo | null>(null);
  // Define rootStack to handle root navigation
  const RootStack = createNativeStackNavigator<RootNativeStackParamList>();

  // Set loading state to render splash screen
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useAppDispatch();

  // Ignore unessessary notifications
  React.useEffect(() => {
    LogBox.ignoreAllLogs(); //Ignore all log notifications
  }, []);

  // Define two function to handle login and logout
  const setLogin = (user: IUserInfo | null, token: string | null) => {
    setUser(user);
    setToken(token);
  };
  const setLogout = () => {
    setUser(null);
    setToken(null);
  };

  // Running before render
  const bootstrapAsync = useCallback(async () => {
    try {
      // const userToStorage: IUserInfo = {
      //   id: "testId",
      //   email: "test@gmai.com",
      //   isInputPassword: false, // dữ liệu tạm thời
      //   firstName: "Khang",
      //   lastName: "Nguyen Nhat",
      //   moduleId: 4,
      // };
      // const token = "thisistestingtoken";
      // await AsyncStorage.setItem("user", JSON.stringify(userToStorage));
      // await AsyncStorage.setItem("token", token);

      // Restore userInfo and dispatch to the store
      const testData = await AsyncStorage.getItem("user");
      const tokenString = await AsyncStorage.getItem("token");
      if (tokenString && testData) {
        // Check token expired
        const decodeToken = jwtDecode(tokenString);
        const exp = decodeToken.exp ? decodeToken.exp * 1000 : 0;
        const expDate = new Date(exp);
        const currentDate = new Date();
        if (expDate < currentDate) {
          // Token is expired
          await AsyncStorage.removeItem("user");
          await AsyncStorage.removeItem("token");
          logout();
          setLogout();
        }
        const testDataObject = JSON.parse(testData);
        setLogin(testDataObject, tokenString);
        const UserResponseObject: ILoginResponse = {
          user: testDataObject,
          token: tokenString,
        };
        dispatch(restoreUserInfo(UserResponseObject));
      } else {
        console.log("Loi o navigator dong 168!");
        setLogout();
      }
    } catch (e) {
      // Restoring token failed
      console.log(e);
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Lỗi"
              description="Phiên hoạt động của bạn đã hết. Vui lòng đăng xuất ra khỏi ứng dụng và đăng nhập lại."
              status="error"
            />
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // this useEffect function is used to initialize firebase app and firebase cloud message config
  // and bootstrap the app (get token, user from storage and save them to reducer)
  React.useEffect(() => {
    // init firebase app
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // init FCM config
    // bootstrap the app
    bootstrapAsync();
  }, [bootstrapAsync]);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }
  // console.log("USER", user);
  // console.log("TOKEN", token);

  const HandleDeepLinking = () => {
    const handleLink = async (link: any) => {
      console.log("Handle deep link");
      console.log("Link: ", link);
      // assume the data in url is the object like this
      if (link.url === "https://clinus.netlify.app/clinic/quan-ly-goi") {
        const navigation = navigationRef.current;
        if (navigation) {
          // Sửa ở đây
          navigation.navigate("UserNavigator", {
            screen: "ClinicListNavigator",
            params: { setLogout },
          });
        }
      }
      if (link.url === "https://clinus.page.link/verify-account") {
        const navigation = navigationRef.current;
        if (navigation) {
          // Sửa ở đây
          navigation.navigate("Login", { setLogin });
        }
      }
    };
    useEffect((): any => {
      const unsubscribe = dynamicLinks().onLink(handleLink);
      return () => unsubscribe();
    }, []);
    useEffect(() => {
      dynamicLinks()
        .getInitialLink()
        .then((link: any) => {
          // console.log("Initial link: ", link);
        });
    }, []);
    return null;
  };

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer theme={ReactNavigationTheme} ref={navigationRef}>
        <HandleDeepLinking />
        <RootStack.Navigator>
          {/** If token = null: user doesn't login, render login screen
           * If token != null: user have already login, check user role (moduleId)
           * ModuleId = 1: Admin
           * ModuleId = 2: Nurse
           * ModuleId = 3: Doctor
           * ModuleId = 4: Unknown
           * ModuleId = 5: Guest
           */}
          {token === null || user === null ? (
            <>
              <RootStack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
                initialParams={{ setLogin: setLogin }}
              />
              <RootStack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
                initialParams={{ setLogin: setLogin }}
              />
              <RootStack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{ headerShown: false }}
                initialParams={{ setLogin: setLogin }}
              />
              <RootStack.Screen
                name="ResetPasswordNotification"
                component={ResetPasswordNotificationScreen}
                options={{ headerShown: false }}
                initialParams={{ setLogin: setLogin }}
              />
              <RootStack.Screen
                name="ValidateNotification"
                component={ValidateNotification}
                options={{ headerShown: false }}
                initialParams={{ setLogin: setLogin }}
              />
            </>
          ) : (
            <>
              <RootStack.Screen
                name="UserNavigator"
                component={UserNavigator}
                options={{ headerShown: false }}
                initialParams={{
                  screen: "ClinicListNavigator",
                  params: { setLogout },
                }}
              />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
