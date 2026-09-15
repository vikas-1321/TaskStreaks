import { Pressable, ScrollView, Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';

export default function GoalSelector({ goals, selectedGoalId, onSelect }) {
  const styles = useThemeStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.goalScroller}
      contentContainerStyle={styles.goalList}
    >
      <Pressable style={[styles.goalChip, !selectedGoalId && styles.selectedGoal]} onPress={() => onSelect('')}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.goalText}>Today&apos;s tasks</Text>
      </Pressable>
      {goals.map((goal) => (
        <Pressable key={goal.id} style={[styles.goalChip, selectedGoalId === goal.id && styles.selectedGoal]} onPress={() => onSelect(goal.id)}>
          <View style={[styles.goalDot, { backgroundColor: goal.color }]} />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.goalText}>{goal.title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
