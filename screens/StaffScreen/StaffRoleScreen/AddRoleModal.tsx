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
  Text,
  VStack,
  View,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import { ClinicSelector, changeRoles } from "../../../store";
import { useEffect, useState } from "react";
import ToastAlert from "../../../components/Toast/Toast";
import { clinicService } from "../../../services";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { IRole, IRoleCreate, IRolePermission } from "../../../types/role.types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { planService } from "../../../services/plan.services";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

interface IProps {
  isEditMode?: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedRole: IRole | null;
  getRoleList: () => void;
  setIsEditMode: any;
}
// Validate
const schema: yup.ObjectSchema<IRoleCreate> = yup.object({
  name: yup.string().required("Tên không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
});

export default function AddRoleModal({
  isEditMode,
  isOpen,
  onClose,
  getRoleList,
  setIsEditMode,
  selectedRole,
}: IProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const dispatch = useAppDispatch();
  const [permissionList, setPermissionList] = useState<any>([]);
  const [checkBoxError, setCheckboxError] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IRoleCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const getPermissionList = async () => {
    try {
      const planId = clinic?.subscriptions[0].planId;
      if (planId) {
        const response = await planService.getPlanById(planId);
        if (response.status && response.data) {
          const newPermissionList = response.data.planOptions.map(
            (item: any) => ({ ...item, checked: false })
          );
          setPermissionList(newPermissionList);
        }
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Chưa xử lý được: lấy lại các permission cũ
  useEffect(() => {
    // Handle default value when the mode is editing mode
    if (isEditMode === true) {
      reset({
        name: selectedRole?.name,
        description: selectedRole?.description,
      });
      //  Handle checkbox list
      getPermissionList();
      // const tempPermissions = permissionList;
      // if (selectedRole?.rolePermissions) {
      //   for (let i = 0; i < selectedRole.rolePermissions.length; i++) {
      //     for (let j = 0; j < tempPermissions?.length; j++) {
      //       if (selectedRole.rolePermissions[i].id === tempPermissions[j].id) {
      //         tempPermissions[j].checked = true;
      //         break;
      //       }
      //     }
      //   }
      // }
      // setPermissionList(tempPermissions);
    } else {
      getPermissionList();
    }
  }, [selectedRole, clinic?.id]);

  const toggleCheckbox = (id: any, index: any) => {
    const checkboxData = [...permissionList];
    checkboxData[index].checked = !checkboxData[index].checked;
    setPermissionList(checkboxData);
  };

  const onSubmit = async (data: IRoleCreate) => {
    const checkedCheckbox = getCheckedCheckbox();
    if (checkedCheckbox.length !== 0) {
      setIsLoading(true);
      setCheckboxError(false);
      // Create data object to send to server
      const requestObject = {
        name: data.name,
        description: data.description,
        permissions: checkedCheckbox,
      };
      // If editMode = true (update):
      if (isEditMode) {
        try {
          const response = await clinicService.updateUserGroupRole(
            clinic?.id,
            selectedRole?.id,
            requestObject
          );
          if (response.status) {
            try {
              const response = await clinicService.getUserGroupRole(clinic?.id);
              if (response.status && response.data) {
                dispatch(changeRoles(response.data));
              } else {
              }
            } catch (error) {
              console.log(error);
            }
            toast.show({
              render: () => {
                return (
                  <ToastAlert
                    title="Thành công"
                    description="Cập nhật lại vai trò thành công!"
                    status="success"
                  />
                );
              },
            });
            getRoleList();
            resetForm();
            onClose();
          } else {
            toast.show({
              render: () => {
                return (
                  <ToastAlert
                    title="Thất bại"
                    description="Cập nhật lại vai trò thất bại!"
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
                  description="Cập nhật lại vai trò thất bại!"
                  status="error"
                />
              );
            },
          });
        }
        setIsEditMode(false);
      } else {
        // If editMode = false (create new role):
        try {
          const response = await clinicService.createUserGroupRole(
            clinic?.id,
            requestObject
          );
          if (response.status) {
            try {
              const response = await clinicService.getUserGroupRole(clinic?.id);
              if (response.status && response.data) {
                dispatch(changeRoles(response.data));
              } else {
              }
            } catch (error) {
              console.log(error);
            }
            toast.show({
              render: () => {
                return (
                  <ToastAlert
                    title="Thành công"
                    description="Tạo vai trò mới thành công!"
                    status="success"
                  />
                );
              },
            });
            getRoleList();
            resetForm();
            onClose();
          } else {
            toast.show({
              render: () => {
                return (
                  <ToastAlert
                    title="Thất bại"
                    description="Tạo vai trò mới thất bại!"
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
                  description="Tạo vai trò mới thất bại!"
                  status="error"
                />
              );
            },
          });
        }
      }

      setIsLoading(false);
    } else {
      setCheckboxError(true);
      return;
    }
  };

  const getCheckedCheckbox = () => {
    const filteredArray = permissionList.filter(
      (item: any) => item.checked === true
    );
    let checkedArray: any = [];
    filteredArray.map((item: any) => {
      checkedArray.push(item.id);
    });
    return checkedArray;
  };

  const resetForm = () => {
    reset();
    const resetArray = permissionList.map((item: any) => {
      return { ...item, checked: false };
    });
    setPermissionList(resetArray);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        if (isEditMode) {
          setIsEditMode(false);
        }
      }}
    >
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Modal.Content width="90%">
        <Modal.CloseButton />
        <Modal.Header>
          {!isEditMode ? "Thêm vai trò" : "Cập nhật vai trò"}
        </Modal.Header>
        <Modal.Body>
          <Box>
            <ScrollView minWidth="100%" maxWidth="100%">
              <VStack space={5}>
                <FormControl isRequired isInvalid={errors.name ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Tên vai trò
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
                    name="name"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.name && <Text>{errors.name.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
                {/**Description */}
                <FormControl
                  isRequired
                  isInvalid={errors.description ? true : false}
                >
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Mô tả{" "}
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        type="text"
                        placeholder="Nhập mô tả"
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                    name="description"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.description && (
                      <Text>{errors.description.message}</Text>
                    )}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={checkBoxError ? true : false}
                >
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Chọn các quyền{" "}
                  </FormControl.Label>
                  {permissionList.map((permission: any, index: any) => {
                    return (
                      <Checkbox
                        key={permission.id}
                        isChecked={permission.checked}
                        value={permission.id}
                        onChange={() => {
                          toggleCheckbox(permission.id, index);
                        }}
                        mt={2}
                      >
                        {permission.optionName}
                      </Checkbox>
                    );
                  })}
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {checkBoxError && <Text>Cần chọn ít nhất 1 quyền</Text>}
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
                if (isEditMode) {
                  setIsEditMode(false);
                }
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
