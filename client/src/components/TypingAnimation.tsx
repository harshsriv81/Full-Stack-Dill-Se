import React from 'react';

interface TypingAnimationProps {
  text: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text }) => {
  return (
    <div className="inline-block">
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-mono overflow-hidden whitespace-nowrap border-r-4 border-r-gray-600 dark:border-r-gray-400 animate-typing">
        {text}
      </p>
    </div>
  );
};

export default TypingAnimation;
