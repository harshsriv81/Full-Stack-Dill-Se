import React from 'react';
import { User } from '../types';
import { SunIcon, MoonIcon, LogoutIcon } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, toggleTheme }) => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
          DilSe
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
            Welcome, <span className="font-bold">{user.nickname}</span>
           </span>
            <button
                onClick={onLogout}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Logout"
                >
                <LogoutIcon className="w-6 h-6" />
            </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="w-6 h-6" />
            ) : (
              <SunIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
