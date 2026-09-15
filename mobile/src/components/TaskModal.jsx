import { useState } from 'react';
import { Modal, Pressable, Text, TextInput } from 'react-native';
import { useThemeIsDark, useThemeStyles } from '../theme/ThemeContext';

export default function TaskModal({ visible, onClose, onAdd }) {
  const styles = useThemeStyles();
  const isDark = useThemeIsDark();
  const [draft, setDraft] = useState('');

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    onAdd(title);
    setDraft('');
  };

  const close = () => {
    setDraft('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.modalBackdrop} onPress={close}>
        <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.sectionTitle}>New task</Text>
          <TextInput style={styles.modalInput} placeholder="What needs doing today?" placeholderTextColor={isDark ? '#facc15' : '#9ca3af'} value={draft} onChangeText={setDraft} autoFocus onSubmitEditing={add} returnKeyType="done" />
          <Pressable style={styles.primaryButton} onPress={add}><Text style={styles.primaryButtonText}>Add task</Text></Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
