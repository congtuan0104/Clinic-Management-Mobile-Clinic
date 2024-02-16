import { View } from "react-native";
import { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  Modal,
  WarningOutlineIcon,
  Text,
  VStack,
  useToast,
} from "native-base";
import { authApi } from "../../services/auth.services";
import { IChangePasswordRequest } from "../../types";
import { appColor } from "../../theme";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { userInfoSelector } from "../../store";
import { useAppSelector } from "../../hooks";
import ToastAlert from "../../components/Toast/Toast";

import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Bạn chưa nhập mật khẩu hiện tại")
    .min(8, "Mật khẩu phải có tối thiểu 8 ký tự"),
  newPassword: yup
    .string()
    .required("Bạn chưa nhập mật khẩu mới")
    .min(8, "Mật khẩu phải có tối thiểu 8 ký tự"),
  confirmNewPassword: yup
    .string()
    .required("Vui lòng xác nhận lại mật khẩu")
    .oneOf([yup.ref("newPassword"), ""], "Không trùng với mật khẩu đã nhập"),
});

const ChangePasswordModal = (props: any) => {
  const { showModal, setShowModal } = props;
  const userInfo = useAppSelector(userInfoSelector);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    const dataRequest: IChangePasswordRequest = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      isReset: "false",
    };
    try {
      if (userInfo?.id) {
        const response = await authApi.changePassword(
          dataRequest,
          userInfo?.id
        );
        //console.log('response: ', response)
        if (response.status === true) {
          //console.log('go here')
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Thành công"
                  description="Đổi mật khẩu thành công!"
                  status="success"
                />
              );
            },
          });
        } else {
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Lỗi"
                  description="Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin."
                  status="error"
                />
              );
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Lỗi"
              description="Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin."
              status="error"
            />
          );
        },
      });
    }
    reset();
    setIsLoading(false);
    setShowModal(false);
  };
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content borderRadius={20}>
        <Modal.CloseButton />
        <Modal.Header backgroundColor="secondary.200">
          <Text fontWeight="bold" fontSize={16}>
            Đổi mật khẩu
          </Text>
        </Modal.Header>
        <Modal.Body>
          <LoadingSpinner
            showLoading={isLoading}
            setShowLoading={setIsLoading}
          />
          {/******************************Current Password ********************************/}
          <FormControl
            isRequired
            isInvalid={errors.currentPassword ? true : false}
          >
            <FormControl.Label
              _text={{
                bold: true,
                color: appColor.inputLabel,
              }}
            >
              Mật khẩu hiện tại
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  bg="light.50"
                />
              )}
              name="currentPassword"
              defaultValue=""
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.currentPassword && (
                <Text>{errors.currentPassword.message}</Text>
              )}
            </FormControl.ErrorMessage>
          </FormControl>
          {/******************************Password ********************************/}
          <FormControl isRequired isInvalid={errors.newPassword ? true : false}>
            <FormControl.Label
              _text={{
                bold: true,
                color: appColor.inputLabel,
              }}
            >
              Mật khẩu mới
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="password"
                  placeholder="Mật khẩu mới"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  bg="light.50"
                />
              )}
              name="newPassword"
              defaultValue=""
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.newPassword && <Text>{errors.newPassword.message}</Text>}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.confirmNewPassword ? true : false}
          >
            <FormControl.Label
              _text={{
                bold: true,
                color: appColor.inputLabel,
              }}
            >
              Xác nhận mật khẩu
            </FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="password"
                  placeholder="Xác nhận lại mật khẩu"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  bg="light.50"
                />
              )}
              name="confirmNewPassword"
              defaultValue=""
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.confirmNewPassword && (
                <Text>{errors.confirmNewPassword.message}</Text>
              )}
            </FormControl.ErrorMessage>
          </FormControl>
          <VStack space={2} mt={5}>
            <Button
              onPress={handleSubmit(onSubmit)}
              colorScheme="info"
              _text={{
                color: "white",
              }}
            >
              Xác nhận
            </Button>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ChangePasswordModal;
