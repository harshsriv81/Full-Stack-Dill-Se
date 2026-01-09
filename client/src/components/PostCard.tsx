import React, { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import { Post } from '../types';
import { EMOTION_TAGS } from '../constants';
import { HeartIcon, FlowerIcon, ShareIcon, ReplyIcon } from './Icons';
import Reply from './Reply';
import ReplyForm from './ReplyForm';

interface PostCardProps {
  post: Post;
  onReact: (postId: string, reaction: 'hearts' | 'flowers') => void;
  onReplyAdded: (updatedPost: Post) => void;
  theme: 'light' | 'dark';
}

const PostCard: React.FC<PostCardProps> = ({ post, onReact, onReplyAdded, theme }) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [showReplies, setShowReplies] = useState(false);
  
  const tagInfo = EMOTION_TAGS.find(t => t.id === post.tag);
  const gradientClass = tagInfo ? tagInfo.gradient : 'from-gray-400 to-gray-500';

  const handleExport = useCallback(() => {
    if (exportRef.current === null) return;
    toPng(exportRef.current, { cacheBust: true, backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb', pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `dilse-${post.id}-${post.title.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      }).catch((err) => console.error('Failed to export post.', err));
  }, [post, theme]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-t-4 border-violet-400 dark:border-violet-500">
      <div className="flex-grow flex flex-col">
        <div ref={exportRef} className="p-5 bg-white dark:bg-gray-800">
            <div className={`p-5 -m-5 mb-5 flex-grow bg-gradient-to-br ${gradientClass} text-white rounded-t-xl`}>
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    <span className="text-3xl opacity-70">{tagInfo?.icon}</span>
                </div>
                <p className="text-sm font-light italic mb-4">by {post.author.nickname}</p>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.content}
            </p>
        </div>
      </div>
      
      <div className="px-5 pb-5 mt-auto bg-white dark:bg-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 my-4">
          {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex items-center justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-3">
          <button onClick={handleExport} className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors group" aria-label="Share Post">
            <ShareIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group" aria-label="Reply to post">
            <ReplyIcon className="w-5 h-5" />
            <span className="font-semibold">{post.replies.length}</span>
          </button>
          <button onClick={() => onReact(post.id, 'flowers')} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors group" aria-label="React with a flower">
            <FlowerIcon className="w-5 h-5" />
            <span className="font-semibold">{post.flowers}</span>
          </button>
          <button onClick={() => onReact(post.id, 'hearts')} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group" aria-label="React with a heart">
            <HeartIcon className="w-5 h-5" />
            <span className="font-semibold">{post.hearts}</span>
          </button>
        </div>
      </div>

      {showReplies && (
        <div className="px-5 pb-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
            {post.replies.length > 0 ? (
              post.replies.map((reply) => <Reply key={reply.id} reply={reply} />)
            ) : (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-2">No replies yet. Be the first.</p>
            )}
          </div>
          <ReplyForm postId={post.id} onReplyAdded={onReplyAdded} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
