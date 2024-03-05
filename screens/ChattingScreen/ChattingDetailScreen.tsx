import { View, Text, FlatList, TextInput, Animated } from "react-native";
import React, { useEffect } from "react";
import { ChattingDetailScreenProps } from "../../Navigator/ChattingNavigator";
import { StyleSheet } from "react-native";
import MsgComponent from "../../components/MsgComponent/MsgComponent";
import { Pressable } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { appColor } from "../../theme";
import { firebase } from "@react-native-firebase/database";
import { useAppSelector } from "../../hooks";
import { userInfoSelector } from "../../store";
import dayjs from "dayjs";
import UploadImageModal from "../../components/UploadImageModal/UploadImageModal";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import storage from "@react-native-firebase/storage";
import { helpers } from "../../utils/helper";
import uuid from "react-native-uuid";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { IGroupChatMember } from "../../types";

export interface MsgType {
  link?: string;
  content: string;
  messageId: any;
  senderId: string;
  senderName: string;
  timestamp: any;
  type: string;
}

const ChattingDetailScreen: React.FC<ChattingDetailScreenProps> = ({
  route,
}) => {
  // Lấy thông tin user
  const userInfo = useAppSelector(userInfoSelector);

  const { group } = route.params;
  const [msg, setMsg] = React.useState<string>("");
  const [allChat, setallChat] = React.useState<MsgType[]>([]);
  const [disabled, setdisabled] = React.useState(false);
  const msgvalid = (txt: string) => txt && txt.replace(/\s/g, "").length;
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  useEffect(() => {
    setallChat([]);
    const reference = firebase
      .app()
      .database(
        "https://clinus-1d1d1-default-rtdb.asia-southeast1.firebasedatabase.app/"
      )
      .ref(`/chats/${group.id}`);
    const onChildAdd = reference.on("child_added", (snapshot) => {
      setallChat((state) => [snapshot.val(), ...state]);
    });
    // Stop listening for updates when no longer required
    return () => reference.off("child_added", onChildAdd);
  }, [group]);

  const getAvatarByUserId = (userId: string) => {
    const groupChatMember = group.groupChatMember;
    if (groupChatMember) {
      const userInfo = groupChatMember.find(
        (member: IGroupChatMember) => member.userId === userId
      );
      return userInfo?.avatar;
    }
  };
  const getNameByUserId = (userId: string) => {
    const groupChatMember = group.groupChatMember;
    if (groupChatMember) {
      const userInfo = groupChatMember.find(
        (member: IGroupChatMember) => member.userId === userId
      );
      return userInfo?.firstName + " " + userInfo?.lastName;
    }
  };
  // Hiệu ứng khi gửi tin nhắn
  const opacity = React.useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleUploadToRealtimeDB = async (
    msg: string,
    type: string,
    link?: string
  ) => {
    if (msg == "" || msgvalid(msg) == 0) {
      return false;
    }
    setdisabled(true);
    let msgData: MsgType = {
      content: msg,
      messageId: uuid.v4(),
      senderId: userInfo?.id ? userInfo.id : "null",
      senderName: userInfo?.email ? userInfo.email : "unknown",
      timestamp: dayjs().toISOString(),
      type: type,
      link: link,
    };
    // Lấy danh sách nhắn tin tại 1 thời điểm
    let currentLength = 0;
    const reference = firebase
      .app()
      .database(
        "https://clinus-1d1d1-default-rtdb.asia-southeast1.firebasedatabase.app/"
      )
      .ref(`/chats/${group.id}`);
    reference.once("value").then((snapshot) => {
      currentLength = snapshot.val() === null ? 0 : snapshot.val().length;
      firebase
        .app()
        .database(
          "https://clinus-1d1d1-default-rtdb.asia-southeast1.firebasedatabase.app/"
        )
        .ref(`/chats/${group.id}/${currentLength}`)
        .set(msgData)
        .then(() => {
          console.log("data set");
        });
      setdisabled(false);
    });
  };

  const handlePress = () => {
    handleUploadToRealtimeDB(msg, "text");
    setMsg("");
  };

  // Handle when user press to the button "Take image from camera"
  const onPressCamera = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        // After take a photo, we will get uri, name and send it to the firebase storage
        // using handlSendImage function
        const uri = result.assets[0].uri;
        const fileName = uri.substring(uri.lastIndexOf("/") + 1);
        await handleSendImage(fileName, uri);
      } else {
        alert("You did not select any image.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPressUploadImageGallery = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        // save image
        const uri = result.assets[0].uri;
        const fileName = uri.substring(uri.lastIndexOf("/") + 1);
        await handleSendImage(fileName, uri);
      } else {
        alert("You did not select any image.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle send image to firebase storage
  const handleSendImage = async (imageName: any, imageUri: any) => {
    setIsLoading(true);
    try {
      setShowModal(false);
      // Get reference to DB and send it to firebase storage.
      const reference = storage().ref(`/chats/${group.id}/${imageName}`);
      await reference.putFile(imageUri);
      // Get url of image from firebase storage returning
      const url = await storage()
        .ref(`/chats/${group.id}/${imageName}`)
        .getDownloadURL();
      handleUploadToRealtimeDB(imageName, "image", url);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // handle document picker function
  const handleDocumentPicker = async () => {
    setIsLoading(true);
    const docRes = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: true,
    });
    // get all assets
    const assets = docRes.assets;
    // if assets is null (user doesn't pick any asset), return
    if (!assets) {
      setIsLoading(false);
      return;
    } else {
      const fileList = assets;
      fileList.map(async (file) => {
        try {
          setShowModal(false);
          // Check if file is image. If it is an image, we will send it like image
          // Otherwise, we will send it as type = file
          if (helpers.checkFileType(file.mimeType) === "image") {
            await handleSendImage(file.name, file.uri);
          } else {
            const filename = file.name;
            const reference = storage().ref(`/chats/${group.id}/${filename}`);
            try {
              await reference.putFile(file.uri);
              const url = await storage()
                .ref(`/chats/${group.id}/${filename}`)
                .getDownloadURL();
              handleUploadToRealtimeDB(filename, "file", url);
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
    setIsLoading(false);
  };
  return (
    <>
      {userInfo ? (
        <View style={styles.container}>
          <FlatList
            style={{ flex: 1 }}
            data={allChat}
            showsVerticalScrollIndicator={false}
            inverted
            renderItem={({ item }) => {
              return (
                <MsgComponent
                  sender={item.senderId === userInfo?.id ? true : false}
                  content={item.content}
                  time={item.timestamp}
                  type={item.type}
                  link={item.link ? item.link : null}
                  username={getNameByUserId(item.senderId)}
                  avatar={getAvatarByUserId(item.senderId)}
                />
              );
            }}
          />

          {/**Bottom sending message bar */}
          <View
            style={{
              backgroundColor: "#fff",
              elevation: 5,
              // height: 60,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 4,
              justifyContent: "space-evenly",
            }}
          >
            {/** Send file button */}
            <Pressable
              disabled={disabled}
              onPress={handleDocumentPicker}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              {({ isPressed }) => (
                <Animated.View
                  style={{
                    opacity: isPressed ? opacity : 1,
                  }}
                >
                  <Ionicons name="attach" size={24} color={appColor.primary} />
                </Animated.View>
              )}
            </Pressable>
            {/** Send image button */}
            <Pressable
              disabled={disabled}
              onPress={() => {
                setShowModal(true);
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              {({ isPressed }) => (
                <Animated.View
                  style={{
                    opacity: isPressed ? opacity : 1,
                  }}
                >
                  <Ionicons
                    name="image-outline"
                    size={24}
                    color={appColor.primary}
                  />
                </Animated.View>
              )}
            </Pressable>
            <TextInput
              style={{
                backgroundColor: "#f0f2fd",
                width: "70%",
                height: "auto",
                borderRadius: 25,
                borderWidth: 0.5,
                borderColor: "#fff",
                color: "#000",
                paddingVertical: 7,
                paddingLeft: 10,
                paddingRight: 7,
              }}
              placeholder="Nhập tin nhắn"
              placeholderTextColor="#a8a29e"
              multiline={true}
              value={msg}
              onChangeText={(val) => setMsg(val)}
            />

            {/** Send message button */}
            <Pressable
              disabled={disabled}
              onPress={handlePress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              {({ isPressed }) => (
                <Animated.View
                  style={{
                    opacity: isPressed ? opacity : 1,
                  }}
                >
                  <Ionicons name="send" size={24} color={appColor.primary} />
                </Animated.View>
              )}
            </Pressable>
          </View>
          <UploadImageModal
            showModal={showModal}
            setShowModal={setShowModal}
            onPressCamera={onPressCamera}
            onPressUploadImageGallery={onPressUploadImageGallery}
          />
          <LoadingSpinner showLoading={isLoading} />
        </View>
      ) : (
        <View>
          <Text>Lỗi</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChattingDetailScreen;
