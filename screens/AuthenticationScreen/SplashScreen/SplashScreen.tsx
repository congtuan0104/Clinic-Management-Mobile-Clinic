import * as React from "react";
import { ActivityIndicator } from "react-native";
import { Text, View } from "native-base";
import { appColor } from "../../../theme";
export default function SplashScreen() {
  return (
    <View
      backgroundColor={appColor.background}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text fontSize={18} color="gray.600">
        Ứng dụng đang tải, vui lòng đợi...
      </Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
