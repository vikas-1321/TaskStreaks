import { Pressable, Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';

export default function TaskList({ tasks, onToggle, onDelete }) {
  const styles = useThemeStyles();
  if (tasks.length === 0) {
    return <Text style={styles.empty}>No tasks yet. Tap + to add one.</Text>;
  }

  return tasks.map((task) => (
    <View style={styles.taskRow} key={task.id}>
      <Pressable style={[styles.checkbox, task.completed && styles.checked]} onPress={() => onToggle(task.id)}>
        <Text style={styles.checkmark}>{task.completed ? '✓' : ''}</Text>
      </Pressable>
      <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.taskText, task.completed && styles.completed]}>{task.title}</Text>
      <Pressable onPress={() => onDelete(task.id)}>
        <Text style={styles.delete}>×</Text>
      </Pressable>
    </View>
  ));
}
