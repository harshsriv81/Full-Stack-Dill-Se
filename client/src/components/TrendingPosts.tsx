import React from 'react';
import { Post } from '../types';
import { HeartIcon, TrendingIcon } from './Icons';

interface TrendingPostsProps {
  posts: Post[];
}

const TrendingPosts: React.FC<TrendingPostsProps> = ({ posts }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <TrendingIcon className="w-6 h-6 text-violet-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Most Hearted</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            style={{ animationDelay: `${index * 150}ms` }}
            className="animate-fadeIn bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-violet-400 dark:hover:border-violet-500 transition-all cursor-pointer"
          >
            <h3 className="font-semibold truncate text-gray-800 dark:text-gray-200">{post.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">by {post.author.nickname}</p>
            <div className="flex items-center text-sm text-red-500 dark:text-red-400">
              <HeartIcon className="w-4 h-4 mr-1.5" />
              <span>{post.hearts} hearts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
