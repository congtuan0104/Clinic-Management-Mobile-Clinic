import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  HStack,
  Button,
  VStack,
  Image,
  ScrollView,
  useToast,
} from "native-base";
import { NotificationListScreenProps } from "../../Navigator/NotificationNavigator";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import { useAppSelector } from "../../hooks";
import { userInfoSelector } from "../../store";
import { firebase } from "@react-native-firebase/database";
import { Notification } from "../../types/notification.types";
import dayjs from "dayjs";
const NotificationListScreen = ({
  navigation,
  route,
}: NotificationListScreenProps) => {
  // using useEffect to get all notification on realtime database
  const userInfo = useAppSelector(userInfoSelector);
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [initialNotificationList, setInitialNotificationList] = useState<
    Notification[]
  >([]);
  const toast = useToast();
  useEffect(() => {
    setNotificationList([]);
    setInitialNotificationList([]);
    const reference = firebase
      .app()
      .database(
        "https://clinus-1d1d1-default-rtdb.asia-southeast1.firebasedatabase.app/"
      )
      .ref(`/notifications/${userInfo?.id}`);
    const onChildAdd = reference.on("child_added", (snapshot) => {
      setNotificationList((state) => [snapshot.val(), ...state]);
      setInitialNotificationList((state) => [snapshot.val(), ...state]);
    });
    // Stop listening for updates when no longer required
    return () => reference.off("child_added", onChildAdd);
  }, [userInfo?.id]);

  return (
    <Box
      backgroundColor="#fff"
      borderRadius={20}
      minW="90%"
      maxW="90%"
      alignSelf="center"
      p={5}
      maxH="95%"
      minH="95%"
      mt="5%"
    >
      <ScrollView>
        <VStack space={5}>
          {notificationList?.length ? (
            notificationList.map((notification) => {
              return (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  image="https://picsum.photos/200"
                  content={notification.content}
                  time={dayjs(notification.sendingTime).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                  isRead={notification.isRead}
                />
              );
            })
          ) : (
            <Text fontFamily="body" fontSize={20} color="coolGray.500">
              Bạn chưa có bất kì thông báo nào.
            </Text>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default NotificationListScreen;
