import {
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
  View,
  useToast,
} from "native-base";
import { SubscriptionDashboardScreenProps } from "../../Navigator/SubscriptionNavigator";
import { ClinicSelector, changeRoles, userInfoSelector } from "../../store";
import { appColor } from "../../theme";
import { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast/Toast";
import { clinicService } from "../../services";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { openBrowserAsync } from "expo-web-browser";
import { ClinicInfoDashboardScreenProps } from "../../Navigator/ClinicInfoNavigator";
import { useAppDispatch, useAppSelector } from "../../hooks";
import dayjs from "dayjs";
import { RoleDashboardScreenProps } from "../../Navigator/RoleNavigator";
import { IRole } from "../../types/role.types";
import AddRoleModal from "./AddRoleModal";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
export default function RoleDashboardScreen({
  navigation,
  route,
}: RoleDashboardScreenProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getRoleList = async () => {
    try {
      const response = await clinicService.getUserGroupRole(clinic?.id);
      if (response.status && response.data) {
        setRoleList(response.data);
        dispatch(changeRoles(response.data));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // get a role list here
    getRoleList();
  }, [clinic?.id]);
  return (
    <Box
      bgColor="#fff"
      minWidth="90%"
      maxWidth="90%"
      minH="95%"
      maxH="95%"
      alignSelf="center"
      alignItems="center"
      p={5}
      borderRadius={20}
    >
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
      <Button
        width="full"
        onPress={() => {
          setIsOpenModal(true);
        }}
      >
        Thêm vai trò
      </Button>
      {roleList?.length ? (
        <>
          <Text my="2" fontSize={17} alignSelf="flex-start">
            Danh sách vai trò
          </Text>
          <ScrollView>
            <VStack space={5}>
              {roleList.map((role: IRole, index) => {
                return (
                  <Box
                    borderRadius={20}
                    backgroundColor={appColor.background}
                    key={index}
                    p={3}
                  >
                    <Text color={appColor.textTitle} fontSize={16}>
                      {role.name}
                    </Text>

                    <VStack>
                      {role.rolePermissions.map((permission, index) => {
                        return (
                          <Text color={appColor.textSecondary} key={index}>
                            - {permission.optionName}
                          </Text>
                        );
                      })}
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          </ScrollView>
        </>
      ) : (
        <Text>Danh sách rỗng</Text>
      )}
      <AddRoleModal
        isOpen={isOpenModal}
        isEditMode={isEditMode}
        onClose={() => {
          setIsLoading(true);
          setIsOpenModal(false);
          setIsLoading(false);
        }}
        selectedRole={selectedRole}
        getRoleList={getRoleList}
      />
    </Box>
  );
}
