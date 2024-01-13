import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  HStack,
  Heading,
  Input,
  ScrollView,
  Text,
  VStack,
  View,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import { SubscriptionDashboardScreenProps } from "../../Navigator/SubscriptionNavigator";
import { ClinicSelector, userInfoSelector } from "../../store";
import { appColor } from "../../theme";
import { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import { clinicService } from "../../services";
import { useAppSelector } from "../../hooks";
import { CreateNewRoleScreenProps } from "../../Navigator/RoleNavigator";
import { IRole, IRoleCreate, IRolePermission } from "../../types/role.types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { planService } from "../../services/plan.services";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

// Validate
const schema: yup.ObjectSchema<IRoleCreate> = yup.object({
  name: yup.string().required("Tên không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
});

export default function CreateNewRoleScreen({
  navigation,
  route,
}: CreateNewRoleScreenProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const [permissionList, setPermissionList] = useState<any>([]);
  const [checkBoxError, setCheckboxError] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRoleCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
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
    getPermissionList();
  }, []);

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
      try {
        const response = await clinicService.createUserGroupRole(
          clinic?.id,
          requestObject
        );
        if (response.status) {
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
        } else {
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Thất bại"
                  description="Tạo vai trò mới thất bại!"
                  status="success"
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
                status="success"
              />
            );
          },
        });
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
  return (
    <>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Box
        bgColor="#fff"
        minWidth="90%"
        maxWidth="90%"
        minH="90%"
        maxH="90%"
        alignSelf="center"
        alignItems="center"
        p={5}
        borderRadius={20}
      >
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
            <FormControl isRequired isInvalid={checkBoxError ? true : false}>
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
                  >
                    {permission.description}
                  </Checkbox>
                );
              })}
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {checkBoxError && <Text>"Cần chọn ít nhất 1 quyền"</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
          </VStack>
        </ScrollView>
      </Box>
      <HStack mt={5} space={5} minW="90%" maxW="90%" alignSelf="center">
        <Button
          onPress={() => {
            navigation.goBack();
          }}
          flex={1}
        >
          Quay lại
        </Button>
        <Button flex={1} onPress={handleSubmit(onSubmit)}>
          Thêm vai trò
        </Button>
      </HStack>
    </>
  );
}
