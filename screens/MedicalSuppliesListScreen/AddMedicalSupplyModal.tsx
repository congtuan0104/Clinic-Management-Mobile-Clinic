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
  TextArea,
} from "native-base";
import { CATEGORY_TYPE } from "../../enums";
import SelectDropdown from "react-native-select-dropdown";
import { ClinicSelector, changeRoles } from "../../store";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import {
  categoryApi,
  clinicServiceApi,
  medicalSuppliesServices,
} from "../../services";
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
import { IPostMedicalSuppliesParams } from "../../types/medical-supplies.types";

const chevronDown = require("../../assets/chevron_down.png");

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  handleReRender: () => void;
}

interface IFormData {
  medicineName: string;
  description?: string | undefined;
  vendor?: string | undefined;
  stock: string;
  expiry?: string | undefined;
  unit: string;
  categoryId: number;
}

// Validate
const schema = yup.object().shape({
  medicineName: yup.string().required("Vui lòng nhập tên danh mục"),
  unit: yup.string().required("Vui lòng nhập đơn vị tính"),
  description: yup.string(),
  vendor: yup.string(),
  stock: yup.string().required("Vui lòng nhập số lượng tối thiểu"),
  expiry: yup.string(),
  categoryId: yup.number().required("Vui lòng chọn loại vật tư"),
});

export default function AddMedicalSupplyModal({
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
          type: CATEGORY_TYPE.SUPPLIER,
        });
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
      medicineName: "",
      description: "",
      vendor: "",
      stock: "1",
      expiry: "",
      unit: "",
    },
  });

  const onInvalid = (errors: any) => console.error(errors);
  const handleSubmitForm = async (newData: IFormData) => {
    setIsLoading(true);
    if (parseInt(newData.stock) <= 0) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thất bại!"
              description="Số lượng vật tư không hợp lệ!"
              status="error"
            />
          );
        },
      });
      setIsLoading(false);
      onClose();
      return;
    }
    if (clinic?.id) {
      const dataRequest: IPostMedicalSuppliesParams = {
        medicineName: newData.medicineName,
        categoryId: newData.categoryId,
        clinicId: clinic?.id,
        description: newData.description,
        expiry: newData.expiry,
        stock: parseInt(newData.stock),
        unit: newData.unit,
        vendor: newData.vendor,
      };
      try {
        const res = await medicalSuppliesServices.addNewMedicalSupplies(
          dataRequest
        );
        if (res.status) {
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Thành công"
                  description="Thêm vật tư thành công!"
                  status="success"
                />
              );
            },
          });
          onClose();
          reset();
          handleReRender();
        } else {
          toast.show({
            render: () => {
              return (
                <ToastAlert
                  title="Thất bại!"
                  description={res.message}
                  status="error"
                />
              );
            },
          });
          onClose();
          reset();
          handleReRender();
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
        onClose();
        reset();
        handleReRender();
      }
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
            Tạo mới vật tư
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Box>
            <ScrollView minWidth="100%" maxWidth="100%">
              <VStack space={5}>
                <FormControl
                  isRequired
                  isInvalid={errors.medicineName ? true : false}
                >
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Tên vật tư
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        type="text"
                        placeholder="Tên thiết bị, vật tư"
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                    name="medicineName"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.medicineName && (
                      <Text>{errors.medicineName.message}</Text>
                    )}
                  </FormControl.ErrorMessage>
                </FormControl>
                {/**Loại dịch vụ*/}
                <FormControl
                  isRequired
                  isInvalid={errors.categoryId ? true : false}
                >
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Loại vật tư
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SelectDropdown
                        data={categoryList.map((category) => category.name)}
                        onSelect={(selectedItem, index) => {
                          setValue("categoryId", categoryList[index].id);
                          setCategoryId(categoryList[index].id);
                        }}
                        defaultButtonText={"Chọn loại vật tư"}
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
                    name="categoryId"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.categoryId && (
                      <Text>{errors.categoryId.message}</Text>
                    )}
                  </FormControl.ErrorMessage>
                </FormControl>
                <HStack space={2}>
                  <Box flex={1}>
                    {/**Giá*/}
                    <FormControl
                      isRequired
                      isInvalid={errors.stock ? true : false}
                    >
                      <FormControl.Label
                        _text={{
                          bold: true,
                        }}
                      >
                        Số lượng
                      </FormControl.Label>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            type="text"
                            placeholder="Giá"
                            onChangeText={onChange}
                            value={value ? value : ""}
                            onBlur={onBlur}
                            defaultValue="1"
                          />
                        )}
                        name="stock"
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.stock && <Text>{errors.stock.message}</Text>}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                  <Box flex={2}>
                    {/**Đơn vị tính*/}
                    <FormControl
                      isRequired
                      isInvalid={errors.unit ? true : false}
                    >
                      <FormControl.Label
                        _text={{
                          bold: true,
                        }}
                      >
                        Đơn vị tính
                      </FormControl.Label>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            type="text"
                            placeholder="Cái, hộp, lọ,..."
                            onChangeText={onChange}
                            value={value ? value : ""}
                            onBlur={onBlur}
                          />
                        )}
                        name="unit"
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.unit && <Text>{errors.unit.message}</Text>}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                </HStack>
                {/* Expiry */}
                <FormControl isInvalid={errors.expiry ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Hạn sử dụng
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        type="text"
                        placeholder="Hạn sử dụng (nếu có)"
                        onChangeText={onChange}
                        value={value ? value : ""}
                        onBlur={onBlur}
                      />
                    )}
                    name="expiry"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.expiry && <Text>{errors.expiry.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
                {/* Vendor */}
                <FormControl isInvalid={errors.expiry ? true : false}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    Nhà sản xuất
                  </FormControl.Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        type="text"
                        placeholder="Nhà sản xuất (nếu có)"
                        onChangeText={onChange}
                        value={value ? value : ""}
                        onBlur={onBlur}
                      />
                    )}
                    name="vendor"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.vendor && <Text>{errors.vendor.message}</Text>}
                  </FormControl.ErrorMessage>
                </FormControl>
                {/* description */}
                <FormControl isInvalid={errors.description ? true : false}>
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
                      <TextArea
                        type="text"
                        placeholder="Thêm mô tả về thiết bị (không bắt buộc)"
                        onChangeText={onChange}
                        value={value ? value : ""}
                        onBlur={onBlur}
                        autoCompleteType={""}
                        fontSize={14}
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
                <Box height={100}></Box>
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
  dropdown1BtnTxtStyle: {
    // color: "#a1a1aa",
    textAlign: "left",
    fontSize: 15,
    marginLeft: 4,
  },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    marginTop: -70,
    borderRadius: 15,
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: {
    color: "#444",
    textAlign: "left",
  },
});
