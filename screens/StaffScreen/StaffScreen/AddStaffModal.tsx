import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  HStack,
  Heading,
  Input,
  Modal,
  ScrollView,
  Select,
  Text,
  VStack,
  View,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import { ClinicSelector, changeRoles } from "../../../store";
import { useEffect, useState } from "react";
import ToastAlert from "../../../components/Toast/Toast";
import { authApi, clinicService } from "../../../services";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { IRole, IRoleCreate, IRolePermission } from "../../../types/role.types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { planService } from "../../../services/plan.services";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { appColor } from "../../../theme";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  getStaffList: () => void;
}

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

// Validate
const schema = yup.object().shape({
  firstName: yup.string().required("Bạn chưa nhập họ"),
  lastName: yup.string().required("Bạn chưa nhập tên"),
  email: yup
    .string()
    .required("Thông tin email là bắt buộc")
    .email("Email không hợp lệ"),
  roleId: yup.string().required("Bạn phải chọn một vai trò cho nhân viên"),
});

// Cần bổ sung: khi mà gửi lời mời xong, nếu người kia nhận được lời mời thì sẽ hiển thị ra luôn người đó trong danh sách nhân viên.
export default function AddStaffModal({
  isOpen,
  onClose,
  getStaffList,
}: IProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
    },
  });
  const getRoleList = async () => {
    try {
      const response = await clinicService.getUserGroupRole(clinic?.id);
      if (response.status && response.data) {
        setRoleList(response.data);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoleList();
  }, [clinic?.id]);

  const onSubmit = async (data: IFormData) => {
    setIsLoading(true);
    if (!clinic?.id) return;
    try {
      const response = await authApi.inviteMemberToClinic({
        ...data,
        roleId: parseInt(data.roleId),
        clinicId: clinic.id,
      });
      if (response.status) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thành công!"
                description="Gửi mail thành công!"
                status="success"
              />
            );
          },
        });
        reset();
        getStaffList();
        onClose();
      } else {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thất bại"
                description="Mời thành viên vào phòng khám thất bại!"
                status="error"
              />
            );
          },
        });
      }
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thất bại"
              description="Mời thành viên vào phòng khám thất bại!"
              status="error"
            />
          );
        },
      });
    }
    setIsLoading(false);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Modal.Content width="90%">
        <Modal.CloseButton />
        <Modal.Header>Thêm nhân viên</Modal.Header>
        <Modal.Body>
          <Box>
            <ScrollView minWidth="100%" maxWidth="100%">
              <VStack space={5}>
                <HStack space={3}>
                  <Box flex={2}>
                    <FormControl
                      isRequired
                      isInvalid={errors.lastName ? true : false}
                    >
                      <FormControl.Label
                        _text={{
                          bold: true,
                        }}
                      >
                        Nhập họ
                      </FormControl.Label>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            type="text"
                            placeholder="Nhập họ"
                            onChangeText={onChange}
                            value={value}
                            onBlur={onBlur}
                          />
                        )}
                        name="lastName"
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.lastName && (
                          <Text>{errors.lastName.message}</Text>
                        )}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                  {/**Firstname input */}
                  <Box flex={3}>
                    <FormControl
                      isRequired
                      isInvalid={errors.firstName ? true : false}
                    >
                      <FormControl.Label
                        _text={{
                          bold: true,
                        }}
                      >
                        Nhập tên
                      </FormControl.Label>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            type="text"
                            placeholder="Nhập tên"
                            onChangeText={onChange}
                            value={value}
                            onBlur={onBlur}
                          />
                        )}
                        name="firstName"
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.firstName && (
                          <Text>{errors.firstName.message}</Text>
                        )}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                </HStack>
                {/**Email input */}
                <FormControl isRequired isInvalid={errors.email ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Địa chỉ Email
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        type="text"
                        placeholder="Nhập email"
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                    name="email"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.email && <Text>{errors.email.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.roleId ? true : false}
                >
                  <FormControl.Label>Chọn vai trò</FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Select
                        minW="full"
                        maxW="full"
                        placeholder="Chọn vai trò"
                        _selectedItem={{
                          bg: "#a4a1ff",
                          // endIcon: <WarningOutlineIcon size="5" />,
                        }}
                        mt="1"
                        onValueChange={onChange}
                        selectedValue={value}
                      >
                        {roleList &&
                          roleList.map((role: IRole, index: number) => {
                            return (
                              <Select.Item
                                key={index}
                                label={role.name}
                                value={role.id.toString()}
                              />
                            );
                          })}
                      </Select>
                    )}
                    name="roleId"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.roleId && <Text>{errors.roleId.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
              </VStack>
            </ScrollView>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              onPress={() => {
                onClose();
              }}
            >
              Hủy
            </Button>
            <Button onPress={handleSubmit(onSubmit)}>Lưu</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
