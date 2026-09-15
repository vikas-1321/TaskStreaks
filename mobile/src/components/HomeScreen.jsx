import { Text, View } from 'react-native';
import GoalSelector from './GoalSelector';
import ProgressBar from './ProgressBar';
import Stat from './Stat';
import TaskList from './TaskList';
import { useThemeStyles } from '../theme/ThemeContext';

export default function HomeScreen({ progress, goals, selectedGoalId, visibleTasks, onSelectGoal, onToggleTask, onDeleteTask }) {
  const styles = useThemeStyles();
  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);

  return (
    <>
      <ProgressBar
        taskProgress={progress.taskTargetProgress}
        completion={progress.completion}
        taskCount={progress.todayTasks.length}
        taskTarget={progress.dailyTaskTarget}
        completionTarget={progress.completionTarget}
      />
      <View style={styles.statsRow}>
        <Stat label="Today" value={`${progress.completedToday}/${progress.todayTasks.length}`} />
        <Stat label="Target" value={`${progress.dailyTaskTarget}`} />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{selectedGoal ? selectedGoal.title : "Today's tasks"}</Text>
        <Text style={styles.muted}>{visibleTasks.length} items</Text>
      </View>
      <GoalSelector goals={goals} selectedGoalId={selectedGoalId} onSelect={onSelectGoal} />
      <View style={styles.card}>
        <TaskList tasks={visibleTasks} onToggle={onToggleTask} onDelete={onDeleteTask} />
      </View>
    </>
  );
}
