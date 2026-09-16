import { Text, View, StyleSheet } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';

export default function Stat({ label, value, sub, icon = '★', variant = 'orange', style }) {
  const styles = useThemeStyles();

  const variantStyles = {
    orange: styles.statOrange,
    yellow: styles.statYellow,
    blue: styles.statBlue,
    green: styles.statGreen,
  };

  return (
    <View style={[styles.stat, variantStyles[variant], style]}>
      <View style={localStyles.header}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={localStyles.icon}>{icon}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {Boolean(sub) && <Text style={localStyles.sub}>{sub}</Text>}
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
  },
  sub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8d95a5',
    marginTop: 2,
  },
});
