import { Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';

export default function Stat({ label, value }) {
  const styles = useThemeStyles();
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}
