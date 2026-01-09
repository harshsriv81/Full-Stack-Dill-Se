import React from 'react';
import { Reply as ReplyType } from '../types';

const Reply: React.FC<{ reply: ReplyType }> = ({ reply }) => (
  <div className="py-2 px-3 bg-gray-100 dark:bg-gray-700/80 rounded-lg animate-fadeIn">
    <p className="text-sm text-gray-800 dark:text-gray-200">
      <span className="font-semibold text-violet-600 dark:text-violet-400">{reply.author.nickname}:</span> {reply.content}
    </p>
  </div>
);

export default Reply;
