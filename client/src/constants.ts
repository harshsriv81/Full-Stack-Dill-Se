import { EmotionTag } from './types';

export const EMOTION_TAGS: EmotionTag[] = [
  { id: 'heartbreak', label: 'Heartbreak', icon: '🖤', color: 'text-red-500', gradient: 'from-red-500 to-rose-500' },
  { id: 'unsent-love', label: 'Unsent Love', icon: '💌', color: 'text-pink-500', gradient: 'from-pink-400 to-fuchsia-400' },
  { id: 'guilt', label: 'Guilt', icon: '😞', color: 'text-yellow-500', gradient: 'from-yellow-400 to-amber-500' },
  { id: 'dreams', label: 'Dreams', icon: '☁️', color: 'text-sky-500', gradient: 'from-sky-400 to-cyan-400' },
  { id: 'hope', label: 'Hope', icon: '✨', color: 'text-green-500', gradient: 'from-green-400 to-emerald-500' },
  { id: 'last-message', label: 'Last Messages', icon: '💬', color: 'text-indigo-500', gradient: 'from-indigo-400 to-violet-500' },
];
