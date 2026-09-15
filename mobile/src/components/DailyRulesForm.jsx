import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import { useThemeIsDark, useThemeStyles } from '../theme/ThemeContext';

export default function DailyRulesForm({ settings, onSave }) {
  const styles = useThemeStyles();
  const isDark = useThemeIsDark();
  const [dailyTarget, setDailyTarget] = useState(String(settings.dailyTaskTarget));
  const [completionTarget, setCompletionTarget] = useState(String(settings.completionPercentage));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDailyTarget(String(settings.dailyTaskTarget));
    setCompletionTarget(String(settings.completionPercentage));
  }, [settings]);

  const save = () => {
    const nextSettings = {
      dailyTaskTarget: Math.max(1, Math.min(20, Number(dailyTarget) || 1)),
      completionPercentage: Math.max(10, Math.min(100, Number(completionTarget) || 75)),
    };
    onSave(nextSettings);
    setDailyTarget(String(nextSettings.dailyTaskTarget));
    setCompletionTarget(String(nextSettings.completionPercentage));
    setSaved(true);
  };

  return (
    <>
      <Text style={styles.ruleLabel}>Tasks to add each day</Text>
      <TextInput
        style={styles.rulesInput}
        placeholderTextColor={isDark ? '#facc15' : '#9ca3af'}
        keyboardType="number-pad"
        value={dailyTarget}
        onChangeText={(value) => { setDailyTarget(value); setSaved(false); }}
        onSubmitEditing={save}
        returnKeyType="done"
      />
      <Text style={styles.ruleLabel}>Completion target (%)</Text>
      <TextInput
        style={styles.rulesInput}
        placeholderTextColor={isDark ? '#facc15' : '#9ca3af'}
        keyboardType="number-pad"
        value={completionTarget}
        onChangeText={(value) => { setCompletionTarget(value); setSaved(false); }}
        onSubmitEditing={save}
        returnKeyType="done"
      />
      <Pressable style={[styles.primaryButton, styles.rulesButton]} onPress={save} accessibilityRole="button">
        <Text style={styles.primaryButtonText}>{saved ? 'Saved' : 'Save rules'}</Text>
      </Pressable>
      {saved && <Text style={styles.savedMessage}>Daily rules updated</Text>}
    </>
  );
}
