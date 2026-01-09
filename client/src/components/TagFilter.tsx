import React from 'react';
import { EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../constants';

interface TagFilterProps {
  selectedTag: EmotionTagId | 'all';
  onSelectTag: (tag: EmotionTagId | 'all') => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTag, onSelectTag }) => {
  const allTag = { id: 'all' as 'all', label: 'All Feelings', icon: '💖' };
  const tagsToDisplay = [allTag, ...EMOTION_TAGS];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tagsToDisplay.map(tag => {
        const isSelected = selectedTag === tag.id;
        return (
          <button
            key={tag.id}
            onClick={() => onSelectTag(tag.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
              ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
          >
            <span>{tag.icon}</span>
            <span>{tag.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TagFilter;
