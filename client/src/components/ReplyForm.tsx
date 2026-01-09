import React, { useState } from 'react';
import { Post } from '../types';
import * as apiService from '../services/apiService';

interface ReplyFormProps {
  postId: string;
  onReplyAdded: (updatedPost: Post) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ postId, onReplyAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const updatedPost = await apiService.addReply(postId, content);
      onReplyAdded(updatedPost);
      setContent('');
    } catch (error) {
      console.error("Failed to add reply", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="flex-grow p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-violet-500 outline-none transition-colors"
        aria-label="Reply input"
      />
      <button type="submit" disabled={isSubmitting || !content.trim()} className="px-3 py-2 text-sm font-semibold text-white bg-violet-500 rounded-lg hover:bg-violet-600 disabled:opacity-50 transition-colors">
        {isSubmitting ? '...' : 'Send'}
      </button>
    </form>
  );
};

export default ReplyForm;
