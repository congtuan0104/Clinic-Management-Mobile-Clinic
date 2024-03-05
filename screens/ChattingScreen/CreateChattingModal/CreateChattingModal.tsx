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
} from "native-base";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Controller, useForm } from "react-hook-form";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { ICreateGroupChatRequest } from "../../../types";
import { useAppSelector } from "../../../hooks";
import { ClinicSelector, userInfoSelector } from "../../../store";
import { chatService, clinicService } from "../../../services";
import { appColor } from "../../../theme";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import ToastAlert from "../../../components/Toast/Toast";

// Validate
const schema: yup.ObjectSchema<ICreateGroupChatRequest> = yup.object({
  groupName: yup.string().required("Tên nhóm không được để trống"),
  maxMember: yup
    .number()
    .required("Số thành viên tối đa không được để trống")
    .min(2, "Số thành viên trong nhóm phải lớn hơn hoặc bằng 2"),
  type: yup.string().required("Loại nhóm không được để trống"),
});

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  getGroupList: () => void;
}

export default function CreateChattingModal({
  isOpen,
  onClose,
  getGroupList,
}: IProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICreateGroupChatRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      groupName: "",
      maxMember: 50,
      type: "group",
    },
  });
  const toast = useToast();

  const clinic = useAppSelector(ClinicSelector);
  const userInfo = useAppSelector(userInfoSelector);
  // Sample data

  const [selected, setSelected] = useState([]);
  const [userInClinic, setUserInClinic] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Handle get user in clinic to create group
  useEffect(() => {
    const getUsersInClinic = async () => {
      // Call API to get users in clinic
      // (Using clinicId = 6d43806c-c86c-4e9e-ab12-ce9d4e0357f9 (testing))
      const clinicId = clinic?.id;
      if (clinicId) {
        const response = await clinicService.getStaffClinic(clinicId);
        console.log("res: ", response);
        let data: any = [];
        if (response.status) {
          const responseData = response.data;
          if (responseData) {
            responseData.map((item: any) => {
              if (item.users.id !== userInfo?.id)
                data.push({
                  key: item.users.id,
                  value: item.users.firstName + " " + item.users.lastName,
                });
            });
          }
          //console.log('data: ', data);
          setUserInClinic(data);
        } else {
          console.log("Server error");
        }
      }
    };
    getUsersInClinic();
  }, []);
  // Xử lí việc gọi API tạo nhóm
  const onSubmit = async (data: ICreateGroupChatRequest) => {
    setIsLoading(true);
    const dataSubmit = {
      ...data,
      userList: [...selected, userInfo?.id],
    };
    // Call API to create chat group
    try {
      const response = await chatService.createGroupChat(dataSubmit);
      // console.log(response.data);
      if (response.status) {
        getGroupList();
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thành công!"
                description="Đã tạo thành công nhóm chat mới!"
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
                description="Không thể tạo được nhóm chat bây giờ. Vui lòng thử lại sau."
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
              title="Lỗi"
              description="Có lỗi bất ngờ xảy ra. Vui lòng thử lại sau."
              status="error"
            />
          );
        },
      });
    }
    setIsLoading(false);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <Modal.Content width="90%" borderRadius={20}>
        <Modal.CloseButton variant="outline" />
        <Modal.Header>
          <Text fontFamily="body" fontWeight="bold" fontSize={16}>
            Tạo nhóm
          </Text>
        </Modal.Header>
        <Modal.Body>
          <VStack space={5}>
            <FormControl isRequired isInvalid={errors.groupName ? true : false}>
              <FormControl.Label
                _text={{
                  bold: true,
                  color: appColor.inputLabel,
                }}
              >
                Tên nhóm
              </FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    placeholder="Nhập tên nhóm của bạn"
                    onChangeText={onChange}
                    value={value}
                    onBlur={onBlur}
                  />
                )}
                name="groupName"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.groupName && <Text>{errors.groupName.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
            <MultipleSelectList
              fontFamily="Montserrat-Semibold"
              setSelected={(val: any) => setSelected(val)}
              //   onSelect={() => console.log(selected)}

              data={userInClinic}
              label="Danh sách thành viên"
              save="key"
              notFoundText="Hiện tại phòng khám chưa có thành viên."
              placeholder="Thêm thành viên"
              searchPlaceholder="Tìm kiếm thành viên"
              maxHeight={300}
              boxStyles={{
                borderRadius: 20,
              }}
              dropdownStyles={{ borderRadius: 20 }}
              labelStyles={{
                fontWeight: "normal",
                color: appColor.inputLabel,
              }}
              badgeStyles={{
                backgroundColor: appColor.backgroundPrimary,
                margin: -3,
                paddingVertical: 3,
                paddingHorizontal: 10,
              }}
              checkBoxStyles={{
                borderColor: appColor.backgroundPrimary,
                borderWidth: 1,
              }}
              dropdownItemStyles={{
                paddingVertical: 4,
              }}
              dropdownTextStyles={{
                fontSize: 14,
                color: appColor.inputLabel,
              }}
              inputStyles={{
                color: appColor.inputLabel,
              }}
            />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button onPress={handleSubmit(onSubmit)}>Tạo nhóm</Button>
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
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
    </Modal>
  );
}
