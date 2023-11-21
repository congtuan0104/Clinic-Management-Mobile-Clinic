import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { useAppSelector, useAppDispatch } from "../../hooks";
import * as SecureStore from "expo-secure-store";
import { ILoginWithGoogleRequest, IUserInfo } from "../../types";
import {
  Checkbox,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  Modal,
} from "native-base";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILoginRequest, ILoginResponse } from "../../types";
import * as yup from "yup";
import { LoginScreenProps } from "../../types";
import { RootState, login } from "../../store";
import { authApi } from "../../services/auth.services";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { firebaseConfig } from "../../config/firebase";
import { WEB_CLIENT_ID } from "../../constants";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});
let providerStr: string = "";

const schema: yup.ObjectSchema<ILoginRequest> = yup
  .object({
    email: yup
      .string()
      .required("Email không được để trống")
      .email("Email không hợp lệ"),
    password: yup
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
      .required("password required"),
  })
  .required();

const Login: React.FC<LoginScreenProps> = ({
  navigation,
  route,
}: LoginScreenProps) => {
  const [isChecked, setIsChecked] = React.useState(false);
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userIdFromProvider, setUserIdFromProvider] = useState<string>("");
  const [providerLogin, setProviderLogin] = useState<string>("");
  const [emailFromProvider, setEmailFromProvider] = useState<string | null>(""); // email được chọn để đăng ký tài khoản
  const [showModal, setShowModal] = useState<boolean>(false);
  const [emailChoose, setEmailChoose] = useState<string>(""); // email được chọn để đăng ký tài khoản

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Rest of your Login component code
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const { setToken } = route.params;
  const dispatch = useAppDispatch();
  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  async function revokeGoogleAccess() {
    try {
      // await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Tiếp theo, thực hiện đăng nhập lại với Google
      onGoogleButtonPress();
    } catch (error) {
      console.error("Không thể thu hồi quyền truy cập Google: ", error);
    }
  }

  async function onGoogleButtonPress() {
    providerStr = "google";
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    const userSignIn = auth().signInWithCredential(googleCredential);
    userSignIn
      .then(async (userInfoFromProvider) => {
        if (userInfoFromProvider) {
          setUserIdFromProvider(userInfoFromProvider.user.uid);
          setProviderLogin(providerStr);
          // kiểm tra account có tồn tại, nếu có thì lưu thông tin user và token
          const res = await authApi.getUserByAccountId(
            userInfoFromProvider.user.uid,
            providerStr
          );
          console.log(`userAccount: `, res.data.user);
          if (res.data.user) {
            await SecureStore.setItemAsync("token", res.data.token);
            await SecureStore.setItemAsync(
              "user",
              JSON.stringify(res.data.user)
            );
            dispatch(login(res.data.user));
            // Show notification here
            // Auto-navigate to Home
          } else {
            setEmailFromProvider(userInfoFromProvider.user.email);
            // open modal here
            setShowModal(true);
          }
          // call API
          // await authApi
          //   .loginWithGoogle(loginWithGoogleUser)
          //   .then(async (response) => {
          //     if (response.data?.data) {
          //       dispatch(login(response.data?.data.user));
          //       await SecureStore.setItemAsync(
          //         "token",
          //         response.data?.data.token
          //       );
          //       await SecureStore.setItemAsync(
          //         "user",
          //         JSON.stringify(response.data?.data.user)
          //       );
          //       setToken(response.data.data.token);
          //     }
          //   });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const sendEmailVerifyLinkAccount = async (email: string) => {
    try {
      console.log(`Gửi mail xác thực đến  `, email);
      const res = await authApi.sendEmailVerifyUser({
        email,
        key: userIdFromProvider,
        provider: providerLogin,
      });
      if (res.status) {
        navigation.navigate("ValidateNotification", {
          email: email,
          setToken: setToken,
        });
        setShowModal(false);
      }
      setEmailChoose("");
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit: SubmitHandler<ILoginRequest> = async (
    data: ILoginRequest
  ) => {
    console.log("go here");
    // call api...
    // After call api: assume the API give token, we need to set token
    await authApi
      .login(data)
      .then(async (response) => {
        console.log("api");
        if (response.data) {
          console.log("response.data?.data.user: ", response.data?.data.user);
          dispatch(login(response.data?.data.user));
          await SecureStore.setItemAsync("token", response.data?.data.token);
          await SecureStore.setItemAsync(
            "user",
            JSON.stringify(response.data?.data.user)
          );
          setToken(response.data.data.token);
        }
      })
      .catch((error) => {
        // Print error to the screen
        console.log(error.response.data);
      });
  };

  return (
    <Center flex="1" px="3">
      <Center w="100%">
        <Box safeArea p="2" py="8" w="100%" /* maxW="500" */>
          <Heading
            size="xl"
            fontWeight="bold"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
          >
            Đăng nhập
          </Heading>
          <Heading
            mt="1"
            _dark={{
              color: "warmGray.200",
            }}
            color="coolGray.600"
            fontWeight="medium"
            size="xs"
          >
            <HStack mt="6" justifyContent="center">
              <Text
                fontSize="18"
                color="black"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                hoặc{" "}
              </Text>
              <Link
                _text={{
                  color: "#1890ff",
                  fontWeight: "medium",
                  fontSize: "18",
                }}
                href="#"
              >
                Tạo mới tài khoản
              </Link>
            </HStack>
          </Heading>

          <VStack space={3} mt="5">
            <FormControl /* isInvalid={!!errors.email} */>
              <Controller
                control={control}
                rules={
                  {
                    // required: true,
                  }
                }
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              {errors.email ? (
                <Text style={{ color: "red" }}>{errors.email.message}</Text>
              ) : null}
            </FormControl>
            <FormControl>
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="password"
              />
              {errors.password ? (
                <Text style={{ color: "red" }}>{errors.password.message}</Text>
              ) : null}
            </FormControl>
            <Checkbox
              value="one"
              isChecked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              my={2}
              colorScheme="blue"
            >
              Ghi nhớ thông tin đăng nhập
            </Checkbox>
            <Button
              mt="2"
              colorScheme="indigo"
              style={styles.buttonStyle}
              onPress={handleSubmit(onSubmit)}
            >
              <Text ml={2} fontWeight="medium" style={{ color: "white" }}>
                Đăng nhập
              </Text>
            </Button>
            <Button
              mt="2"
              justifyContent="center"
              alignItems="center"
              bg="white" // Set the background color to white
              borderWidth={1} // Set the border width
              borderColor="gray.500" // Set the border color to gray
              borderRadius="md" // Set the border radius
              p={2} // Add padding to the button
              onPress={revokeGoogleAccess}
            >
              <HStack space={2} alignItems="center">
                <Image
                  style={styles.logoIcon}
                  contentFit="cover"
                  source={require("../../assets/logo.png")}
                />
                <Text ml={2} fontWeight="regular">
                  Đăng nhập với Google
                </Text>
              </HStack>
            </Button>
          </VStack>
          <Link
            _text={{
              fontSize: "14",
              fontWeight: "500",
              color: "#1890ff",
            }}
            alignSelf="center"
            mt="3"
          >
            Quên mật khẩu?
          </Link>
        </Box>
        <HStack space={1} alignItems="center" justifyContent="center">
          <Text>Chưa có tài khoản?</Text>
          <Link
            isUnderlined={false}
            _text={{
              _light: {
                color: "info.600",
              },
            }}
            onPress={() =>
              navigation.navigate("Register", { setToken: setToken })
            }
          >
            Đăng ký
          </Link>
        </HStack>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              Tài khoản của bạn chưa được liên kết, vui lòng chọn email muốn
              liên kết
            </Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>
                  Chọn Email để liên kết tài khoản
                </FormControl.Label>
                <Button
                  onPress={() => {
                    // Implement sending email here
                    if (emailFromProvider) {
                      setEmailChoose(emailFromProvider);
                      sendEmailVerifyLinkAccount(emailFromProvider);
                    }
                  }}
                >
                  <Text>{emailFromProvider}</Text>
                </Button>
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Hoặc nhập Email của bạn</FormControl.Label>
                <Input
                  placeholder="Nhập tài khoản bạn muốn liên kết"
                  value={emailChoose}
                  onChangeText={(emailChoose) => {
                    setEmailChoose(emailChoose);
                  }}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Thoát
                </Button>
                <Button
                  onPress={() => {
                    setShowModal(false);
                    sendEmailVerifyLinkAccount(emailChoose);
                  }}
                >
                  Tiếp tục
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </Center>
  );
};

const styles = StyleSheet.create({
  logoIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  buttonStyle: {
    backgroundColor: "#1890ff",
    fontWeight: "bold",
    color: "white",
  },
});

export default Login;
