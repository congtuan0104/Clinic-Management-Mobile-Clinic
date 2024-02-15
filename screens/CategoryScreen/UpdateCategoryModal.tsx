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
import { ClinicSelector, changeRoles } from "../../store";
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
import { ICategory, IUpdateCategoryPayload } from "../../types";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  category: ICategory;
  handleReRender: () => void;
}

interface IFormData {
  name: string;
  note?: string | null;
  description?: string | null;
}

// Validate
const schema = yup.object().shape({
  name: yup.string().required("Bạn chưa nhập tên danh mục"),
  note: yup.string(),
  description: yup.string(),
});

export default function UpdateCategoryModal({
  isOpen,
  onClose,
  category,
  handleReRender,
}: IProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: category.name,
      note: category.note,
      description: category.description,
    },
  });

  const onInvalid = (errors: any) => console.error(errors);
  const handleSubmitForm = async (newData: IUpdateCategoryPayload) => {
    console.log("handle");
    console.log("new data:", newData);
    const res = await categoryApi.updateCategory(category.id, newData);

    if (res.status) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thành công"
              description="Cập nhật danh mục thành công!"
              status="success"
            />
          );
        },
      });
      onClose();
      handleReRender();
    } else {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Lỗi"
              description="Cập nhật thất bại. Vui lòng kiểm tra lại thông tin."
              status="error"
            />
          );
        },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Modal.Content borderRadius={20} width="90%">
        <Modal.CloseButton />
        <Modal.Header>
          <Text fontSize={16} fontWeight={"bold"}>
            Cập nhật thông tin danh mục
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
              backgroundColor={appColor.white}
              borderWidth={1}
              borderColor="secondary.300"
              _pressed={{
                backgroundColor: "secondary.100",
              }}
              _text={{
                color: "secondary.300",
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
