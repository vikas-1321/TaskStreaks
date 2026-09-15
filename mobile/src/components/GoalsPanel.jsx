import { useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { useThemeIsDark, useThemeStyles } from '../theme/ThemeContext';
import DailyRulesForm from './DailyRulesForm';

export default function GoalsPanel({ goals, selectedGoalId, settings, isDark, onSelectGoal, onAddGoal, onSaveRules, onToggleTheme }) {
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
    <>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Long-term goals</Text></View>
      <View style={styles.card}>
        {goals.map((goal) => (
          <Pressable key={goal.id} style={[styles.goalRow, selectedGoalId === goal.id && styles.selectedGoal]} onPress={() => onSelectGoal(goal.id)}>
            <View style={[styles.goalDot, { backgroundColor: goal.color }]} />
            <Text style={styles.goalText}>{goal.title}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
        <View style={styles.addWorkRow}>
          <TextInput style={styles.inlineInput} placeholder="New long-term goal" placeholderTextColor={themeIsDark ? '#facc15' : '#9ca3af'} value={draft} onChangeText={setDraft} onSubmitEditing={addGoal} returnKeyType="done" />
          <Pressable style={styles.smallButton} onPress={addGoal}><Text style={styles.smallButtonText}>Add</Text></Pressable>
        </View>
      </View>
      <View style={styles.themeToggleRow}>
        <View style={styles.themeToggleText}>
          <Text style={styles.sectionTitle}>Dark mode</Text>
          <Text style={styles.muted}>Use a darker theme at night</Text>
        </View>
        <Switch value={isDark} onValueChange={onToggleTheme} trackColor={{ false: '#cbd5e1', true: '#60a5fa' }} thumbColor={isDark ? '#2563eb' : '#f8fafc'} />
      </View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Daily rules</Text></View>
      <View style={styles.card}>
        <DailyRulesForm settings={settings} onSave={onSaveRules} />
      </View>
    </>
  );
}
