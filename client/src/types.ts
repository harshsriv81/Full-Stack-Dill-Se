export type EmotionTagId = 'heartbreak' | 'unsent-love' | 'guilt' | 'dreams' | 'hope' | 'last-message';

export interface EmotionTag {
  id: EmotionTagId;
  label: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface User {
    id: string;
    nickname: string;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Post {
  id: string;
  title:string;
  content: string;
  tag: EmotionTagId;
  author: User;
  createdAt: string;
  hearts: number;
  flowers: number;
  replies: Reply[];
}

export interface AuthData {
    token: string;
    user: User;
}
