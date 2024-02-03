import { View } from "react-native";
import { useState } from "react";
import { Button, FormControl, Input, Modal, WarningOutlineIcon, Text, VStack, useToast } from "native-base";
import { authApi } from "../../services/auth.services";
import { IAddNewPasswordRequest } from '../../types'
import { appColor } from "../../theme";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { userInfoSelector } from "../../store";
import { useAppSelector } from "../../hooks";
import ToastAlert from "../../components/Toast/Toast";

import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

interface AddNewPasswordFormData {
    newPassword: string;
    confirmNewPassword: string;
}

const schema = yup.object().shape({
    newPassword: yup
      .string()
      .required('Bạn chưa nhập mật khẩu mới')
      .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
    confirmNewPassword: yup
      .string()
      .required('Vui lòng xác nhận lại mật khẩu')
      .oneOf([yup.ref('newPassword'), ''], 'Không trùng với mật khẩu đã nhập'),
});

const AddNewPasswordModal = (props: any) => {
  const { showModal, setShowModal } = props;
  const userInfo = useAppSelector(userInfoSelector);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, handleSubmit, formState: { errors }, } = useForm<AddNewPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: AddNewPasswordFormData) => {
    setIsLoading(true);
    //console.log('data change password: ', data);
    
    try {
        if (userInfo?.email) {
            //console.log('here');
            const dataRequest : IAddNewPasswordRequest = {
                email: userInfo?.email,
                password: data.newPassword
            }
            //console.log('data request: ', dataRequest);
          const response = await authApi.addNewPassword(
            dataRequest
          );
          //console.log('response: ', response)
            if (response.status === true)
            {
                //console.log('go here')
                toast.show({
                render: () => {
                    return (
                    <ToastAlert
                        title="Thành công"
                        description="Đặt mật khẩu thành công!"
                        status="success"
                    />
                    );
                },
                });
            }
            else {
                toast.show({
                    render: () => {
                    return (
                        <ToastAlert
                        title="Lỗi"
                        description="Đặt mật khẩu thất bại. Vui lòng kiểm tra lại thông tin."
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
                description="Đặt mật khẩu thất bại. Vui lòng kiểm tra lại thông tin."
                status="error"
              />
            );
          },
        });
      }
    setIsLoading(false);
    setShowModal(false);
  }
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} closeOnOverlayClick={false}>
      <Modal.Content>
        <Modal.Header backgroundColor="secondary.200"><Text fontWeight="bold">Bạn chưa đặt mật khẩu</Text></Modal.Header>
        <Modal.Body>
        <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
          {/******************************Password ********************************/}
              <FormControl
                isRequired
                isInvalid={errors.newPassword ? true : false}
              >
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

export default AddNewPasswordModal;
