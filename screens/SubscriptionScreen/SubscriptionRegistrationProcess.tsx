import { SubscriptionRegistrationProcessScreenProps } from "../../Navigator/SubscriptionNavigator";
import { Box, Button, HStack, Pressable, Text } from "native-base";
import StepIndicator from "@fcxlabs/react-native-step-indicator";
import { useEffect, useState } from "react";
import { appColor } from "../../theme";
import { AntDesign } from "@expo/vector-icons";
import { StepOneScreen } from "./SubscriptionRegistrationStep/SubscriptionRegistrationStep1";
import { StepTwoScreen } from "./SubscriptionRegistrationStep/SubscriptionRegistrationStep2";
import { StepThreeScreen } from "./SubscriptionRegistrationStep/SubscriptionRegistrationStep3";
import { StepFourScreen } from "./SubscriptionRegistrationStep/SubscriptionRegistrationStep4";
import { StepFiveScreen } from "./SubscriptionRegistrationStep/SubscriptionRegistrationStep5";
import { customStyles } from "../../config/stepIndicator";
import { paymentService } from "../../services/payment.services";
import { openBrowserAsync } from "expo-web-browser";
import { navigationRef } from "../../Navigator/StackNavigator";
import { userNavigationRef } from "../../Navigator/UserNavigator";
export default function SubscriptionRegistrationProcessScreen({
  navigation,
  route,
}: SubscriptionRegistrationProcessScreenProps) {
  const labels = ["Điền thông tin", "Xác nhận gói", "Thanh toán"];
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Zalopay");
  const [subscriptionPlanId, setSubscriptionPlanId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { planData, paymentResult } = route.params;
  useEffect(() => {
    // Khi currentStep thay đổi, sẽ render lại màn hình tương ứng với step mới
    // Ví dụ: khi bạn muốn chuyển từ step 1 sang step 2, gọi hàm setCurrentStep(2)
    // Bạn có thể gọi hàm setCurrentStep ở đâu đó trong code của bạn để chuyển step
    // (ví dụ: khi người dùng nhấn nút Next)
    // setCurrentStep(2);
    if (paymentResult) {
      setCurrentPosition(4);
    }
  }, [currentPosition]);

  const handleNavigation = () => {
    navigation.navigate("SubscriptionList");
  };
  const renderStepScreen = () => {
    switch (currentPosition) {
      case 0:
        return (
          <StepOneScreen
            planData={planData}
            changePosition={changePosition}
            setSubscriptionPlanId={setSubscriptionPlanId}
            handleNavigation={handleNavigation}
          />
        );
      case 1:
        return (
          <StepTwoScreen planData={planData} changePosition={changePosition} />
        );
      case 2:
        return (
          <StepThreeScreen
            planData={planData}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            changePosition={changePosition}
            handlePayment={handlePayment}
          />
        );
      // case 3:
      //   return <StepFourScreen changePosition={changePosition} />;
      // case 4:
      //   return (
      //     <StepFiveScreen
      //       changePosition={changePosition}
      //       paymentResult={paymentResult}
      //     />
      //   );
      default:
        return null;
    }
  };
  const changePosition = (foward: boolean) => {
    if ((currentPosition === 0 && !foward) || (currentPosition === 4 && foward))
      return;
    if (foward) {
      setCurrentPosition(currentPosition + 1);
    } else {
      setCurrentPosition(currentPosition - 1);
    }
  };
  const handlePayment = async () => {
    try {
      // call API to create link
      const response = await paymentService.createPayment({
        totalCost: planData.currentPrice,
        provider: paymentMethod,
        subscribePlanId: subscriptionPlanId.toString(),
      });
      if (response.status) {
        // console.log(response.data);
        await openBrowserAsync(response.data);
        // changePosition(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box>
      <Box mt="3"></Box>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        stepCount={3}
      />

      {/** Step card */}
      <Box
        alignSelf="center"
        width="90%"
        borderRadius={20}
        backgroundColor="#fff"
        minH="88%"
        maxH="88%"
        p={5}
      >
        {renderStepScreen()}
      </Box>
    </Box>
  );
}
