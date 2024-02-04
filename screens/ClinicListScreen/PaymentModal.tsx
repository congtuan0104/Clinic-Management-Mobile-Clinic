import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  CheckIcon,
  FormControl,
  Heading,
  Input,
  Modal,
  Select,
  VStack,
  WarningOutlineIcon,
  useToast,
  Text,
  HStack,
  Radio,
} from "native-base";
import { appColor } from "../../theme";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { IClinicInfo } from "../../types/clinic.types";
import { paymentService } from "../../services/payment.services";
import { openBrowserAsync } from "expo-web-browser";
import ToastAlert from "../../components/Toast/Toast";
const { format } = require("number-currency-format");

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  chosenClinic: IClinicInfo | undefined;
}

export default function PaymentModal({
  isOpen,
  onClose,
  chosenClinic,
}: IProps) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("Zalopay");

  // Handle finding chosen clinic from clinic list
  useEffect(() => {}, []);
  const handlePayment = async () => {
    try {
      // call API to create link
      const response = await paymentService.createPayment({
        totalCost: chosenClinic?.subscriptions[0].plans.currentPrice,
        provider: paymentMethod,
        subscribePlanId: chosenClinic?.subscriptions[0].planId.toString(),
      });
      if (response.status) {
        // console.log(response.data);
        await openBrowserAsync(response.data);
        onClose();
        // changePosition(true);
      }
    } catch (error: any) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thất bại!"
              description={error.response.data.message}
              status="success"
            />
          );
        },
      });
      console.log(error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <Modal.Content width="90%" borderRadius={20}>
        <Modal.CloseButton _icon={{ color: "#fff" }} variant="outline" />
        <Modal.Header backgroundColor="primary.300">
          <Text
            color={appColor.white}
            fontFamily="body"
            fontWeight="bold"
            fontSize={20}
          >
            Thông tin thanh toán
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Box p={3} borderRadius={20} backgroundColor="primary.100">
            <HStack justifyContent="space-between" alignItems="center">
              <Text flex={2}>
                {chosenClinic?.subscriptions[0].plans.planName}
              </Text>
              <VStack flex={1}>
                <Text
                  fontSize={15}
                  color="#b92a00"
                  fontWeight="bold"
                  fontFamily="body"
                >
                  {format(chosenClinic?.subscriptions[0].plans.currentPrice, {
                    decimalsDigits: 0,
                    decimalSeparator: "",
                  })}
                  đ
                </Text>
                <Text fontSize={15} fontFamily="body">
                  {chosenClinic?.subscriptions[0].plans.duration} ngày
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Text mt={2}>
            Mua gói và khởi tạo phòng khám{" "}
            <Text fontWeight="bold">{chosenClinic?.name}</Text>
          </Text>
          <Text my={3} fontWeight="bold" fontSize={15}>
            Chọn kênh thanh toán
          </Text>
          <Radio.Group
            name="myRadioGroup"
            accessibilityLabel="favorite number"
            value={paymentMethod}
            onChange={(nextValue) => {
              setPaymentMethod(nextValue);
            }}
            flex={1}
          >
            <VStack space={3}>
              <Radio value="Zalopay">
                <Text>ZaloPay</Text>
              </Radio>
              <Radio value="Vnpay">
                <Text>VNPay</Text>
              </Radio>
              <Radio value="ATM">
                <Text>ATM</Text>
              </Radio>
              <Radio value="InternationalCard">
                <Text>Thẻ quốc tế (Visa)</Text>
              </Radio>
            </VStack>
          </Radio.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              backgroundColor={appColor.white}
              borderWidth={1}
              borderColor="secondary.300"
              _pressed={{
                backgroundColor: "secondary.100",
              }}
              onPress={() => {
                onClose();
              }}
            >
              <Text color="secondary.300">Quay lại</Text>
            </Button>
            <Button
              onPress={() => {
                handlePayment();
              }}
            >
              Thanh toán
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
    </Modal>
  );
}
