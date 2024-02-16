import { firebase } from "../../config/firebase";
import { Platform } from "react-native";

import { userInfoSelector } from "../../store";
import {
  getAuth,
  FacebookAuthProvider,
  signInWithCredential,
  AuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  LoginManager,
  AccessToken,
  Settings,
  Profile,
} from "react-native-fbsdk-next";

import { useAppDispatch, useAppSelector } from "../../hooks";

import { authApi } from "../../services";
import { useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

// description: hook xử lý các tác vụ liên quan đến chức năng đăng nhập, đăng xuất

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(userInfoSelector);
  const [isLogin, setIsLogin] = useState(false);

  // kiểm tra xem người dùng đã đăng nhập hay chưa
  useEffect(() => {
    if (userInfo) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [userInfo]);

  const linkAccountFacebook = async () => {
    // lấy thông tin user từ provider
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only");
    }
    await LoginManager.logInWithPermissions(["public_profile", "email"]);
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) return;
    const facebookCredentials = FacebookAuthProvider.credential(
      data.accessToken
    );
    const auth = getAuth();
    console.log("auth: ", auth);
    const res = await signInWithCredential(auth, facebookCredentials);
    console.log("facebookCredentials: ", facebookCredentials);
    console.log("response of facebook: ", res);

    const user = res.user;
    console.log("User info:", user);

    // gọi api liên kết tài khoản với user
    await authApi
      .linkAccount({
        key: user.uid,
        userId: userInfo?.id,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        picture: user.photoURL || "",
        provider: "facebook",
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const linkAccountGoogle = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    const userSignIn = auth().signInWithCredential(googleCredential);
    userSignIn.then(async (res) => {
      const user = res.user;
      // gọi api liên kết tài khoản với user
      await authApi
        .linkAccount({
          key: user.uid,
          userId: userInfo?.id,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          picture: user.photoURL || "",
          provider: "google",
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };

  return {
    linkAccountFacebook,
    linkAccountGoogle,
  };
};
