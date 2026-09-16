import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeStyles } from '../theme/ThemeContext';

export default function GoalSelector({ goals = [], selectedGoalId, onSelect }) {
  const styles = useThemeStyles();

  return (
    <View style={localStyles.wrapper}>
      <ScrollView
        horizontal
        nestedScrollEnabled={true}
        directionalLockEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        style={localStyles.scroller}
        contentContainerStyle={localStyles.contentContainer}
      >
        {/* Today's Tasks default pill */}
        <Pressable
          style={[
            localStyles.chip,
            !selectedGoalId ? localStyles.selectedChip : localStyles.unselectedChip,
          ]}
          onPress={() => onSelect('')}
          accessibilityRole="tab"
          accessibilityState={{ selected: !selectedGoalId }}
        >
          <Text style={localStyles.tabIcon}>📓</Text>
          <Text
            numberOfLines={1}
            style={[
              localStyles.chipText,
              !selectedGoalId && localStyles.selectedChipText,
            ]}
          >
            Today&apos;s tasks
          </Text>
        </Pressable>

        {/* Dynamic Goal Pills */}
        {goals.map((goal, idx) => {
          const isSelected = selectedGoalId === goal.id;
          const tilt = idx % 2 === 0 ? '-0.7deg' : '0.7deg';

          return (
            <Pressable
              key={goal.id}
              style={[
                localStyles.chip,
                isSelected
                  ? [localStyles.selectedChip, { borderColor: goal.color || '#2b303c' }]
                  : localStyles.unselectedChip,
                { transform: [{ rotate: isSelected ? '0deg' : tilt }] },
              ]}
              onPress={() => onSelect(goal.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              <View
                style={[
                  localStyles.crayonDot,
                  { backgroundColor: goal.color || '#3b82f6' },
                ]}
              />
              <Text
                numberOfLines={1}
                style={[
                  localStyles.chipText,
                  isSelected && localStyles.selectedChipText,
                ]}
              >
                {goal.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 14,
  },
  scroller: {
    flexGrow: 0,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 32, // Ensures last item (e.g. Sample) has room to be fully visible
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0, // Prevents chips from collapsing horizontally
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#2b303c',
    shadowColor: '#222733',
    shadowOffset: { width: 1.5, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 0,
    elevation: 2,
  },
  selectedChip: {
    backgroundColor: '#fef08a', // Marker yellow highlight
    borderWidth: 2.2,
  },
  unselectedChip: {
    backgroundColor: '#ffffff',
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#222733',
  },
  selectedChipText: {
    fontWeight: '900',
    color: '#713f12',
  },
  tabIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  crayonDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: '#2b303c',
    marginRight: 7,
  },
});
