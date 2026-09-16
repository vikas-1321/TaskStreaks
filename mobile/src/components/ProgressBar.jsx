import { StyleSheet, Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';
import { WashiTape } from './SketchElements';

export default function ProgressBar({ taskProgress, completion, taskCount, taskTarget, completionTarget }) {
  const styles = useThemeStyles();
  const isGoalMet = completion >= completionTarget && taskCount > 0;

  return (
    <View style={localStyles.container}>
      <WashiTape angle={-2} width={50} height={14} style={localStyles.tape} />

      <View style={styles.progressHeader}>
        <View style={localStyles.labelWrap}>
          <Text style={localStyles.star}>★</Text>
          <Text style={styles.sectionLabel}>TODAY&apos;S PROGRESS</Text>
        </View>
        <Text style={[styles.progressPercent, isGoalMet && localStyles.goalMetText]}>
          {completion}% {isGoalMet ? '🎯 Met!' : 'Done'}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={styles.progressHalf}>
          <View style={[styles.progressValue, styles.tasksProgress, { width: `${taskProgress}%` }]} />
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressHalf}>
          <View style={[styles.progressValue, styles.completionProgress, { width: `${completion}%` }]} />
        </View>
      </View>

      <View style={styles.progressLegend}>
        <Text style={styles.progressLegendText}>Tasks: {taskCount}/{taskTarget}</Text>
        <Text style={styles.progressLegendText}>Target: {completionTarget}%</Text>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2b303c',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#222733',
    shadowOffset: { width: 3, height: 3.5 },
    shadowOpacity: 0.85,
    shadowRadius: 0,
    elevation: 3,
    transform: [{ rotate: '-0.4deg' }],
    position: 'relative',
  },
  tape: {
    top: -8,
    left: 20,
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  star: {
    color: '#eab308',
    fontSize: 12,
  },
  goalMetText: {
    color: '#16a34a',
    fontWeight: '900',
  },
});
