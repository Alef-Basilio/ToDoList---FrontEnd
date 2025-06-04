import { FlatList, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TaskType = {
  id: number;
  title: string;
  isDone: boolean;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [taskText, settaskText] = useState<string>("");

  useEffect(() => {
    const getTasks = async () => {
      try {
        const tasks = await AsyncStorage.getItem("my-task");
        if (tasks !== null) {
          setTasks(JSON.parse(tasks));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTasks();
  }, []);

  const addtask = async () => {
    try {
      const newtask = {
        id: Math.random(),
        title: taskText,
        isDone: false,
      };
      tasks.push(newtask);
      setTasks(tasks);
      await AsyncStorage.setItem("my-task", JSON.stringify(tasks));
      settaskText("");
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const newTasks = tasks.filter((task) => task.id !== id);
      await AsyncStorage.setItem("my-task", JSON.stringify(newTasks));
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
      await AsyncStorage.setItem("my-task", JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[...tasks].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            deleteTask={deleteTask}
            handleDone={handleDone}
          />
        )}
      />
      <KeyboardAvoidingView
        style={styles.footer}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <TextInput
          placeholder="Adicionar nova tarefa"
          value={taskText}
          onChangeText={(text) => settaskText(text)}
          style={styles.newtaskInput}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addtask()}>
          <Text style={{ fontSize: 24, color: 'black' }}>A</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const TaskItem = ({
  task,
  deleteTask,
  handleDone,
}: {
  task: TaskType;
  deleteTask: (id: number) => void;
  handleDone: (id: number) => void;
}) => (
  <View style={styles.taskContainer}>
    <View style={styles.taskInfoContainer}>
      <Checkbox
        value={task.isDone}
        onValueChange={() => handleDone(task.id)}
        color={task.isDone ? "#25cc00" : undefined}
      />
      <Text
        style={[
          styles.taskText,
          task.isDone && { textDecorationLine: "line-through" },
        ]}
      >
        {task.title}
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => {
        deleteTask(task.id);
        alert("Deleted " + task.id);
      }}
    >
      <Text style={{ fontSize: 24, color: 'red' }}>E</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#BABABA",
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  taskInfoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  taskText: {
    fontSize: 16,
    color: "#333",
    width: "80%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    bottom: 20,
  },
  newtaskInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#FBFF00",
    padding: 8,
    borderRadius: 10,
    marginLeft: 20,
  },
});