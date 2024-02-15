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
  Image,
  Text,
  VStack,
  View,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import { StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { ClinicSelector } from "../../store";
import { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import { categoryApi } from "../../services";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { IRole, IRoleCreate, IRolePermission } from "../../types/role.types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { appColor } from "../../theme";
import { ICategory, ICreateCategoryPayload } from "../../types";
import { CATEGORY_TYPE } from "../../enums";

const chevronDown = require("../../assets/chevron_down.png");

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  handleReRender: () => void;
}

interface IFormData {
  type: string;
  name: string;
  note?: string | null;
  description?: string | null;
}

// Validate
const schema = yup.object().shape({
  type: yup.string().required("Bạn chưa chọn loại danh mục"),
  name: yup.string().required("Bạn chưa nhập tên danh mục"),
  note: yup.string(),
  description: yup.string(),
});

export default function AddCategoryModal({
  isOpen,
  onClose,
  handleReRender,
}: IProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categoryType, setCategoryType] = useState<CATEGORY_TYPE>();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "",
      name: "",
      note: "",
      description: "",
    },
  });

  const handleSubmitForm = async (data: IFormData) => {
    let dataSubmit: ICreateCategoryPayload;
    if (categoryType) {
      dataSubmit = {
        name: data.name,
        note: data.note ? data.note : "",
        description: data.description ? data.description : "",
        type: categoryType,
      };

      const res = await categoryApi.createCategory(clinic!.id, dataSubmit);

      if (res.status) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thành công"
                description="Thêm danh mục thành công!"
                status="success"
              />
            );
          },
        });
        reset();
        onClose();
        handleReRender();
      } else {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Lỗi"
                description="Thêm thất bại. Vui lòng kiểm tra lại thông tin."
                status="error"
              />
            );
          },
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Modal.Content borderRadius={20} width="90%">
        <Modal.CloseButton />
        <Modal.Header>
          <Text fontSize={16} fontWeight={"bold"}>
            Thêm danh mục
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Box>
            <ScrollView minWidth="100%" maxWidth="100%">
              <VStack space={5}>
                <FormControl isRequired isInvalid={errors.type ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Loại danh mục
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SelectDropdown
                        data={["Dịch vụ y tế", "Vật tư y tế"]}
                        onSelect={(selectedItem, index) => {
                          setCategoryType(index + 1);
                          setValue("type", selectedItem);
                        }}
                        defaultButtonText={"Chọn loại danh mục"}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                          return item;
                        }}
                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextStyle={styles.dropdown1BtnTxtStyle}
                        renderDropdownIcon={() => (
                          <Image alt="icon" source={chevronDown} size={18} />
                        )}
                        dropdownIconPosition={"right"}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdown1RowStyle}
                        rowTextStyle={styles.dropdown1RowTxtStyle}
                      />
                    )}
                    name="type"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.type && <Text>{errors.type.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.name ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Tên danh mục
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        type="text"
                        placeholder="Nhập tên danh mục"
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
                {/**note*/}
                <FormControl isRequired isInvalid={errors.note ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Ghi chú
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        type="text"
                        placeholder="Nhập ghi chú(không bắt buộc)"
                        onChangeText={onChange}
                        value={value ? value : ""}
                        onBlur={onBlur}
                      />
                    )}
                    name="note"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.note && <Text>{errors.note.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
                {/* description */}
                <FormControl
                  isRequired
                  isInvalid={errors.description ? true : false}
                >
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
                        placeholder="Nhập mô tả(không bắt buộc)"
                        onChangeText={onChange}
                        value={value ? value : ""}
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
              </VStack>
            </ScrollView>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              backgroundColor="#fff"
              borderColor="secondary.300"
              borderWidth={1}
              _text={{
                color: "secondary.300",
              }}
              _pressed={{
                backgroundColor: "secondary.100",
              }}
              onPress={() => {
                onClose();
              }}
            >
              Quay lại
            </Button>
            <Button onPress={handleSubmit(handleSubmitForm)}>Xác nhận</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    width: "100%",
    height: 46,
    backgroundColor: "#F5F5FC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4D4D5",
  },
  dropdown1BtnTxtStyle: { color: "black", textAlign: "left", fontSize: 15 },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    marginTop: -70,
    borderRadius: 15,
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
});
