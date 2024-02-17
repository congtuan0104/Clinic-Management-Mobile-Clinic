import { Center, AlertDialog, Button, Text, useToast } from "native-base";
import React from "react";
import { IClinicService } from "../../types";
import { clinicServiceApi } from "../../services";
import ToastAlert from "../../components/Toast/Toast";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  service: IClinicService;
  handleReRender: () => void;
}
const DeleteDialog = ({ isOpen, onClose, service, handleReRender }: IProps) => {
  const cancelRef = React.useRef(null);
  const toast = useToast();

  const handleDelteCategory = async () => {
    const res = await clinicServiceApi.deleteClinicService(`${service.id}`);
    if (res.status) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              title="Thành công"
              description="Xóa dịch vụ thành công!"
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
              description="Xóa thất bại. Vui lòng kiểm tra lại thông tin."
              status="error"
            />
          );
        },
      });
    }
  };
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content borderRadius={20}>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            <Text fontWeight={"bold"} fontSize={16}>
              Xóa dịch vụ
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text>
              Dịch vụ "{service.serviceName}" của bạn sẽ bị xóa, bạn chắc chắn
              chứ?
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                ref={cancelRef}
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
                Hủy
              </Button>
              <Button onPress={handleDelteCategory}>Tiếp tục</Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default DeleteDialog;
