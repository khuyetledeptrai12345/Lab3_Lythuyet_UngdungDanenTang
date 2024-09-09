import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useWindowDimensions } from 'react-native';

const App = () => {
  const [enteredGoal, setEnteredGoal] = useState('');
  const [courseGoals, setCourseGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);

  // Sử dụng useWindowDimensions để lấy chiều rộng, chiều cao màn hình
  const { width, height } = useWindowDimensions();

  // Cập nhật trạng thái orientation (dọc/ngang)
  useEffect(() => {
    const updateLayout = () => {
      setIsPortrait(height > width);
    };

    // Add event listener for dimension changes
    const subscription = Dimensions.addEventListener('change', updateLayout);

    // Initial check
    updateLayout();

    // Cleanup the event listener
    return () => {
      subscription?.remove();
    };
  }, [height, width]);

  const goalInputHandler = (enteredText) => {
    setEnteredGoal(enteredText);
  };

  const addGoalHandler = () => {
    setCourseGoals((currentGoals) => [
      ...currentGoals,
      { id: Math.random().toString(), value: enteredGoal },
    ]);
    setEnteredGoal('');
    setModalVisible(false);
  };

  const removeGoalHandler = (goalId) => {
    setCourseGoals((currentGoals) => {
      return currentGoals.filter((goal) => goal.id !== goalId);
    });
  };

  const imageWidth = width * 0.8;
  const buttonWidth = isPortrait ? width / 2 - 20 : width / 3 - 20;  // Thay đổi kích thước của nút trong chế độ ngang

  return (
    <>
      <StatusBar
        barStyle={isPortrait ? 'dark-content' : 'light-content'}
        backgroundColor={isPortrait ? '#f0f0f0' : '#333'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.screen}>
          <View style={styles.centeredContainer}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>Thêm Mới</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={modalVisible} animationType="slide">
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nhập vào phần textinput"
                style={styles.input}
                onChangeText={goalInputHandler}
                value={enteredGoal}
              />
              <View style={[
                styles.buttonContainer, 
                { flexDirection: isPortrait ? 'column' : 'row' } // Đổi hướng layout của các nút khi ở chế độ ngang
              ]}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, { width: buttonWidth }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.addButton, { width: buttonWidth }]}
                  onPress={addGoalHandler}
                >
                  <Text style={styles.buttonText}>Thêm</Text>
                </TouchableOpacity>
              </View>

              <Image
                source={{
                  uri: 'https://didongviet.vn/dchannel/wp-content/uploads/2022/10/demo-la-gi-3-didongviet.jpg',
                }}
                style={{
                  width: imageWidth,
                  height: isPortrait ? imageWidth * 0.75 : imageWidth * 0.5, // Thay đổi chiều cao tùy thuộc vào orientation
                  marginTop: 20,
                }}
              />
            </View>
          </Modal>

          <FlatList
            keyExtractor={(item) => item.id}
            data={courseGoals}
            renderItem={(itemData) => (
              <View style={styles.listItem}>
                <Text>{itemData.item.value}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeGoalHandler(itemData.item.id)}
                >
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 50,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#5a67d8',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,  // Thêm padding ngang để tránh các nút dính vào cạnh
  },
  button: {
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    ...Platform.select({
      ios: {
        padding: 20,
      },
      android: {
        padding: 10,
      },
    }),
  },
  cancelButton: {
    backgroundColor: '#e53e3e',
  },
  addButton: {
    backgroundColor: '#5a67d8',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#ccc',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#e53e3e',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
