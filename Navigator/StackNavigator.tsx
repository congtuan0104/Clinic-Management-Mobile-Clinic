import { LogBox, StyleSheet } from "react-native";
import React, { useCallback, useEffect } from "react";
import { NavigationContainer, useLinkTo } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/AuthenticationScreen/Login/LoginScreen";
import RegisterScreen from "../screens/AuthenticationScreen/Register/RegisterScreen";
import { ILoginResponse, IUserInfo } from "../types";
import { NativeBaseProvider } from "native-base";
import { theme } from "../theme";
import UserNavigator from "./UserNavigator";
import ValidateNotification from "../screens/AuthenticationScreen/ValidateNotification/ValidateNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { restoreUserInfo } from "../store";
import SplashScreen from "../screens/AuthenticationScreen/SplashScreen/SplashScreen";
import { ReactNavigationTheme } from "../config/react-navigation.theme";
import DoctorNavigator from "./DoctorNavigator";
import { useAppDispatch } from "../hooks";
import messaging from "@react-native-firebase/messaging";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { firebaseConfig } from "../config/firebase";
import { FCMConfig } from "../config/firebaseCloudMessage";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { NavigationContainerRef } from "@react-navigation/native";

// Create an object type with mappings for route name to the params of the route
export type RootNativeStackParamList = {
  // undefined: the route doesn't have paramsa
  Login: {
    setLogin: (user: IUserInfo | null, token: string | null) => void | any;
  };
  Register: {
    setLogin: (user: IUserInfo | null, token: string | null) => void;
  };

  UserNavigator: {
    screen: string;
    params: { setLogout: () => void };
  };

  DoctorNavigator: { setLogout: () => void };
  ValidateNotification: {
    setLogin: (user: IUserInfo | null, token: string | null) => void;
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

const StackNavigator = () => {
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
    LogBox.ignoreLogs([
      "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
    ]);
    LogBox.ignoreLogs([
      "Non-serializable values were found in the navigation state",
    ]);
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

      // await AsyncStorage.removeItem("user");
      // await AsyncStorage.removeItem("token");
      // Restore userInfo and dispatch to the store
      const testData = await AsyncStorage.getItem("user");
      const tokenString = await AsyncStorage.getItem("token");
      if (tokenString && testData) {
        const testDataObject = JSON.parse(testData);
        setLogin(testDataObject, tokenString);
        const UserResponseObject: ILoginResponse = {
          user: testDataObject,
          token: tokenString,
        };
        dispatch(restoreUserInfo(UserResponseObject));
      } else {
        setLogout();
      }
    } catch (e) {
      // Restoring token failed
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
  console.log("USER", user);
  console.log("TOKEN", token);

  const HandleDeepLinking = () => {
    const handleLink = async (link: any) => {
      console.log("Handle deep link");
      console.log("Link: ", link);
      // assume the data in url is the object like this
      if (link.url === "https://clinus.page.link/payment") {
        const navigation = navigationRef.current;
        if (navigation) {
          // Sửa ở đây
          navigation.navigate("UserNavigator", {
            screen: "ClinicListNavigator",
            params: { setLogout },
          });
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
          console.log("Initial link: ", link);
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
                name="ValidateNotification"
                component={ValidateNotification}
                options={{ headerShown: false }}
                initialParams={{ setLogin: setLogin }}
              />
            </>
          ) : user?.moduleId === 2 ? (
            <>
              <RootStack.Screen
                name="UserNavigator"
                component={UserNavigator}
                options={{ headerShown: false }}
                initialParams={{
                  screen: "",
                  params: { setLogout },
                }}
              />
            </>
          ) : user?.moduleId === 2 ? (
            <>
              <RootStack.Screen
                name="UserNavigator"
                component={UserNavigator}
                options={{ headerShown: false }}
                initialParams={{
                  screen: "",
                  params: { setLogout },
                }}
              />
            </>
          ) : user?.moduleId === 4 ? (
            <>
              <RootStack.Screen
                name="UserNavigator"
                component={UserNavigator}
                options={{ headerShown: false }}
                initialParams={{
                  screen: "",
                  params: { setLogout },
                }}
              />
            </>
          ) : null}
        </RootStack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
