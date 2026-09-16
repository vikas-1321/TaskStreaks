import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useThemeIsDark, useThemeStyles } from '../theme/ThemeContext';

export default function DailyRulesForm({ settings, onSave }) {
  const styles = useThemeStyles();
  const isDark = useThemeIsDark();
  const [dailyTarget, setDailyTarget] = useState(String(settings.dailyTaskTarget || 3));
  const [completionTarget, setCompletionTarget] = useState(String(settings.completionPercentage || 75));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDailyTarget(String(settings.dailyTaskTarget || 3));
    setCompletionTarget(String(settings.completionPercentage || 75));
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

  const adjustTarget = (delta) => {
    const next = Math.max(1, Math.min(20, (Number(dailyTarget) || 1) + delta));
    setDailyTarget(String(next));
    setSaved(false);
  };

  return (
    <View style={localStyles.container}>
      <Text style={styles.ruleLabel}>Daily Target (minimum tasks)</Text>
      <View style={localStyles.stepperRow}>
        <Pressable
          style={localStyles.stepBtn}
          onPress={() => adjustTarget(-1)}
          accessibilityLabel="Decrease target"
        >
          <Text style={localStyles.stepBtnText}>-</Text>
        </Pressable>
        <TextInput
          style={[styles.rulesInput, localStyles.stepperInput]}
          placeholderTextColor={isDark ? '#facc15' : '#9ca3af'}
          keyboardType="number-pad"
          value={dailyTarget}
          onChangeText={(value) => {
            setDailyTarget(value);
            setSaved(false);
          }}
          onSubmitEditing={save}
          returnKeyType="done"
        />
        <Pressable
          style={localStyles.stepBtn}
          onPress={() => adjustTarget(1)}
          accessibilityLabel="Increase target"
        >
          <Text style={localStyles.stepBtnText}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.ruleLabel}>Pass Threshold (% completion)</Text>
      <TextInput
        style={styles.rulesInput}
        placeholderTextColor={isDark ? '#facc15' : '#9ca3af'}
        keyboardType="number-pad"
        value={completionTarget}
        onChangeText={(value) => {
          setCompletionTarget(value);
          setSaved(false);
        }}
        onSubmitEditing={save}
        returnKeyType="done"
      />

      <Pressable
        style={[styles.primaryButton, styles.rulesButton]}
        onPress={save}
        accessibilityRole="button"
      >
        <Text style={styles.primaryButtonText}>{saved ? '✓ Saved!' : 'Pin Rules'}</Text>
      </Pressable>
      {saved && <Text style={styles.savedMessage}>✨ Daily rules successfully updated!</Text>}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepBtn: {
    width: 48,
    height: 50,
    borderWidth: 2,
    borderColor: '#2b303c',
    borderRadius: 10,
    backgroundColor: '#fef08a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#222733',
    shadowOffset: { width: 1.5, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 2,
  },
  stepBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#713f12',
    lineHeight: 24,
  },
  stepperInput: {
    flex: 1,
    textAlign: 'center',
  },
});
