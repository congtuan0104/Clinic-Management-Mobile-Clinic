import { Center, AlertDialog, Button, Text, useToast } from "native-base";
import React, { useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import { medicalSuppliesServices } from "../../services";
import { IMedicalSupplies } from "../../types/medical-supplies.types";
import { appColor } from "../../theme";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  service: IMedicalSupplies;
  handleReRender: () => void;
}
const DeleteMedicalSupplyDialog = ({
  isOpen,
  onClose,
  service,
  handleReRender,
}: IProps) => {
  const cancelRef = React.useRef(null);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelteCategory = async () => {
    setIsLoading(true);
    try {
      const res = await medicalSuppliesServices.deleteMedicalSupplies(
        service.id
      );
      if (res.status) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thành công"
                description="Xóa vật tư thành công!"
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
                description="Xóa thất bại. Vui lòng kiểm tra lại thông tin."
                status="error"
              />
            );
          },
        });
      }
    } catch (error: any) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Lỗi"
              description={error.response.data.message}
              status="error"
            />
          );
        },
      });
    }
    setIsLoading(false);
    onClose();
    handleReRender();
  };
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
        <AlertDialog.Content borderRadius={20}>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            <Text fontWeight={"bold"} fontSize={16}>
              Xóa vật tư
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text>
              Vật tư "{service.medicineName}" sẽ bị xóa, bạn chắc chắn chứ?
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                backgroundColor="#fff"
                borderColor="secondary.300"
                borderWidth={1}
                onPress={onClose}
                ref={cancelRef}
                _text={{
                  color: "secondary.300",
                }}
                _pressed={{
                  backgroundColor: "secondary.100",
                }}
              >
                Hủy
              </Button>
              <Button _text={{ color: "#fff" }} onPress={handleDelteCategory}>
                Tiếp tục
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default DeleteMedicalSupplyDialog;
