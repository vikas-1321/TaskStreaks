import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { goalColors, initialData, STORAGE_KEY } from '../constants/appData';

const getApiBaseUrl = () => {
  const configuredUrl = Constants.expoConfig?.extra?.apiUrl;
  if (configuredUrl && configuredUrl !== 'http://10.0.2.2:3001') {
    return configuredUrl;
  }

  // Dynamically resolve host IP when running via Expo Go (e.g. physical device over Wi-Fi)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    return `http://${hostIp}:3001`;
  }

  return Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();
const USER_ID = 'demo-user';

const createId = () => Date.now().toString();

const readFromApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/data?userId=${encodeURIComponent(USER_ID)}&key=${encodeURIComponent(STORAGE_KEY)}`);
    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload && typeof payload.value !== 'undefined' ? payload.value : null;
  } catch (error) {
    console.warn('Unable to read mobile data from AWS API, using local fallback', error);
    return null;
  }
};

const writeToApi = async (nextData) => {
  try {
    await fetch(`${API_BASE_URL}/data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: USER_ID,
        key: STORAGE_KEY,
        value: nextData,
      }),
    });
  } catch (error) {
    console.warn('Unable to sync mobile data to AWS API, keeping local fallback', error);
  }
};

export function useTaskStreakData() {
  const [data, setData] = useState(initialData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const cloudData = await readFromApi();
        if (cloudData) {
          const settings = { ...initialData.settings, ...cloudData.settings };
          setData({ ...initialData, ...cloudData, settings });
          return;
        }

        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) {
          return;
        }

        const storedData = JSON.parse(stored);
        const settings = { ...initialData.settings, ...storedData.settings };
        setData({ ...initialData, ...storedData, settings });
      } catch (error) {
        console.warn('Unable to hydrate mobile data', error);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
    writeToApi(data).catch(() => {});
  }, [data, isHydrated]);

  const addTask = (title, date, goalId) => {
    const isGoal = Boolean(goalId);
    return setData((current) => ({
      ...current,
      tasks: [
        ...current.tasks,
        {
          id: createId(),
          title,
          date,
          goalId: goalId || null,
          lifetime: isGoal ? 'long-term' : 'daily',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
      ],
    }));
  };

  const toggleTask = (taskId) => setData((current) => ({
    ...current,
    tasks: current.tasks.map((task) => {
      if (task.id !== taskId) return task;
      const nextCompleted = !task.completed;
      return {
        ...task,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : null,
      };
    }),
  }));

  const deleteTask = (taskId) => setData((current) => ({
    ...current,
    tasks: current.tasks.filter((task) => task.id !== taskId),
  }));

  const addGoal = (title) => setData((current) => ({
    ...current,
    goals: [...current.goals, { id: createId(), title, color: goalColors[current.goals.length % goalColors.length] }],
  }));

  const addWork = (title) => setData((current) => ({
    ...current,
    workItems: [...current.workItems, { id: createId(), title, completedBy: {} }],
  }));

  const toggleWork = (workId, dateKey) => setData((current) => ({
    ...current,
    workItems: current.workItems.map((item) => item.id === workId
      ? { ...item, completedBy: { ...item.completedBy, [dateKey]: !item.completedBy[dateKey] } }
      : item),
  }));

  const deleteWork = (workId) => setData((current) => ({
    ...current,
    workItems: current.workItems.filter((item) => item.id !== workId),
  }));

  const updateSettings = (settings) => setData((current) => ({
    ...current,
    settings: { ...current.settings, ...settings },
  }));

  return {
    data,
    isHydrated,
    addTask,
    toggleTask,
    deleteTask,
    addGoal,
    addWork,
    toggleWork,
    deleteWork,
    updateSettings,
  };
}
