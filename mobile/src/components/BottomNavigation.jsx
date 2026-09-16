import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';

const tabs = [
  { key: 'home', label: 'Studio', icon: '✏️' },
  { key: 'work', label: 'Routines', icon: '📓' },
  { key: 'goals', label: 'Vision', icon: '🎯' },
];

export default function BottomNavigation({ activeTab, onChange }) {
  const styles = useThemeStyles();

  return (
    <View style={styles.bottomNavShell}>
      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={[
                styles.bottomNavItem,
                isActive && styles.bottomNavItemActive,
              ]}
              onPress={() => onChange(tab.key)}
            >
              <Text
                style={[
                  styles.bottomNavIcon,
                  isActive && styles.bottomNavIconActive,
                ]}
              >
                {tab.icon}
              </Text>
              <Text
                style={[
                  styles.bottomNavLabel,
                  isActive && styles.bottomNavLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
