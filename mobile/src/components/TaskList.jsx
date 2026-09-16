import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';
import { getTaskDaysActive } from '../utils/streakUtils';

export default function TaskList({ tasks, onToggle, onDelete }) {
  const styles = useThemeStyles();

  if (tasks.length === 0) {
    return (
      <View style={localStyles.emptyWrap}>
        <Text style={localStyles.emptyDoodle}>📝</Text>
        <Text style={localStyles.emptyTitle}>Blank Sketchbook Page</Text>
        <Text style={styles.empty}>No tasks yet today. Tap ✏️ below to begin your streak!</Text>
      </View>
    );
  }

  return tasks.map((task, index) => {
    // Alternating slight tilt for hand-drawn index card feel
    const tilt = index % 2 === 0 ? '-0.3deg' : '0.3deg';
    const isGoalTask = Boolean(task.goalId);
    const daysActive = getTaskDaysActive(task);

    return (
      <View
        style={[
          styles.taskRow,
          localStyles.taskItem,
          task.completed && localStyles.completedRow,
          { transform: [{ rotate: tilt }] },
        ]}
        key={task.id}
      >
        <Pressable
          style={[styles.checkbox, task.completed && styles.checked]}
          onPress={() => onToggle(task.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
        >
          <Text style={styles.checkmark}>{task.completed ? '✓' : ''}</Text>
        </Pressable>

        <View style={localStyles.taskBody}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.taskText, task.completed && styles.completed]}
          >
            {task.title}
          </Text>

          <View style={localStyles.badgeRow}>
            {isGoalTask ? (
              <View style={localStyles.goalBadge}>
                <Text style={localStyles.goalBadgeText}>
                  ⏳ Long-term • Day {daysActive}
                </Text>
              </View>
            ) : (
              <View style={localStyles.dailyBadge}>
                <Text style={localStyles.dailyBadgeText}>
                  ⏱️ 1-day task
                </Text>
              </View>
            )}
          </View>
        </View>

        <Pressable
          style={localStyles.deleteBtn}
          onPress={() => onDelete(task.id)}
          accessibilityRole="button"
          accessibilityLabel={`Delete task ${task.title}`}
        >
          <Text style={styles.delete}>×</Text>
        </Pressable>
      </View>
    );
  });
}

const localStyles = StyleSheet.create({
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  emptyDoodle: {
    fontSize: 32,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#222733',
    marginBottom: 4,
  },
  taskItem: {
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  completedRow: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  taskBody: {
    flex: 1,
    minWidth: 0,
    paddingRight: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  goalBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1.2,
    borderColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  goalBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  dailyBadge: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  dailyBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748b',
  },
  deleteBtn: {
    padding: 4,
    marginTop: 2,
  },
});
