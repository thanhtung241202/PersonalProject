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
import RegisterPage from './pages/RegisterPage';

const App = () => {
  const [page, setPage] = useState('tracker');
  
  const { user, isAuthenticated } = useAuth(); 

  return (
    <div className="min-h-screen bg-[#111111] text-gray-100 font-sans flex flex-col">
      <Header currentPage={page} onNavigate={setPage} />
      <main className="flex-1 w-full">
        {page === 'tracker' && <IndexPage />}
        {page === 'about' && <AboutPage />}
        {page === 'compare' && (
          isAuthenticated ? (
            <ComparePage/>
          ) : (
            <LoginPage onNavigate={setPage}/>
          )
        )}
        {page === 'predict' && (
          isAuthenticated ? (
            <PredictPage/>
          ) : (
            <LoginPage onNavigate={setPage}/>
          )
        )}
        {page === 'register' && <RegisterPage onNavigate={setPage}/>}
        {page === 'profile' && (
          isAuthenticated ? (
            <ProfilePage user={user} />
          ) : (
            <LoginPage onNavigate={setPage}/>
          )
        )}
        {page === 'login' && <LoginPage onNavigate={setPage}/>}
      </main>
      <Footer />
    </div>
  );
};
export default App;