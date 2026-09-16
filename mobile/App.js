import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';
import BottomNavigation from './src/components/BottomNavigation';
import DailyWorkBoard from './src/components/DailyWorkBoard';
import GoalsPanel from './src/components/GoalsPanel';
import HomeScreen from './src/components/HomeScreen';
import { SpiralHeader } from './src/components/SketchElements';
import TaskModal from './src/components/TaskModal';
import { useTaskStreakData } from './src/hooks/useTaskStreakData';
import { ThemeProvider, useThemeStyles } from './src/theme/ThemeContext';
import { formatKey, getWeek } from './src/utils/dateUtils';
import { getDailyProgress } from './src/utils/progressUtils';

const tabs = ['home', 'work', 'goals'];

export default function App() {
  const dataApi = useTaskStreakData();
  const isDark = dataApi.data.settings?.theme === 'dark';

  return (
    <ThemeProvider isDark={isDark}>
      <AppContent {...dataApi} />
    </ThemeProvider>
  );
}

function AppContent({ data, addTask, toggleTask, deleteTask, addGoal, addWork, toggleWork, deleteWork, updateSettings }) {
  const styles = useThemeStyles();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const pagerRef = useRef(null);
  const pageWidth = Dimensions.get('window').width;

  const todayKey = formatKey(new Date());
  const week = useMemo(getWeek, []);
  const progress = getDailyProgress(data.tasks, data.settings, todayKey);
  const selectedGoal = data.goals.find((goal) => goal.id === selectedGoalId);
  const visibleTasks = selectedGoal
    ? data.tasks.filter((task) => task.goalId === selectedGoal.id)
    : progress.todayTasks;

  const handleAddTask = (title, goalId) => {
    addTask(title, todayKey, goalId !== undefined ? goalId : selectedGoalId);
    setIsTaskFormOpen(false);
  };

  const handleSelectGoal = (goalId) => {
    setSelectedGoalId(goalId);
    if (activeTab === 'goals') changePage('home');
  };

  const changePage = (tab) => {
    const pageIndex = tabs.indexOf(tab);
    setActiveTab(tab);
    pagerRef.current?.scrollTo({ x: pageIndex * pageWidth, animated: true });
  };

  const handlePageScrollEnd = (event) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    const nextTab = tabs[pageIndex];
    if (nextTab && nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />

        {/* Top Wire Spiral Binder Simulation */}
        <SpiralHeader />

        <View style={styles.header}>
          <Image
            source={require('./assets/logo.png')}
            style={{ width: 36, height: 36, borderRadius: 8, marginRight: 10, borderWidth: 1.5, borderColor: '#2b303c' }}
          />
          <View style={styles.headerContent}>
            <Text style={styles.eyebrow}>★ HABIT JOURNAL</Text>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              TaskStreaks
            </Text>
            <View style={styles.titleMarker} />
          </View>
          <Text style={styles.date}>
            📌 {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: 0, y: 0 }}
          onMomentumScrollEnd={handlePageScrollEnd}
          nestedScrollEnabled
          style={styles.pagePager}
        >
          <ScrollView
            style={[styles.page, { width: pageWidth }]}
            contentContainerStyle={styles.pageContainer}
            nestedScrollEnabled
          >
            <HomeScreen
              progress={progress}
              goals={data.goals}
              selectedGoalId={selectedGoalId}
              visibleTasks={visibleTasks}
              allTasks={data.tasks}
              settings={data.settings}
              onSelectGoal={setSelectedGoalId}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          </ScrollView>

          <ScrollView
            style={[styles.page, { width: pageWidth }]}
            contentContainerStyle={styles.pageContainer}
            nestedScrollEnabled
          >
            <DailyWorkBoard
              workItems={data.workItems}
              week={week}
              onAdd={addWork}
              onToggle={toggleWork}
              onDelete={deleteWork}
            />
          </ScrollView>

          <ScrollView
            style={[styles.page, { width: pageWidth }]}
            contentContainerStyle={styles.pageContainer}
            nestedScrollEnabled
          >
            <GoalsPanel
              goals={data.goals}
              selectedGoalId={selectedGoalId}
              settings={data.settings}
              isDark={data.settings?.theme === 'dark'}
              onSelectGoal={handleSelectGoal}
              onAddGoal={addGoal}
              onSaveRules={updateSettings}
              onToggleTheme={(isDarkMode) =>
                updateSettings({ theme: isDarkMode ? 'dark' : 'light' })
              }
            />
          </ScrollView>
        </ScrollView>

        {activeTab === 'home' && (
          <Pressable
            style={styles.floatingButton}
            onPress={() => setIsTaskFormOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Add new task"
          >
            <Text style={styles.floatingPlus}>✏️</Text>
          </Pressable>
        )}

        <TaskModal
          visible={isTaskFormOpen}
          goals={data.goals}
          selectedGoalId={selectedGoalId}
          onClose={() => setIsTaskFormOpen(false)}
          onAdd={handleAddTask}
        />

        <BottomNavigation activeTab={activeTab} onChange={changePage} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
