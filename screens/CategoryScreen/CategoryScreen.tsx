import { Box, HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import { TouchableOpacity } from 'react-native';
import { useEffect, useMemo, useState } from "react";
import { categoryApi } from "../../services";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ClinicSelector } from "../../store";
import { IRole } from "../../types/role.types";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { appColor } from "../../theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ICategory } from "../../types";
import AddCategoryModal from "./AddCategoryModal";
import { CategoryNavigatorProps } from "../../Navigator/UserNavigator";
import { List } from 'react-native-paper';
import UpdateCategoryModal  from './UpdateCategoryModal';
import DeleteDialog from "./DeleteDialog";

export default function StaffDashboardScreen({
  navigation,
  route,
}: CategoryNavigatorProps) {
  const clinic = useAppSelector(ClinicSelector);
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenAddCategoryModal, setIsOpenAddCategoryModal] = useState<boolean>(false);
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState<boolean>(false);
  const [category, setCategory] = useState<ICategory>();
  const [expanded, setExpanded] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isReRender, setIsReRender] = useState(false);

  const handleReRender = () => setIsReRender(!isReRender)
  const onCloseDialog = () => setIsOpenDialog(false);

  const handlePress = () => setExpanded(!expanded);

  const handleSetCategory = async (item: ICategory) => setCategory(item)
  const handleOpenUpdateModal = async (item: ICategory) => {
    await handleSetCategory(item)
    setIsOpenCategoryModal(true)
  }
  const handleDeleteButton = async (item: ICategory) => {
    await handleSetCategory(item)
    setIsOpenDialog(true)
  }
  const getCategoryList = async () => {
    try {
      if (clinic?.id)
      {
        const response = await categoryApi.getCategories(clinic?.id);
        console.log('response: ', response);
        if (response.status && response.data) {
          setCategoryList(response.data)
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategoryList();
  }, [clinic?.id, isReRender]);
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
      {categoryList?.length ? (
        <>
          <HStack
            width="full"
            justifyContent="space-between"
            alignItems="center"
            mt={-3}
          >
            <Text my="2" fontWeight="bold" fontSize={20}>
              Danh mục, phân loại
            </Text>
            <Pressable
              onPress={() => {
                setIsOpenAddCategoryModal(true);
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
            <VStack space={5} w={"100%"}>
                <List.Section style={{width: 310}}>
                    <List.Accordion
                        title="Loại dịch vụ"
                        left={props => <List.Icon {...props} icon="folder" />}>
                        {categoryList.map(item => (
                          <TouchableOpacity
                            onPress={() => handleOpenUpdateModal(item)}>
                            {item.type===1? <List.Item title={item.name} 
                            right={props => 
                              <HStack space={3}>
                                <List.Icon {...props} icon="square-edit-outline" />
                                <TouchableOpacity onPress={() => handleDeleteButton(item)}>
                                  <List.Icon {...props} icon="delete" />
                                </TouchableOpacity>
                              </HStack>
                            }/>
                             : null}
                          </TouchableOpacity>
                          ))}
                    </List.Accordion>
                    <List.Accordion
                        title="Loại thiết bị"
                        left={props => <List.Icon {...props} icon="folder" />}
                        expanded={expanded}
                        onPress={handlePress}
                        style={{ width: '100%' }}> 
                        {categoryList.map(item => (
                        <TouchableOpacity
                          onPress={() => handleOpenUpdateModal(item)}
                        >
                          {item.type===2? <List.Item title={item.name} 
                          right={props => (
                            <HStack space={3}>
                              <List.Icon {...props} icon="square-edit-outline" />
                              <TouchableOpacity onPress={() => handleDeleteButton(item)}>
                                <List.Icon {...props} icon="delete" />
                              </TouchableOpacity>
                            </HStack>
                            )
                            }
                            /> : null}
                        </TouchableOpacity>))}
                    </List.Accordion>
                </List.Section>
            </VStack>
          </ScrollView>
        </>
      ) : (
        <Text>Danh sách rỗng</Text>
      )}
      {category && isOpenCategoryModal ?
        <UpdateCategoryModal
          isOpen={isOpenCategoryModal}
          onClose={() => {
            setIsOpenCategoryModal(false);
          }}
          category={category}
          handleReRender={handleReRender}
        />: null
      }
      {category && isOpenDialog ?
        <DeleteDialog 
        isOpen={isOpenDialog}
        onClose={onCloseDialog}
        category={category}
        handleReRender={handleReRender}
        /> : null
      }
      <AddCategoryModal
        isOpen={isOpenAddCategoryModal}
        onClose={() => {
          setIsOpenAddCategoryModal(false);
        }}
        handleReRender={handleReRender}
      />
    </Box>
  );
}
