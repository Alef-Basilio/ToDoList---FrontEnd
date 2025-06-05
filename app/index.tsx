import { useEffect, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox } from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TaskType = {
  id: number;
  title: string;
  isDone: boolean;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [taskText, settaskText] = useState<string>('');

  useEffect(() => {
    const getTasks = async () => {
      try {
        const tasks = await AsyncStorage.getItem('my-task');
        if (tasks !== null) {
          setTasks(JSON.parse(tasks));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTasks();
  }, []);

  const addTask = async () => {
    try {
      const newTask = {
        id: Math.random(),
        title: taskText,
        isDone: false,
      };
      tasks.push(newTask);
      setTasks(tasks);
      await AsyncStorage.setItem('my-task', JSON.stringify(tasks));
      settaskText('');
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const newTasks = tasks.filter((task) => task.id !== id);
      await AsyncStorage.setItem('my-task', JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDone = async (id: number) => {
    try {
      const newTasks = tasks.map((task) => {
        if (task.id === id) {
          task.isDone = !task.isDone;
        }
        return task;
      });
      await AsyncStorage.setItem('my-task', JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={[...tasks]} style={styles.flatList} keyExtractor={(item) =>
        item.id.toString()} renderItem={({item}) => (
          <TaskItem task={item} deleteTask={deleteTask} handleDone={handleDone}/>
        )}
      />
      <KeyboardAvoidingView style={styles.footer} behavior='padding' keyboardVerticalOffset={10}>
        <TextInput placeholder='Adicionar nova anotação' value={taskText} onChangeText={(text) => settaskText(text)}
          style={styles.newTaskInput} autoCorrect={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addTask()}>
          <Text style={styles.addText}>A</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const TaskItem = ({
  task, deleteTask, handleDone,
}: {
  task: TaskType;
  deleteTask: (id: number) => void;
  handleDone: (id: number) => void;
}) => (
  <View style={styles.taskContainer}>
    <View style={styles.taskInfoContainer}>
      <Checkbox
        value={task.isDone} onValueChange={() => handleDone(task.id)} color={task.isDone ? '#25cc00' : undefined}
        style={[styles.checkbox]}
      />
      <Text style={[styles.taskText, task.isDone && {textDecorationLine: 'line-through'}]}>
        {task.title}
      </Text>
    </View>
    <TouchableOpacity onPress={() => {
      deleteTask(task.id);
      alert('Excluido! ' + task.id);
      }}>
      <Text style={styles.deleteText}>E</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#D7FFD7',
    fontFamily: 'Inter_400Regular, Arial, sans-serif',
  },
  flatList: {
    marginTop: 15,
    marginBottom: 40,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 2,
    marginTop: 12,
  },
  taskInfoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#333',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    width: '79%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: 20,
  },
  newTaskInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 50,
    paddingLeft: 20,
    borderRadius: 2,
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDFF7A',
    height: 50,
    width: 40,
    borderRadius: 2,
    borderWidth: 1,
    borderLeftWidth: 0,
  },
  addText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#333',
    fontSize: 24,
  },
  deleteText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: '#FF0000',
    color: '#FF0000',
    fontSize: 24,
    height: 35,
    width: 35,
    borderRadius: 2,
    borderWidth: 3,
  },
});
