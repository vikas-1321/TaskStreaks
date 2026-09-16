import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useThemeIsDark, useThemeStyles } from '../theme/ThemeContext';
import DailyRulesForm from './DailyRulesForm';
import { PushPin, WashiTape } from './SketchElements';

export default function GoalsPanel({
  goals,
  selectedGoalId,
  settings,
  isDark,
  onSelectGoal,
  onAddGoal,
  onSaveRules,
  onToggleTheme,
}) {
  const styles = useThemeStyles();
  const themeIsDark = useThemeIsDark();
  const [draft, setDraft] = useState('');

  const addGoal = () => {
    const title = draft.trim();
    if (!title) return;
    onAddGoal(title);
    setDraft('');
  };

  return (
    <View style={localStyles.container}>
      <View style={styles.sectionHeader}>
        <View style={localStyles.titleWrap}>
          <Text style={localStyles.icon}>🎯</Text>
          <Text style={styles.sectionTitle}>Long-Term Goals</Text>
        </View>
        <Text style={styles.muted}>{goals.length} pinned</Text>
      </View>

      {/* Corkboard Goal Cards */}
      <View style={[styles.card, localStyles.goalCard]}>
        <PushPin color="#ef4444" />
        {goals.map((goal) => {
          const isSelected = selectedGoalId === goal.id;

          return (
            <Pressable
              key={goal.id}
              style={[
                styles.goalRow,
                isSelected && styles.selectedGoal,
                localStyles.goalItem,
              ]}
              onPress={() => onSelectGoal(goal.id)}
            >
              <View style={[styles.goalDot, { backgroundColor: goal.color }]} />
              <Text style={styles.goalText}>{goal.title}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          );
        })}

        <View style={styles.addWorkRow}>
          <TextInput
            style={styles.inlineInput}
            placeholder="✏️ New long-term goal..."
            placeholderTextColor={themeIsDark ? '#facc15' : '#9ca3af'}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={addGoal}
            returnKeyType="done"
          />
          <Pressable style={styles.smallButton} onPress={addGoal}>
            <Text style={styles.smallButtonText}>Pin Goal</Text>
          </Pressable>
        </View>
      </View>

      {/* Dark Theme Switch */}
      <View style={styles.themeToggleRow}>
        <View style={styles.themeToggleText}>
          <Text style={styles.sectionTitle}>🌙 Night Sketch Mode</Text>
          <Text style={styles.muted}>Use dark chalkboard theme</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={onToggleTheme}
          trackColor={{ false: '#cbd5e1', true: '#60a5fa' }}
          thumbColor={isDark ? '#2563eb' : '#f8fafc'}
        />
      </View>

      {/* Streak Rules & Manifesto */}
      <View style={styles.sectionHeader}>
        <View style={localStyles.titleWrap}>
          <Text style={localStyles.icon}>📝</Text>
          <Text style={styles.sectionTitle}>Streak Rules &amp; Manifesto</Text>
        </View>
      </View>

      <View style={[styles.card, localStyles.rulesCard]}>
        <WashiTape angle={2} width={65} height={16} style={localStyles.rulesTape} />
        <DailyRulesForm settings={settings} onSave={onSaveRules} />

        <View style={localStyles.manifestoBox}>
          <Text style={localStyles.manifestoTitle}>⚡ Habit Manifesto</Text>
          <Text style={localStyles.manifestoItem}>
            ✓ Maintain at least {settings?.dailyTaskTarget || 3} tasks logged each day.
          </Text>
          <Text style={localStyles.manifestoItem}>
            ✓ Hit {settings?.completionPercentage || 75}% completion rate to keep your streak flame burning.
          </Text>
          <Text style={localStyles.manifestoItem}>
            ✓ Drawing one line every single day creates your masterpiece.
          </Text>
        </View>
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
  icon: {
    fontSize: 18,
  },
  goalCard: {
    position: 'relative',
    paddingTop: 18,
  },
  goalItem: {
    marginVertical: 2,
  },
  rulesCard: {
    position: 'relative',
  },
  rulesTape: {
    top: -8,
    right: 20,
  },
  manifestoBox: {
    marginTop: 16,
    backgroundColor: '#fefce8',
    borderWidth: 1.5,
    borderColor: '#ca8a04',
    borderRadius: 10,
    borderStyle: 'dashed',
    padding: 12,
  },
  manifestoTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#713f12',
    marginBottom: 6,
  },
  manifestoItem: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#854d0e',
    marginVertical: 2,
  },
});
