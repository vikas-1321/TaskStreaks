import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useThemeIsDark, useThemeStyles } from '../theme/ThemeContext';
import { WashiTape } from './SketchElements';

export default function DailyWorkBoard({ workItems, week, onAdd, onToggle, onDelete }) {
  const styles = useThemeStyles();
  const isDark = useThemeIsDark();
  const [draft, setDraft] = useState('');

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    onAdd(title);
    setDraft('');
  };

  return (
    <View style={localStyles.container}>
      <View style={styles.pageIntro}>
        <View style={localStyles.tag}>
          <Text style={localStyles.tagText}>BULLET JOURNAL MATRIX</Text>
        </View>
        <Text style={styles.sectionTitle}>Daily Routines &amp; Habits</Text>
        <Text style={styles.muted}>Track recurring habits across the 7 days of this week.</Text>
      </View>

      <View style={styles.workBoard}>
        <ScrollView
          horizontal
          nestedScrollEnabled
          directionalLockEnabled
          showsHorizontalScrollIndicator
          style={styles.workScroller}
          contentContainerStyle={styles.workTable}
        >
          <View>
            <View style={styles.workHeader}>
              <Text style={styles.workNameHeader}>HABIT / ROUTINE</Text>
              {week.map((date) => (
                <Text key={date.key} style={styles.dayHeader}>
                  {date.label}
                </Text>
              ))}
              <Text style={localStyles.scoreHeader}>DONE</Text>
              <Text style={styles.workDeleteHeader}> </Text>
            </View>

            {workItems.length === 0 ? (
              <View style={localStyles.emptyWrap}>
                <Text style={styles.empty}>No routines logged yet. Add your daily habits below!</Text>
              </View>
            ) : (
              workItems.map((item) => {
                const completedCount = week.filter((d) => item.completedBy?.[d.key]).length;

                return (
                  <View style={styles.workRow} key={item.id}>
                    <Text style={styles.workName} numberOfLines={1} ellipsizeMode="tail">
                      ○ {item.title}
                    </Text>

                    {week.map((date) => {
                      const isChecked = Boolean(item.completedBy?.[date.key]);

                      return (
                        <Pressable
                          key={date.key}
                          style={styles.workCheckboxCell}
                          onPress={() => onToggle(item.id, date.key)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: isChecked }}
                        >
                          <View
                            style={[
                              styles.workCheckmark,
                              isChecked && styles.workChecked,
                              localStyles.sketchCheck,
                            ]}
                          >
                            <Text style={styles.workCheckText}>{isChecked ? '✓' : ''}</Text>
                          </View>
                        </Pressable>
                      );
                    })}

                    <View style={localStyles.scoreCell}>
                      <Text style={localStyles.scorePill}>{completedCount}/7</Text>
                    </View>

                    <Pressable style={styles.workDelete} onPress={() => onDelete(item.id)}>
                      <Text style={styles.delete}>×</Text>
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.addRoutinePanel}>
        <WashiTape angle={-1.5} width={55} height={14} style={localStyles.routineTape} />
        <Text style={styles.addRoutineLabel}>✏️ Add New Routine</Text>
        <View style={styles.addWorkRow}>
          <TextInput
            style={styles.inlineInput}
            placeholder="e.g. Morning walk, Read 20m..."
            placeholderTextColor={isDark ? '#facc15' : '#9ca3af'}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={add}
            returnKeyType="done"
          />
          <Pressable style={styles.smallButton} onPress={add}>
            <Text style={styles.smallButtonText}>Add Habit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  tag: {
    backgroundColor: '#bbf7d0',
    borderWidth: 1.2,
    borderColor: '#2b303c',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#14532d',
  },
  scoreHeader: {
    width: 38,
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  scoreCell: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scorePill: {
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2b303c',
  },
  sketchCheck: {
    transform: [{ rotate: '-1.5deg' }],
  },
  routineTape: {
    top: -8,
    left: 18,
  },
  emptyWrap: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
