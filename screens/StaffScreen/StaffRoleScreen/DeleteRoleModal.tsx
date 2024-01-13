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
  Text,
  VStack,
  View,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import { ClinicSelector, changeRoles } from "../../../store";
import { useEffect, useState } from "react";
import ToastAlert from "../../../components/Toast/Toast";
import { clinicService } from "../../../services";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { IRole, IRoleCreate, IRolePermission } from "../../../types/role.types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { planService } from "../../../services/plan.services";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: IRole | null;
  getRoleList: () => void;
}
export default function DeleteRoleModal({
  isOpen,
  onClose,
  selectedRole,
  getRoleList,
}: IProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteUserGroupRole = async () => {
    setIsLoading(true);
    try {
      const response = await clinicService.deleteUserGroupRole(
        clinic?.id,
        selectedRole?.id
      );
      if (response.status) {
        toast.show({
          render: () => {
            return (
              <ToastAlert
                title="Thành công"
                description="Xóa vai trò thành công!"
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
                title="Thất bại!"
                description="Xóa vai trò thất bại!"
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
              title="Thất bại!"
              description="Xóa vai trò thất bại!"
              status="error"
            />
          );
        },
      });
    }
    setIsLoading(false);
    getRoleList();
    onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Modal.Content width="90%">
        <Modal.CloseButton />
        <Modal.Header>
          <Text>Xóa vai trò</Text>
        </Modal.Header>
        <Modal.Body>
          <Box>
            <Text>Bạn muốn xóa vai trò {selectedRole?.name}?</Text>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              onPress={() => {
                onClose();
              }}
            >
              Hủy
            </Button>
            <Button onPress={handleDeleteUserGroupRole}>Xóa</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
