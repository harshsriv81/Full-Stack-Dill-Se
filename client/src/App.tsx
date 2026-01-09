// import React, { useState, useEffect, useCallback } from 'react';
// import { AuthData } from './types';
// import LandingPage from './pages/LandingPage';
// import AuthPage from './pages/AuthPage';
// import ArchivePage from './pages/ArchivePage';

// const App: React.FC = () => {
//   const [auth, setAuth] = useState<AuthData | null>(null);
//   const [pathname, setPathname] = useState(window.location.pathname);
//   const [isInitializing, setIsInitializing] = useState(true);

//   // 🔹 Load auth from localStorage
//   useEffect(() => {
//     try {
//       const storedAuth = localStorage.getItem('auth');
//       if (storedAuth) {
//         setAuth(JSON.parse(storedAuth));
//       }
//     } catch {
//       localStorage.removeItem('auth');
//     }
//     setIsInitializing(false);
//   }, []);

//   // 🔹 Handle browser back / forward
//   useEffect(() => {
//     const onPopState = () => {
//       setPathname(window.location.pathname);
//     };
//     window.addEventListener('popstate', onPopState);
//     return () => window.removeEventListener('popstate', onPopState);
//   }, []);

//   // ✅ FIXED navigate (ONLY pathname stored)
//   const navigate = useCallback(
//     (path: string, options?: { replace?: boolean }) => {
//       if (options?.replace) {
//         window.history.replaceState({}, '', path);
//       } else {
//         window.history.pushState({}, '', path);
//       }

//       const url = new URL(path, window.location.origin);
//       setPathname(url.pathname); // 🔥 IMPORTANT FIX
//     },
//     []
//   );

//   const handleLogin = (authData: AuthData) => {
//     localStorage.setItem('auth', JSON.stringify(authData));
//     setAuth(authData);
//     navigate('/archive', { replace: true });
//   };

//   const handleLogout = useCallback(() => {
//     localStorage.removeItem('auth');
//     setAuth(null);
//     navigate('/', { replace: true });
//   }, [navigate]);

//   const renderPage = () => {
//     const params = new URLSearchParams(window.location.search);
//     const mode = params.get('mode');

//     switch (pathname) {
//       case '/archive':
//         if (!auth) {
//           navigate('/auth?mode=login', { replace: true });
//           return (
//             <AuthPage
//               onLogin={handleLogin}
//               navigate={navigate}
//               initialMode="login"
//             />
//           );
//         }
//         return <ArchivePage user={auth.user} onLogout={handleLogout} />;

//       case '/auth':
//         if (auth) {
//           navigate('/archive', { replace: true });
//           return <ArchivePage user={auth.user} onLogout={handleLogout} />;
//         }
//         return (
//           <AuthPage
//             onLogin={handleLogin}
//             navigate={navigate}
//             initialMode={mode === 'signup' ? 'signup' : 'login'}
//           />
//         );

//       case '/':
//       default:
//         if (auth) {
//           navigate('/archive', { replace: true });
//           return <ArchivePage user={auth.user} onLogout={handleLogout} />;
//         }
//         return <LandingPage navigate={navigate} />;
//     }
//   };

//   if (isInitializing) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="text-xl text-gray-500">Initializing...</div>
//       </div>
//     );
//   }

//   return renderPage();
// };

// export default App;
import React, { useState, useEffect, useCallback } from 'react';
import { AuthData } from './types';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ArchivePage from './pages/ArchivePage';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthData | null>(null);

  // 🔥 IMPORTANT: pathname + search dono track karo
  const [location, setLocation] = useState({
    pathname: window.location.pathname,
    search: window.location.search,
  });

  const [isInitializing, setIsInitializing] = useState(true);

  // 🔹 Load auth from localStorage
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
    } catch {
      localStorage.removeItem('auth');
    }
    setIsInitializing(false);
  }, []);

  // 🔹 Back / Forward support
  useEffect(() => {
    const onPopState = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // ✅ FINAL navigate (pathname + search update)
  const navigate = useCallback(
    (path: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }

      const url = new URL(path, window.location.origin);
      setLocation({
        pathname: url.pathname,
        search: url.search,
      });
    },
    []
  );

  const handleLogin = (authData: AuthData) => {
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
    navigate('/archive', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    navigate('/', { replace: true });
  };

  const renderPage = () => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode'); // login | signup

    switch (location.pathname) {
      case '/archive':
        if (!auth) {
          navigate('/auth?mode=login', { replace: true });
          return (
            <AuthPage
              onLogin={handleLogin}
              navigate={navigate}
              initialMode="login"
            />
          );
        }
        return <ArchivePage user={auth.user} onLogout={handleLogout} />;

      case '/auth':
        if (auth) {
          navigate('/archive', { replace: true });
          return <ArchivePage user={auth.user} onLogout={handleLogout} />;
        }
        return (
          <AuthPage
            onLogin={handleLogin}
            navigate={navigate}
            initialMode={mode === 'signup' ? 'signup' : 'login'}
          />
        );

      case '/':
      default:
        if (auth) {
          navigate('/archive', { replace: true });
          return <ArchivePage user={auth.user} onLogout={handleLogout} />;
        }
        return <LandingPage navigate={navigate} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Initializing...
      </div>
    );
  }

  return renderPage();
};

export default App;
