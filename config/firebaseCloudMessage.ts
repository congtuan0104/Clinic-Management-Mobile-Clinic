import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import { notificationService } from "../services/notification.services";
import { useAppSelector } from "../hooks";
import { userInfoSelector } from "../store";
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log("Authorization status:", authStatus);
    return true;
  } else return false;
};

const getFCMToken = async (userId: string) => {
  if (await requestUserPermission()) {
    // return fcm token for the device
    messaging()
      .getToken()
      .then(async (token: string) => {
        try {
          // console.log(token);
          // send token to server
          const response = await notificationService.postFCMTokenToServer(
            userId,
            token
          );
          if (response.status) {
            // console.log("Send FCM token to server successfully");
          }
        } catch (error) {
          console.log(error);
        }
      });
  } else {
    console.log("Failed token");
  }
};

export const FCMConfig = (userId: any) => {
  getFCMToken(userId);

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
        // set Initial route here
      }
    });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
    // set Initial route here
  });

  // Handle background messages using setBackgroundMessageHandler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });

  // Handle foreground messages using setBackgroundMessageHandler
  messaging().onMessage(async (remoteMessage) => {
    if (remoteMessage.notification?.title) {
      Alert.alert(
        remoteMessage?.notification?.title,
        `${remoteMessage.notification.body}`,
        [{ text: "Đã hiểu" }]
      );
    }
  });
};
