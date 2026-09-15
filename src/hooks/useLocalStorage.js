import { useEffect, useState } from 'react';
import { readCloudValue, writeCloudValue } from '../services/taskStreakApi.js';

const API_URL = import.meta.env.VITE_TASKSTREAKS_API_URL;

function readLocalValue(key, initialValue) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  } catch (error) {
    console.error(`Unable to read localStorage key: ${key}`, error);
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readLocalValue(key, initialValue));

  useEffect(() => {
    if (!API_URL) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Unable to save localStorage key: ${key}`, error);
      }
      return;
    }

    let active = true;

    readCloudValue(key, value)
      .then((cloudValue) => {
        if (!active) {
          return;
        }

        if (JSON.stringify(cloudValue) !== JSON.stringify(value)) {
          setValue(cloudValue);
        }
      })
      .catch((error) => {
        console.error(`Unable to load cloud value for ${key}`, error);
      });

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!API_URL) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Unable to save localStorage key: ${key}`, error);
      }
      return;
    }

    writeCloudValue(key, value);
  }, [key, value]);

  return [value, setValue];
}
