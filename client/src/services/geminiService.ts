import { EmotionTagId } from '../types';

const getAuthHeaders = () => {
    const authDataString = localStorage.getItem('auth');
    if (!authDataString) return {};
    try {
        const { token } = JSON.parse(authDataString);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    } catch (e) {
        return {};
    }
};

export const suggestEmotionTag = async (content: string): Promise<EmotionTagId | null> => {
  try {
    const response = await fetch('/api/suggest-tag', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        const err = await response.json();
        console.error("Error from backend suggestion:", err.message);
        return null;
    }

    const result = await response.json();
    if (result && result.tag) {
        return result.tag as EmotionTagId;
    }
    return null;

  } catch (error) {
    console.error("Error calling suggestion API:", error);
    return null;
  }
};
