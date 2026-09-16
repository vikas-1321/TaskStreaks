import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';
import { getCurrentStreak, getBestStreak, getLast7Days, getDayStatus } from '../utils/streakUtils';
import GoalSelector from './GoalSelector';
import ProgressBar from './ProgressBar';
import { MobileTrendChart, WashiTape } from './SketchElements';
import Stat from './Stat';
import TaskList from './TaskList';

export default function HomeScreen({
  progress,
  goals,
  selectedGoalId,
  visibleTasks,
  allTasks = [],
  settings = {},
  onSelectGoal,
  onToggleTask,
  onDeleteTask,
}) {
  const styles = useThemeStyles();
  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);

  // Compute streaks and trend chart data
  const currentStreak = useMemo(() => getCurrentStreak(allTasks, settings), [allTasks, settings]);
  const bestStreak = useMemo(() => getBestStreak(allTasks, settings), [allTasks, settings]);
  const last7Days = useMemo(() => getLast7Days(allTasks), [allTasks]);
  const dayStatus = useMemo(
    () => getDayStatus(progress.todayTasks, settings),
    [progress.todayTasks, settings],
  );

  return (
    <View style={localStyles.container}>
      {/* 4 Illustrated Statistics Panels */}
      <View style={styles.statsRow}>
        <Stat
          label="Current"
          value={`${currentStreak}`}
          sub={currentStreak === 1 ? '1 day' : 'days streak'}
          icon="🔥"
          variant="orange"
        />
        <Stat
          label="Best"
          value={`${bestStreak}`}
          sub="record"
          icon="🏆"
          variant="yellow"
        />
        <Stat
          label="Today"
          value={`${progress.completedToday}/${progress.todayTasks.length}`}
          sub="tasks done"
          icon="✏️"
          variant="blue"
        />
        <Stat
          label="Status"
          value={dayStatus.passes ? 'On Track' : 'Active'}
          sub={`${dayStatus.completionRate}%`}
          icon="🎯"
          variant="green"
        />
      </View>

      {/* Daily Progress Gauge */}
      <ProgressBar
        taskProgress={progress.taskTargetProgress}
        completion={progress.completion}
        taskCount={progress.todayTasks.length}
        taskTarget={progress.dailyTaskTarget}
        completionTarget={progress.completionTarget}
      />

      {/* 7-Day Consistency Curve */}
      <MobileTrendChart last7Days={last7Days} targetPercent={progress.completionTarget} />

      {/* Section Header & Goal Pills */}
      <View style={styles.sectionHeader}>
        <View style={localStyles.titleWrap}>
          <Text style={localStyles.notebookIcon}>📓</Text>
          <Text style={styles.sectionTitle}>
            {selectedGoal ? selectedGoal.title : "Today's tasks"}
          </Text>
        </View>
        <Text style={styles.muted}>{visibleTasks.length} items</Text>
      </View>

      <GoalSelector goals={goals} selectedGoalId={selectedGoalId} onSelect={onSelectGoal} />

      {/* Task List in Ruled Index Card */}
      <View style={[styles.card, localStyles.taskCard]}>
        <WashiTape angle={1.5} width={60} height={16} style={localStyles.taskCardTape} />
        <TaskList tasks={visibleTasks} onToggle={onToggleTask} onDelete={onDeleteTask} />
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notebookIcon: {
    fontSize: 16,
  },
  taskCard: {
    position: 'relative',
    marginTop: 4,
  },
  taskCardTape: {
    top: -9,
    right: 24,
  },
});
