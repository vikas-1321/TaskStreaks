import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useThemeIsDark, useThemeStyles } from '../theme/ThemeContext';

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
    <>
      <View style={styles.pageIntro}>
        <Text style={styles.sectionTitle}>Daily work</Text>
        <Text style={styles.muted}>Track your routines across the week</Text>
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
              <Text style={styles.workNameHeader}>WORK</Text>
              {week.map((date) => <Text key={date.key} style={styles.dayHeader}>{date.label}</Text>)}
              <Text style={styles.workDeleteHeader}> </Text>
            </View>
            {workItems.length === 0 ? <Text style={styles.empty}>Add routines like brushing teeth.</Text> : workItems.map((item) => (
              <View style={styles.workRow} key={item.id}>
                <Text style={styles.workName} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                {week.map((date) => (
                  <Pressable key={date.key} style={styles.workCheckboxCell} onPress={() => onToggle(item.id, date.key)}>
                    <View style={[styles.workCheckmark, item.completedBy[date.key] && styles.workChecked]}>
                      <Text style={styles.workCheckText}>{item.completedBy[date.key] ? '✓' : ''}</Text>
                    </View>
                  </Pressable>
                ))}
                <Pressable style={styles.workDelete} onPress={() => onDelete(item.id)}>
                  <Text style={styles.delete}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.addRoutinePanel}>
        <Text style={styles.addRoutineLabel}>Add routine</Text>
        <View style={styles.addWorkRow}>
          <TextInput style={styles.inlineInput} placeholder="e.g. Morning walk" placeholderTextColor={isDark ? '#facc15' : '#9ca3af'} value={draft} onChangeText={setDraft} onSubmitEditing={add} returnKeyType="done" />
          <Pressable style={styles.smallButton} onPress={add}><Text style={styles.smallButtonText}>Add</Text></Pressable>
        </View>
      </View>
    </>
  );
}
