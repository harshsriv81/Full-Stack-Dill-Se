// import React, { useState, useEffect } from 'react';
// import { AuthData } from '../types';
// import * as apiService from '../services/apiService';
// import { HomeIcon } from '../components/Icons';

// interface AuthPageProps {
//   onLogin: (authData: AuthData) => void;
//   navigate: (path: string, options?: { replace?: boolean }) => void;
//   initialMode: 'login' | 'signup';
// }

// const AuthPage: React.FC<AuthPageProps> = ({
//   onLogin,
//   navigate,
//   initialMode,
// }) => {
//   // 🔥 SOURCE OF TRUTH = URL (initialMode)
//   const [isLogin, setIsLogin] = useState(initialMode === 'login');
//   const [nickname, setNickname] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ✅ KEEP STATE SYNCED WITH URL
//   useEffect(() => {
//     setIsLogin(initialMode === 'login');
//     setError('');
//   }, [initialMode]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!nickname.trim() || !password) {
//       setError('Nickname and password cannot be empty.');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const authFn = isLogin ? apiService.login : apiService.signup;
//       const data = await authFn({ nickname, password });
//       onLogin(data);
//     } catch (err: any) {
//       setError(err.message || `Failed to ${isLogin ? 'log in' : 'sign up'}.`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ ONLY CHANGE URL — STATE WILL AUTO SYNC
//   const toggleMode = () => {
//     const nextMode = isLogin ? 'signup' : 'login';
//     navigate(`/auth?mode=${nextMode}`, { replace: true });
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative animate-fadeIn">
//       <button
//         onClick={() => navigate('/')}
//         className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-violet-500 transition"
//       >
//         <HomeIcon className="w-5 h-5" />
//         <span>Back to Home</span>
//       </button>

//       <div className="text-center mb-8">
//         <h1
//           className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 cursor-pointer"
//           onClick={() => navigate('/')}
//         >
//           DilSe
//         </h1>
//       </div>

//       <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//         <h2 className="text-2xl font-bold text-center mb-2">
//           {isLogin ? 'Welcome Back' : 'Join the Community'}
//         </h2>

//         <p className="text-center text-gray-500 mb-6">
//           {isLogin
//             ? 'Log in to continue your journey.'
//             : 'Create an account to share your story.'}
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium">Nickname</label>
//             <input
//               type="text"
//               value={nickname}
//               onChange={(e) => setNickname(e.target.value)}
//               required
//               className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:border-violet-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:border-violet-500"
//             />
//           </div>

//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:scale-105 transition disabled:opacity-50"
//           >
//             {isLoading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm">
//           {isLogin ? "Don't have an account? " : 'Already have an account? '}
//           <button
//             onClick={toggleMode}
//             className="font-medium text-violet-600 hover:underline"
//           >
//             {isLogin ? 'Sign up' : 'Log in'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
import React, { useState } from "react";
import { api } from "../lib/api";
import { AuthData } from "../types";

interface Props {
  onLogin: (auth: AuthData) => void;
  navigate: (path: string, opts?: { replace?: boolean }) => void;
  initialMode: "login" | "signup";
}

const AuthPage: React.FC<Props> = ({ onLogin, navigate, initialMode }) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      const endpoint = mode === "signup" ? "/signup" : "/login";

      const { data } = await api.post(endpoint, {
        nickname,
        password,
      });

      if (!data.success) {
        setError(data.message || "Something went wrong");
        return;
      }

      onLogin(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Server not reachable. Check backend URL."
      );
    }
  };

  return (
    <div className="auth-box">
      <h2>{mode === "signup" ? "Join the Community" : "Welcome Back"}</h2>

      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button onClick={handleSubmit}>
        {mode === "signup" ? "Sign Up" : "Log In"}
      </button>

      <p
        onClick={() => {
          const next = mode === "signup" ? "login" : "signup";
          setMode(next);
          navigate(`/auth?mode=${next}`);
        }}
      >
        {mode === "signup"
          ? "Already have an account? Log in"
          : "New here? Sign up"}
      </p>
    </div>
  );
};

export default AuthPage;
