import { View, Text } from "react-native";
import React from "react";
import { Button, FormControl, Input, Modal } from "native-base";
import { Entypo } from "@expo/vector-icons";
const UploadImageModal = (props: any) => {
  const { showModal, setShowModal, onPressCamera, onPressUploadImageGallery } =
    props;
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content borderRadius={20}>
        <Modal.CloseButton />
        <Modal.Header backgroundColor="secondary.200">Chọn ảnh</Modal.Header>
        <Modal.Body>
          <Button.Group space={10} justifyContent="center">
            <Button onPress={onPressCamera} borderRadius={100} p={3}>
              <Entypo name="camera" size={30} color="#fff" />
            </Button>
            <Button
              onPress={onPressUploadImageGallery}
              borderRadius={100}
              p={3}
            >
              <Entypo name="images" size={30} color="#fff" />
            </Button>
          </Button.Group>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default UploadImageModal;
