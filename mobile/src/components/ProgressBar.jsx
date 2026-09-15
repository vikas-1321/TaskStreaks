import { Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';

export default function ProgressBar({ taskProgress, completion, taskCount, taskTarget, completionTarget }) {
  const styles = useThemeStyles();
  return (
    <>
      <View style={styles.progressHeader}>
        <Text style={styles.sectionLabel}>TODAY&apos;S PROGRESS</Text>
        <Text style={styles.progressPercent}>{completion}% complete</Text>
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
        <Text style={styles.progressLegendText}>Tasks {taskCount}/{taskTarget}</Text>
        <Text style={styles.progressLegendText}>Done {completion}% / {completionTarget}%</Text>
      </View>
    </>
  );
}
