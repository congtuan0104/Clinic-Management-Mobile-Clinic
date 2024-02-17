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
  Image,
} from "native-base";
import { CATEGORY_TYPE } from "../../enums";
import SelectDropdown from "react-native-select-dropdown";
import { ClinicSelector, changeRoles } from "../../store";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import { categoryApi, clinicServiceApi } from "../../services";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { appColor } from "../../theme";
import {
  ICategory,
  IClinicService,
  IPostClinicServiceParams,
} from "../../types";

const chevronDown = require("../../assets/chevron_down.png");

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  handleReRender: () => void;
}

interface IFormData {
  name: string;
  price: string;
  type?: string | null;
  description?: string | null;
}

// Validate
const schema = yup.object().shape({
  name: yup.string().required("Bạn chưa nhập tên dịch vụ"),
  price: yup.string().required("Bạn chưa nhập giá dịch vụ"),
  type: yup.string(),
  description: yup.string(),
});

export default function AddServiceModal({
  isOpen,
  onClose,
  handleReRender,
}: IProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [statusService, setStatusService] = useState<boolean>(true);
  const [categoryId, setCategoryId] = useState<number>();

  const getCategoryList = async () => {
    try {
      if (clinic?.id) {
        const response = await categoryApi.getCategories(clinic!.id, {
          type: CATEGORY_TYPE.SERVICE,
        });
        console.log("response: ", response);
        if (response.status && response.data) {
          setCategoryList(response.data);
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategoryList();
  }, [clinic?.id]);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      type: "",
      description: "",
    },
  });

  const onInvalid = (errors: any) => console.error(errors);
  const handleSubmitForm = async (newData: IFormData) => {
    setIsLoading(true);
    console.log("new data:", newData);
    const dataRequest: IPostClinicServiceParams = {
      serviceName: newData.name,
      price: parseInt(newData.price),
      description: newData.description ? newData.description : undefined,
      categoryId: categoryId,
      isDisabled: false,
    };
    try {
      const res = await clinicServiceApi.createClinicService(
        clinic!.id,
        dataRequest
      );
      if (res.status) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thành công"
                description="Thêm dịch vụ thành công!"
                status="success"
              />
            );
          },
        });
        onClose();
        reset();
        handleReRender();
      } else {
      }
    } catch (err: any) {
      console.log(err);
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Lỗi"
              description={err.response.data.message}
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
      <Modal.Content borderRadius={20} width="90%">
        <Modal.CloseButton />
        <Modal.Header>
          <Text fontSize={16} fontWeight={"bold"}>
            Tạo dịch vụ mới
          </Text>
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
                    Tên dịch vụ
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
                {/**Giá*/}
                <FormControl isRequired isInvalid={errors.price ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Giá dịch vụ
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        type="text"
                        placeholder="Nhập giá dịch vụ"
                        onChangeText={onChange}
                        value={value ? value : ""}
                        onBlur={onBlur}
                      />
                    )}
                    name="price"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.price && <Text>{errors.price.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
                {/**Loại dịch vụ*/}
                <FormControl isRequired isInvalid={errors.type ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Loại dịch vụ
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SelectDropdown
                        data={categoryList.map((category) => category.name)}
                        onSelect={(selectedItem, index) => {
                          setValue("type", selectedItem);
                          setCategoryId(categoryList[index].id);
                        }}
                        defaultButtonText={"Chọn loại dịch vụ"}
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
                    Mô tả dịch vụ
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
            <Button onPress={handleSubmit(handleSubmitForm, onInvalid)}>
              Lưu thay đổi
            </Button>
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
  dropdown1BtnTxtStyle: { color: "black", textAlign: "left", fontSize: 13 },
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
