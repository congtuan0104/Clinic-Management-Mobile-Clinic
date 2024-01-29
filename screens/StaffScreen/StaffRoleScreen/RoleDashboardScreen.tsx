import {
  Avatar,
  Box,
  Button,
  HStack,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import { ClinicSelector, changeRoles, userInfoSelector } from "../../../store";
import { appColor } from "../../../theme";
import { useEffect, useState } from "react";
import { clinicService } from "../../../services";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RoleDashboardScreenProps } from "../../../Navigator/RoleNavigator";
import { IRole } from "../../../types/role.types";
import AddRoleModal from "./AddRoleModal";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DeleteRoleModal from "./DeleteRoleModal";
export default function RoleDashboardScreen({
  navigation,
  route,
}: RoleDashboardScreenProps) {
  const toast = useToast();
  const clinic = useAppSelector(ClinicSelector);
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
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
      mt="5%"
    >
      <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />

      {roleList?.length ? (
        <>
          <HStack
            width="full"
            justifyContent="space-between"
            alignItems="center"
            mt={-3}
          >
            <Text my="2" fontSize={20} fontWeight="bold" flex-start>
              Danh sách vai trò
            </Text>
            <Pressable
              onPress={() => {
                setIsOpenModal(true);
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={25}
                color={appColor.primary}
              />
            </Pressable>
          </HStack>
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
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text
                        fontWeight="bold"
                        color={appColor.textTitle}
                        fontSize={16}
                      >
                        {role.name}
                      </Text>
                      {role.name !== "Admin" && (
                        <HStack space={2} alignItems="center">
                          <Pressable
                            onPress={() => {
                              setSelectedRole(role);
                              setIsOpenModal(true);
                              setIsEditMode(true);
                            }}
                          >
                            <FontAwesome5
                              name="edit"
                              size={18}
                              color={appColor.primary}
                            />
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              setSelectedRole(role);
                              setIsOpenDeleteModal(true);
                            }}
                          >
                            <MaterialIcons
                              name="delete"
                              size={24}
                              color={appColor.primary}
                            />
                          </Pressable>
                        </HStack>
                      )}
                    </HStack>

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
        <Text>Đang tải, vui lòng đợi...</Text>
      )}
      <AddRoleModal
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
        }}
        getRoleList={getRoleList}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        selectedRole={selectedRole}
      />
      <DeleteRoleModal
        isOpen={isOpenDeleteModal}
        onClose={() => {
          setIsOpenDeleteModal(false);
        }}
        selectedRole={selectedRole}
        getRoleList={getRoleList}
      />
    </Box>
  );
}
