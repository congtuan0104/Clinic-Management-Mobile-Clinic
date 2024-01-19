import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { CreateChattingGroupScreenProps } from "../../Navigator/ChattingNavigator";
import {
  Box,
  Button,
  Center,
  CheckIcon,
  FormControl,
  Heading,
  Input,
  Select,
  VStack,
  WarningOutlineIcon,
} from "native-base";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ICreateGroupChatRequest } from "../../types";
import { Controller, useForm } from "react-hook-form";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { appColor } from "../../theme";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAppSelector } from "../../hooks";
import { ClinicSelector, userInfoSelector } from "../../store";
import { chatService } from "../../services";
import { clinicService } from "../../services/clinic.services";

// Validate
const schema: yup.ObjectSchema<ICreateGroupChatRequest> = yup.object({
  groupName: yup.string().required("Tên nhóm không được để trống"),
  maxMember: yup
    .number()
    .required("Số thành viên tối đa không được để trống")
    .min(2, "Số thành viên trong nhóm phải lớn hơn hoặc bằng 2"),
  type: yup.string().required("Loại nhóm không được để trống"),
});

export default function CreateChattingGroupScreen({
  navigation,
  route,
}: CreateChattingGroupScreenProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateGroupChatRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      groupName: "",
      maxMember: 50,
      type: "group",
    },
  });
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
        const response = await clinicService.getUsersInClinic(clinicId);
        let data: any = [];
        if (response.status) {
          const responseData = response.data;
          if (responseData) {
            responseData.map((user) => {
              if (user.id !== userInfo?.id)
                data.push({
                  key: user.id,
                  value: user.lastName + " " + user.firstName,
                });
            });
          }
          setUserInClinic(data);
        } else {
          console.log("Server error");
        }
      }
    };
    getUsersInClinic();
  }, [userInClinic]);
  // Xử lí việc gọi API tạo nhóm
  const onSubmit = async (data: ICreateGroupChatRequest) => {
    setIsLoading(true);
    const dataSubmit = {
      ...data,
      userList: [...selected, userInfo?.id],
    };
    console.log(dataSubmit);
    // Call API to create chat group
    const response = await chatService.createGroupChat(dataSubmit);
    // console.log(response.data);
    if (response.status) {
    } else {
    }
    setIsLoading(false);
    navigation.navigate("ChattingGroupList");
  };

  return (
    <Center flex={1}>
      <VStack width="90%" space={5} mx="3" maxW="500px">
        <Heading size="xl" mb="4" alignSelf="center">
          Tạo nhóm mới
        </Heading>
        <FormControl isRequired isInvalid={errors.groupName ? true : false}>
          <FormControl.Label
            _text={{
              bold: true,
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
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.groupName && <Text>{errors.groupName.message}</Text>}
          </FormControl.ErrorMessage>
        </FormControl>
        {/* <FormControl isRequired isInvalid={errors.maxMember ? true : false}>
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Số lượng tối đa
          </FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                keyboardType="numeric"
                type="text"
                placeholder="Nhập số lượng thành viên tối đa của nhóm"
                onChangeText={onChange}
                value={value.toString()}
                onBlur={onBlur}
              />
            )}
            name="maxMember"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.maxMember && <Text>{errors.maxMember.message}</Text>}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={errors.type ? true : false}>
          <FormControl.Label>Chọn loại nhóm</FormControl.Label>
          <Controller
            name="type"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                minWidth="200"
                placeholder="Chọn loại nhóm"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
                mt="1"
                onValueChange={(value) => onChange(value)}
              >
                <Select.Item label="Nhóm chat" value="2" />
                <Select.Item label="Nhóm 1 - 1" value="1" />
              </Select>
            )}
          />

          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please make a selection!
          </FormControl.ErrorMessage>
        </FormControl> */}
        <MultipleSelectList
          setSelected={(val: any) => setSelected(val)}
          onSelect={() => console.log(selected)}
          data={userInClinic}
          label="Danh sách thành viên"
          save="key"
          notFoundText="Không có dữ liệu"
          placeholder="Thêm thành viên"
          searchPlaceholder="Tìm kiếm thành viên"
          maxHeight={300}
          labelStyles={{
            fontWeight: "normal",
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
          }}
        />
        <Button onPress={handleSubmit(onSubmit)}>Tạo nhóm</Button>
        <Button
          onPress={() => {
            navigation.navigate("ChattingGroupList");
          }}
        >
          Quay lại
        </Button>
      </VStack>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
    </Center>
  );
}
