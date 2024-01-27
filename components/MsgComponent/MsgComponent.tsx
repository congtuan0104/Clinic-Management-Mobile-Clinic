// import moment from 'moment';
import React, { Component } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { HStack, Link, Text } from "native-base";
import { appColor } from "../../theme";
import { Image } from "native-base";
import TimeDelivery from "./TimeDelivery/TimeDelivery";
import { Entypo } from "@expo/vector-icons";

const MsgComponent = (props: any) => {
  const { sender, content, time, type, link, username } = props;
  return (
    <Pressable style={{ marginVertical: 0 }}>
      <Image
        src={`https://ui-avatars.com/api/?name=${username}`}
        borderRadius={100}
        size={50}
        alt="ff"
        style={[styles.avatarBox, sender ? styles.right : [styles.left]]}
      />
      <View
        style={[
          styles.masBox,
          {
            alignSelf: sender ? "flex-end" : "flex-start",
            backgroundColor: sender ? appColor.primary : appColor.white,
          },
        ]}
      >
        {type === "text" ? (
          <Text color={sender ? "#fff" : "#000"}>{content}</Text>
        ) : type === "image" ? (
          <Image src={link} alt={content} size="200px" />
        ) : (
          <Link
            href={link}
            _text={{
              color: sender ? "#fff" : "#000",
            }}
          >
            <HStack alignItems="center" space={2}>
              <Entypo
                name="download"
                size={24}
                color={sender ? "#fff" : "#000"}
              />
              <Text maxW="90%" color={sender ? "#fff" : "#000"}>
                {content}
              </Text>
            </HStack>
          </Link>
        )}
        <TimeDelivery sender={sender} time={time} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  masBox: {
    alignSelf: "flex-end",
    // Khoảng cách 2 bên của message box
    marginHorizontal: 45,
    minWidth: 80,
    maxWidth: "80%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    borderRadius: 10,
  },

  avatarBox: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  left: {
    left: 7,
    bottom: 5,
  },
  right: {
    right: 7,
    bottom: 5,
  },
});

export default MsgComponent;
