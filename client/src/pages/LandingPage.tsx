import React from 'react';
import TypingAnimation from '../components/TypingAnimation';
import { SparklesIcon, UsersIcon, ShieldCheckIcon } from '../components/Icons';

interface LandingPageProps {
    navigate: (path: string, options?: { replace?: boolean }) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col justify-center items-center p-6 font-sans">
            <main className="text-center max-w-3xl animate-fadeIn">
                <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
                    DilSe
                </h1>
                <TypingAnimation text="Kuch baatein sirf dil ke liye hoti hain..." />

                <p className="mt-8 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    A shared, anonymous space to release your deepest feelings, regrets, unsent letters, and secret hopes. A place to feel, not to be judged.
                </p>

                <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                        onClick={() => navigate('/auth?mode=login')}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        Enter the Archive (Login)
                    </button>
                    <button
                        onClick={() => navigate('/auth?mode=signup')}
                        className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-pink-500 text-pink-500 font-bold rounded-full hover:bg-pink-500 hover:text-white transform hover:scale-105 transition-all duration-300"
                    >
                        Join the Community (Sign Up)
                    </button>
                </div>
            </main>
            
            <section className="mt-20 max-w-4xl w-full animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                        <ShieldCheckIcon className="w-10 h-10 inline-block mb-3 text-violet-500"/>
                        <h4 className="text-lg font-semibold mb-2">Safe Anonymity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your stories are tied only to a nickname. No emails, no real names. Just your words.</p>
                    </div>
                     <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                        <UsersIcon className="w-10 h-10 inline-block mb-3 text-pink-500"/>
                        <h4 className="text-lg font-semibold mb-2">Empathetic Connection</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Engage with empathy. Reply to stories that touch you, creating threads of shared experience.</p>
                    </div>
                     <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                        <SparklesIcon className="w-10 h-10 inline-block mb-3 text-sky-500"/>
                        <h4 className="text-lg font-semibold mb-2">Pure Expression</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Filter by feeling, or shuffle to wander through the inner worlds of strangers, with AI-powered tagging.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
