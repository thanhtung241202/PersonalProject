import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import IndexPage from './pages/IndexPage';
import AboutPage from './pages/AboutPage'; 
import ComparePage from './pages/ComparePage';
import PredictPage from './pages/PredictPage';
import LoginPage from './pages/Login';
import { useAuth } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  const [page, setPage] = useState('home');
  
  const { user, isAuthenticated } = useAuth(); 

  return (
    <div className="min-h-screen bg-[#111111] text-gray-100 font-sans flex flex-col">
      <Header currentPage={page} onNavigate={setPage} />
      <main className="flex-1 w-full">
        {page === 'home' && <IndexPage />}
        {page === 'about' && <AboutPage />}
        {page === 'compare' && <ComparePage />}
        {page === 'predict' && <PredictPage/>}
        
        {page === 'profile' && (
          isAuthenticated ? (
            <ProfilePage user={user} />
          ) : (
            <LoginPage />
          )
        )}
      </main>
      <Footer />
    </div>
  );
};
export default App;