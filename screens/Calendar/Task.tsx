import React, { ReactNode } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';

interface TaskProps {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  children: ReactNode;
}

interface Styles {
  cardMain: ViewStyle;
  card: ViewStyle;
  container: ViewStyle;
  btnContainer: ViewStyle;
  textContainer: ViewStyle;
}

const dynamicBtnContainer = ({ pressed }: { pressed: boolean }): ViewStyle => ({
  position: 'absolute',
  alignSelf: 'center',
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: '#FFFFFF',
  height: 44,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  opacity: pressed ? 0.5 : 1,
});

const styles = StyleSheet.create<Styles>({
  cardMain: {
    position: 'absolute',
    top: 100,
    width: 327,
    alignSelf: 'center',
    zIndex: 1000,
    elevation: 1000,
    paddingBottom: 54,
  },
  card: {
    width: 327,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  btnContainer: dynamicBtnContainer as ViewStyle,
  textContainer: { textAlign: 'center', fontSize: 17, fontWeight: '500' },
});

export default class Task extends React.Component<TaskProps> {
  render() {
    const { isModalVisible, children, setModalVisible } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            styles.container,
            {
              ...Platform.select({
                android: {
                  // paddingTop: shouldMove ? 240 : null,
                },
              }),
            },
          ]}
        >
          <View style={styles.cardMain}>
            <View style={styles.card}>{children}</View>
            <Pressable
              style={styles.btnContainer}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textContainer}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }
}
