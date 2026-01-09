import React, { useState, useEffect } from 'react';
import { Post, EmotionTagId, User } from '../types';
import { EMOTION_TAGS } from '../constants';
import * as geminiService from '../services/geminiService';
import { SparklesIcon, XIcon } from './Icons';

interface PostFormModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'createdAt' | 'hearts' | 'flowers' | 'replies' | 'author'>) => Promise<void>;
}

const PostFormModal: React.FC<PostFormModalProps> = ({ user, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<EmotionTagId | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState('');

  const selectedTagInfo = EMOTION_TAGS.find(t => t.id === tag);
  const gradientClass = selectedTagInfo ? selectedTagInfo.gradient : 'from-gray-700 to-gray-800';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !tag) {
      setError('Title, content, and an emotion tag are required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ title, content, tag });
    } catch (err) {
      console.error("Submission failed", err);
      setError("Failed to post. Please try again later.");
      setIsSubmitting(false);
    } 
  };

  const handleSuggestTag = async () => {
    if (!content) {
        setError('Please write your message first to get a suggestion.');
        return;
    }
    setError('');
    setIsSuggesting(true);
    try {
        const suggestedTagId = await geminiService.suggestEmotionTag(content);
        if (suggestedTagId) {
            setTag(suggestedTagId);
        } else {
            setError("Could not suggest a tag. Please select one manually.");
        }
    } catch (err) {
        console.error("Error suggesting tag:", err);
        setError("AI suggestion failed. Please select a tag manually.");
    } finally {
        setIsSuggesting(false);
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className={`relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500`}>
        <div className={`p-6 bg-gradient-to-br ${gradientClass}`}>
          <h2 className="text-3xl font-bold text-white">Share what's in your heart, {user.nickname}</h2>
          <p className="text-white/80 mt-1">Your words are safe here. Let them go.</p>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
          <XIcon className="w-7 h-7" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <input
              type="text"
              placeholder="A Title for your feeling"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-violet-500 rounded-lg outline-none transition-colors"
              aria-label="Title"
            />
          </div>
          <div>
            <textarea
              placeholder="Leave your feelings here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-violet-500 rounded-lg outline-none transition-colors resize-y"
              aria-label="Content of your post"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Choose an emotion</h3>
                 <button type="button" onClick={handleSuggestTag} disabled={isSuggesting || !content} className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                    <SparklesIcon className="w-4 h-4" />
                    {isSuggesting ? 'Thinking...' : 'Suggest with AI'}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTag(t.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                    tag === t.id
                      ? 'border-violet-500 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 scale-105'
                      : 'border-transparent bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  aria-pressed={tag === t.id}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Set my words free'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;
