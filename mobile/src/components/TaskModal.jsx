import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useThemeIsDark, useThemeStyles } from '../theme/ThemeContext';
import { WashiTape } from './SketchElements';

export default function TaskModal({ visible, goals = [], selectedGoalId = '', onClose, onAdd }) {
  const styles = useThemeStyles();
  const isDark = useThemeIsDark();
  const [draft, setDraft] = useState('');
  const [chosenGoalId, setChosenGoalId] = useState(selectedGoalId || '');

  useEffect(() => {
    setChosenGoalId(selectedGoalId || '');
  }, [selectedGoalId, visible]);

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    onAdd(title, chosenGoalId || null);
    setDraft('');
  };

  const close = () => {
    setDraft('');
    onClose();
  };

  const isGoalSelected = Boolean(chosenGoalId);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.modalBackdrop} onPress={close}>
        <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
          <WashiTape angle={1.2} width={70} height={18} style={localStyles.modalTape} />

          <View style={localStyles.header}>
            <Text style={localStyles.icon}>✏️</Text>
            <Text style={styles.sectionTitle}>Sketch New Task</Text>
          </View>

          <TextInput
            style={styles.modalInput}
            placeholder="What will you accomplish?"
            placeholderTextColor={isDark ? '#facc15' : '#9ca3af'}
            value={draft}
            onChangeText={setDraft}
            autoFocus
            onSubmitEditing={add}
            returnKeyType="done"
          />

          {/* Target Goal & Lifetime Selector */}
          <View style={localStyles.targetSection}>
            <Text style={localStyles.targetLabel}>Target &amp; Lifetime:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={localStyles.goalPillRow}
            >
              <Pressable
                style={[
                  localStyles.goalPill,
                  !chosenGoalId && localStyles.goalPillActive,
                ]}
                onPress={() => setChosenGoalId('')}
              >
                <Text style={localStyles.pillIcon}>📓</Text>
                <Text
                  style={[
                    localStyles.goalPillText,
                    !chosenGoalId && localStyles.goalPillTextActive,
                  ]}
                >
                  Today&apos;s task
                </Text>
              </Pressable>

              {goals.map((goal) => {
                const isActive = chosenGoalId === goal.id;
                return (
                  <Pressable
                    key={goal.id}
                    style={[
                      localStyles.goalPill,
                      isActive && [localStyles.goalPillActive, { borderColor: goal.color || '#2b303c' }],
                    ]}
                    onPress={() => setChosenGoalId(goal.id)}
                  >
                    <View
                      style={[
                        localStyles.goalDot,
                        { backgroundColor: goal.color || '#3b82f6' },
                      ]}
                    />
                    <Text
                      style={[
                        localStyles.goalPillText,
                        isActive && localStyles.goalPillTextActive,
                      ]}
                    >
                      {goal.title}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Lifetime Explanation Note */}
            <View
              style={[
                localStyles.lifetimeNote,
                isGoalSelected ? localStyles.goalLifetimeNote : localStyles.dailyLifetimeNote,
              ]}
            >
              <Text
                style={[
                  localStyles.lifetimeNoteText,
                  isGoalSelected ? localStyles.goalLifetimeText : localStyles.dailyLifetimeText,
                ]}
              >
                {isGoalSelected
                  ? '⏳ Long-term: Persists in this goal across days until completed.'
                  : '⏱️ 1-Day: Active for today only (single day lifetime).'}
              </Text>
            </View>
          </View>

          <View style={localStyles.actions}>
            <Pressable style={localStyles.cancelBtn} onPress={close}>
              <Text style={localStyles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={add}>
              <Text style={styles.primaryButtonText}>+ Add to Page</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalTape: {
    top: -10,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  icon: {
    fontSize: 20,
  },
  targetSection: {
    marginTop: 4,
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  goalPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    gap: 8,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.8,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  goalPillActive: {
    backgroundColor: '#fef08a',
    borderColor: '#2b303c',
    borderWidth: 2,
  },
  pillIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  goalPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  goalPillTextActive: {
    color: '#713f12',
    fontWeight: '900',
  },
  lifetimeNote: {
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1.2,
  },
  dailyLifetimeNote: {
    backgroundColor: '#fefce8',
    borderColor: '#eab308',
  },
  goalLifetimeNote: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  lifetimeNoteText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  dailyLifetimeText: {
    color: '#854d0e',
  },
  goalLifetimeText: {
    color: '#1e40af',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cancelText: {
    color: '#64748b',
    fontWeight: '800',
    fontSize: 14,
  },
});
