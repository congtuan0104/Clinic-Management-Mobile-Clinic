import { List } from 'react-native-paper';
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
    Image
  } from "native-base";
  import { ClinicSelector, changeRoles } from "../../store";
  import { StyleSheet } from "react-native";
  import { useEffect, useState } from "react";
  import ToastAlert from "../../components/Toast/Toast";
  import { useAppSelector } from "../../hooks";
  import * as yup from "yup";
  import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
  import { appColor } from "../../theme";
  import {IMedicalService, } from "../../types";

  const chevronDown = require("../../assets/chevron_down.png");
  
  interface IProps {
    isOpen: boolean;
    onClose: () => void;
    medicalServiceList: IMedicalService[];
  }
  
  // Validate
  
  
  export default function ClinicServiceModal({
    isOpen,
    onClose,
    medicalServiceList
  }: IProps) {
    const toast = useToast();
    const clinic = useAppSelector(ClinicSelector);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [expanded, setExpanded] = useState(true);
    const handlePress = () => setExpanded(!expanded);

    return (
      <Modal isOpen={isOpen} onClose={onClose} >
        <LoadingSpinner showLoading={isLoading} setShowLoading={setIsLoading} />
        <Modal.Content width="90%">
          <Modal.CloseButton />
          <Modal.Header><Text fontWeight={"bold"}>Chỉ định dịch vụ</Text></Modal.Header>
          <Modal.Body>
            <Box>
              <ScrollView minWidth="100%" maxWidth="100%">
                <VStack space={5}>
                    <List.Section style={{width: 310}}>
                        {medicalServiceList.map(medical => (
                            <List.Accordion
                                key={medical.id}
                                title={ medical.serviceName}
                                left={props => <List.Icon {...props} icon="medical-bag" />}
                                expanded={expanded}
                                onPress={handlePress}
                            >
                            {
                                <VStack>
                                    <HStack space={5}>
                                        <Text>Bác sĩ thực hiện</Text>
                                        <Text>{medical.doctorName}</Text>
                                    </HStack>
                                    <HStack space={5}>
                                        <Text>Kết quả</Text>
                                        <Text>{medical?.serviceResult}</Text>
                                    </HStack>
                                    
                                </VStack>
                            }
                            </List.Accordion>
                        ))
                        }
                        
                    </List.Section>
                </VStack>
              </ScrollView>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                bg="grey" 
                onPress={() => {
                  onClose();
                }}
              >
                Quay lại
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
    dropdown1DropdownStyle: { backgroundColor: "#EFEFEF", marginTop: -70, borderRadius: 15 },
    dropdown1RowStyle: {
      backgroundColor: "#EFEFEF",
      borderBottomColor: "#C5C5C5",
    },
    dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  });