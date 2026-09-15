const API_URL = import.meta.env.VITE_TASKSTREAKS_API_URL;
const DEFAULT_USER_ID = 'demo-user';

function getUserId() {
  return localStorage.getItem('taskstreaks.userId') || DEFAULT_USER_ID;
}

function buildUrl(key) {
  if (!API_URL) {
    return null;
  }

  const base = API_URL.replace(/\/$/, '');
  return `${base}/data?userId=${encodeURIComponent(getUserId())}&key=${encodeURIComponent(key)}`;
}

export async function readCloudValue(key, fallbackValue) {
  if (!API_URL) {
    return fallbackValue;
  }

  try {
    const response = await fetch(buildUrl(key), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return fallbackValue;
    }

    const payload = await response.json();
    return payload?.value ?? fallbackValue;
  } catch (error) {
    console.error(`Unable to read data from cloud for key: ${key}`, error);
    return fallbackValue;
  }
}

export async function writeCloudValue(key, value) {
  if (!API_URL) {
    return;
  }

  try {
    const response = await fetch(API_URL.replace(/\/$/, ''), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getUserId(),
        key,
        value,
      }),
    });

    if (!response.ok) {
      console.error(`Cloud write failed for key: ${key}`);
    }
  } catch (error) {
    console.error(`Unable to write data to cloud for key: ${key}`, error);
  }
}
