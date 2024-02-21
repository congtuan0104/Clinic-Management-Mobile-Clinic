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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useEffect, useState } from "react";
import ToastAlert from "../../../components/Toast/Toast";
import { authApi, clinicService, staffApi } from "../../../services";
import { useAppSelector } from "../../../hooks";
import {
  IRole,
  IRoleCreate,
  IRolePermission,
  ICreateStaffPayload,
} from "../../../types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { appColor } from "../../../theme";
import { AuthModule, PERMISSION } from "../../../enums";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  handleReRender: () => void;
}

interface IFormData {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birth?: string;
  phone?: string;
  address?: string;
  roleId: string;
  description?: string;
  specialize?: string;
  experience?: number;
}

const genderData = ["Nam", "Nữ", "Không rõ"];
const genNum = ["1", "0", "-1"];

// Validate
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Thông tin email là bắt buộc")
    .email("Email không hợp lệ"),
  firstName: yup.string().required("Bạn chưa nhập họ"),
  lastName: yup.string().required("Bạn chưa nhập tên"),
  phone: yup.string(),
  gender: yup.string().required("Giới tính không được để trống"),
  birth: yup.string(),
  address: yup.string(),
  experience: yup
    .number()
    .min(0, "Số năm kinh nghiệm không hợp lệ")
    .typeError("Số năm kinh nghiệm không hợp lệ"),
  roleId: yup.string().required("Bạn phải chọn một vai trò cho nhân viên"),
  specialize: yup.string(),
  description: yup.string(),
});

