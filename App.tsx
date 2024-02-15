import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store/store";
import StackNavigator from "./Navigator/StackNavigator";
import { NativeBaseProvider } from "native-base";
import { theme } from "./theme";
import "react-native-gesture-handler";
import "expo-dev-client";
import { useFonts } from "expo-font";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Montserrat-Light": require("./assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-LightItalic": require("./assets/fonts/Montserrat-LightItalic.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-MediumItalic": require("./assets/fonts/Montserrat-MediumItalic.ttf"),
    "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-SemiBoldItalic": require("./assets/fonts/Montserrat-SemiBoldItalic.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-BoldItalic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBold": require("./assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraBoldItalic": require("./assets/fonts/Montserrat-ExtraBoldItalic.ttf"),
    "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return undefined;
  }
  return (
    <NativeBaseProvider theme={theme}>
      <Provider store={store}>
        <StackNavigator />
        <StatusBar style="auto" />
      </Provider>
    </NativeBaseProvider>
  );
}
