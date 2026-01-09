import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Post, EmotionTagId, User } from '../types';
import * as apiService from '../services/apiService';
import Header from '../components/Header';
import TagFilter from '../components/TagFilter';
import PostCard from '../components/PostCard';
import PostFormModal from '../components/PostFormModal';
import TypingAnimation from '../components/TypingAnimation';
import TrendingPosts from '../components/TrendingPosts';
import { ShuffleIcon, PlusIcon } from '../components/Icons';

interface ArchivePageProps {
  user: User;
  onLogout: () => void;
}

const ArchivePage: React.FC<ArchivePageProps> = ({ user, onLogout }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<EmotionTagId | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    apiService.getPosts()
      .then(fetchedPosts => {
        setPosts(fetchedPosts);
      })
      .catch(error => {
        console.error("Failed to fetch posts:", error);
        if (error.message.includes('token')) {
            onLogout(); // If token is invalid, log out user
        }
      })
      .finally(() => setIsLoading(false));
  }, [onLogout]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleAddPost = async (newPostData: Omit<Post, 'id' | 'createdAt' | 'hearts' | 'flowers' | 'replies' | 'author'>) => {
    const newPost = await apiService.createPost(newPostData);
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsModalOpen(false);
    setSelectedTag('all');
  };

  const handleReaction = useCallback(async (postId: string, reaction: 'hearts' | 'flowers') => {
    // Optimistic update
    setPosts(currentPosts => 
      currentPosts.map(p => 
        p.id === postId ? { ...p, [reaction]: p[reaction] + 1 } : p
      )
    );
    try {
      await apiService.addReaction(postId, reaction);
    } catch (error) {
       console.error("Failed to save reaction:", error);
       // Revert optimistic update on failure
       setPosts(currentPosts =>
        currentPosts.map(p => 
            p.id === postId ? { ...p, [reaction]: p[reaction] - 1 } : p
        )
       );
    }
  }, []);

  const handleReplyAdded = (updatedPost: Post) => {
    setPosts(currentPosts =>
      currentPosts.map(p => (p.id === updatedPost.id ? updatedPost : p))
    );
  };
  
  const shufflePosts = () => {
    setPosts(currentPosts => [...currentPosts].sort(() => Math.random() - 0.5));
  };

  const filteredPosts = useMemo(() => {
    if (selectedTag === 'all') {
      return posts;
    }
    return posts.filter(post => post.tag === selectedTag);
  }, [posts, selectedTag]);

  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.hearts - a.hearts)
      .slice(0, 3);
  }, [posts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500 font-sans">
      <Header user={user} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
            DilSe
          </h1>
          <TypingAnimation text="Kuch baatein sirf dil ke liye hoti hain..." />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <TagFilter selectedTag={selectedTag} onSelectTag={setSelectedTag} />
          <div className="flex items-center gap-4">
            <button
              onClick={shufflePosts}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              aria-label="Shuffle posts"
            >
              <ShuffleIcon className="w-5 h-5 text-violet-500" />
              <span className="font-semibold">Shuffle & Feel</span>
            </button>
             <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              aria-label="Open post creation form"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-semibold">Post your heart</span>
            </button>
          </div>
        </div>

        {trendingPosts.length > 0 && <TrendingPosts posts={trendingPosts} />}

        {isLoading ? (
          <div className="text-center py-16 text-xl text-gray-500 dark:text-gray-400">Loading feelings...</div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredPosts.map((post, index) => (
              <div key={post.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fadeIn">
                 <PostCard post={post} onReact={handleReaction} onReplyAdded={handleReplyAdded} theme={theme} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mt-8">
            <p className="text-xl text-gray-500 dark:text-gray-400">No stories found for this feeling yet.</p>
            <p className="mt-2 text-gray-400 dark:text-gray-500">Why not be the first to share?</p>
          </div>
        )}
      </main>

      {isModalOpen && (
        <PostFormModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPost}
        />
      )}
    </div>
  );
};

export default ArchivePage;