// Cần bổ sung: khi mà gửi lời mời xong, nếu người kia nhận được lời mời thì sẽ hiển thị ra luôn người đó trong danh sách nhân viên.
export default function AddStaffModal({
  isOpen,
  onClose,
  handleReRender
}: IProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const [isNotifyVisible, setIsNotifyVisible] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  const handleConfirm = (date: Date) => {
    console.log("date confirmed: ", date);
    hideDatePicker();
    setSelectedDate(date);
  };
  const onInvalid = (errors: any) => console.error(errors);
  const {
    control,
    reset,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      gender: "",
      birth: "",
      phone: "",
      address: "",
      roleId: "",
      description: "",
      specialize: undefined,
      experience: undefined,
    },
  });
  const getRoleList = async () => {
    try {
      const response = await clinicService.getUserGroupRole(clinic?.id);
      console.log('role list:', response)
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
   // danh sách role được phép thực hiện dịch vụ
   const doctorRoles = roleList?.
   filter(role => role.rolePermissions.
     map(p => p.id).
     includes(PERMISSION.PERFORM_SERVICE)).map(role => role.id);
  /**
   * Kiểm tra nhân viên đã tồn tại chưa
   */
  const handleCheckEmail = async () => {
    if (!getValues("email") || getValues("email") == "") {
      setIsDisabled(false);
      reset();
      return;
    }
    clearErrors();

    const res = await authApi.findUserByEmail(getValues("email"));
    if (res.status && res.data) {
      const userInfoStaff = res.data;
      
      if (userInfoStaff.moduleId !== AuthModule.ClinicStaff) {
        setError("email", { message: "Email đã tồn tại" });
        return;
      }

      const resStaff = await staffApi.getStaffs({
        clinicId: clinic?.id,
        email: getValues("email"),
      });

      if (resStaff.status && resStaff.data && resStaff.data.length > 0) {
        setError("email", { message: "Nhân viên đã tồn tại" });
        return;
      }
      
      setUserId(userInfoStaff.id);
      setValue("firstName", userInfoStaff.firstName);
      setValue("lastName", userInfoStaff.lastName);
      userInfoStaff.phone && setValue("phone", userInfoStaff.phone);
      userInfoStaff.address && setValue("address", userInfoStaff.address);
      userInfoStaff.birthday &&
        setSelectedDate(new Date(userInfoStaff.birthday));
      userInfoStaff.gender &&
        setValue("gender", userInfoStaff.gender.toString());
        setIsNotifyVisible(true);
        setIsDisabled(true);
    } else {
      if (res.status && res.data === null) {
        setIsDisplay(true);
        setIsDisabled(true)
      }
    }
  };
  
  const handleResetInput = () => {
    reset(); 
    setIsDisplay(false);
    setIsDisabled(false);
  }
  const onSubmit = async (data: IFormData) => {
    setIsLoading(true);
    if (!clinic?.id) return;
    console.log('IFormData:', data)
    const payload: ICreateStaffPayload = {
      clinicId: clinic.id,
      userId: userId,
      userInfo: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        gender: Number(data.gender),
        birthday: selectedDate? selectedDate : undefined,
      },
      roleId: Number(data.roleId),
      specialize: data.specialize,
      experience: data.experience,
      description: data.description,
    };
    console.log('payload:', payload);
    if (payload.userId && payload.userId !== "") {
      delete payload.userInfo;
    }

    const res = await staffApi.createStaff(payload);

    if (res.status) {
      onClose();
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thành công"
              description="Thêm nhân viên thành công!"
              status="success"
            />
          );
        },
      });
    }
    reset();
    setIsLoading(false);
    setIsDisplay(false);
    setIsDisabled(false);
    handleReRender();
  };

  const renderInput = () => {
    return (
      <>
        <HStack space={3}>
          <Box flex={2}>
            <FormControl isRequired isInvalid={errors.lastName ? true : false}>
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
                {errors.lastName && <Text>{errors.lastName.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          {/**Firstname input */}
          <Box flex={3}>
            <FormControl isRequired isInvalid={errors.firstName ? true : false}>
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
                {errors.firstName && <Text>{errors.firstName.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
        </HStack>
        {/** */}
        <FormControl isRequired isInvalid={errors.gender ? true : false}>
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Giới tính
          </FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                minW="full"
                maxW="full"
                placeholder="Chọn giới tính"
                _selectedItem={{
                  bg: "#a4a1ff",
                  // endIcon: <WarningOutlineIcon size="5" />,
                }}
                mt="1"
                onValueChange={onChange}
                selectedValue={value}
              >
                {genderData &&
                  genderData.map((gender: string, index: number) => {
                    return (
                      <Select.Item
                        key={index}
                        label={gender}
                        value={genNum[index]}
                      />
                    );
                  })}
              </Select>
            )}
            name="gender"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.gender && <Text>{errors.gender.message}</Text>}
          </FormControl.ErrorMessage>
        </FormControl>

        {/**birth */}
        <FormControl isRequired isInvalid={errors.birth ? true : false}>
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Ngày sinh
          </FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                type="text"
                placeholder=""
                onChangeText={onChange}
                value={selectedDate
                  ?.toISOString()
                  .substring(0, 10)
                  .split("-")
                  .reverse()
                  .join("-")}
                onBlur={onBlur}
                onFocus={showDatePicker}
              />
            )}
            name="birth"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.birth && <Text>{errors.birth.message}</Text>}
          </FormControl.ErrorMessage>
        </FormControl>

        {/**phone */}
        <FormControl isRequired isInvalid={errors.phone ? true : false}>
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Số điện thoại
          </FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                type="text"
                placeholder="Nhập số điện thoại"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
            name="phone"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.phone && <Text>{errors.phone.message}</Text>}
          </FormControl.ErrorMessage>
        </FormControl>
        {/**address */}
        <FormControl isRequired isInvalid={errors.address ? true : false}>
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Địa chỉ
          </FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                type="text"
                placeholder="Nhập địa chỉ"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
            name="address"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.address && <Text>{errors.address.message}</Text>}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={errors.roleId ? true : false}>
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
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.roleId && <Text>{errors.roleId.message}</Text>}
          </FormControl.ErrorMessage>
        </FormControl>
        {/**description */}
        <FormControl isRequired isInvalid={errors.description ? true : false}>
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Mô tả
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
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.description && <Text>{errors.description.message}</Text>}
          </FormControl.ErrorMessage>
        </FormControl>
      </>
    );
  };

  const renderInputDoctor = () => {
    return (
      <>
      <FormControl isRequired isInvalid={errors.specialize ? true : false}>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Chuyên môn
        </FormControl.Label>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              type="text"
              placeholder="Nhập chuyên môn"
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
            />
          )}
          name="specialize"
        />
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {errors.specialize && <Text>{errors.specialize.message}</Text>}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={errors.experience ? true : false}>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Kinh nghiệm
        </FormControl.Label>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              type="text"
              placeholder="Nhập số năm kinh nghiệm"
              onChangeText={onChange}
              value={value?.toString()}
              onBlur={onBlur}
            />
          )}
          name="experience"
        />
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {errors.experience && <Text>{errors.experience.message}</Text>}
        </FormControl.ErrorMessage>
      </FormControl>
    </>
    )
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <DateTimePickerModal
          date={selectedDate}
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      <Modal.Content width="90%">
        <Modal.CloseButton />
        <Modal.Header>Thêm nhân viên</Modal.Header>
        <Modal.Body>
          <Box>
            <ScrollView minWidth="100%" maxWidth="100%">
              <VStack space={5}>
                {/**Email input */}
                <FormControl isRequired isInvalid={errors.email ? true : false} isReadOnly={isDisabled}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Địa chỉ Email
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type="text"
                        placeholder="Nhập email"
                        
                        onChangeText={onChange}
                        value={value}
                        
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
                {!isDisplay && !isNotifyVisible ? (
                  <Button onPress={handleCheckEmail}>Tiếp tục</Button>
                ) : null}
                {isNotifyVisible ? (
                  <>
                    <Text>
                      Tài khoản nhân viên đã tồn tại trong hệ thống, thông tin
                      nhân viên sẽ được cập nhật từ tài khoản này
                    </Text>
                    <Button onPress={handleSubmit(onSubmit, onInvalid)}>
                      Xác nhận
                    </Button>
                  </>
                ) : null}
                {isDisplay ? renderInput() : null}
                {doctorRoles?.includes(Number(watch('roleId'))) ? renderInputDoctor() : <></>}
              </VStack>
            </ScrollView>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              bg="grey"
              onPress={() => {
                onClose();
              }}
            >
              Hủy
            </Button>
            {isDisplay? 
              <Button onPress={handleSubmit(onSubmit)}>Lưu</Button>
              : <></>
            }
            <Button onPress={handleResetInput}>Xóa thông tin</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
