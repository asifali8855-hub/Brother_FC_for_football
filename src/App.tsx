import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TrainingSession } from './pages/TrainingSession';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { MatchAnalysis } from './pages/MatchAnalysis';
import appLogo from '@/assets/.aistudio/Gemini_Generated_Image_a3g087a3g087a3g0.png';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; email: string; xp: number; streak: number; currentDay?: number; level?: number; completedDays?: any[] } | null>(null);

  const updateUser = (newUserData: any) => {
    setUser(newUserData);
    localStorage.setItem('fm180_user', JSON.stringify(newUserData));
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('fm180_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center selection:bg-[#00FF41]/30">
        <div className="animate-pulse flex flex-col items-center">
          <img src={appLogo} alt="Logo" className="w-32 h-32 object-contain rounded-full shadow-[0_0_40px_rgba(0,255,65,0.3)] mb-6" />
          <h1 className="font-black italic uppercase tracking-tighter text-4xl text-[#F0F0F0] text-center leading-none">
            Brother FC app <br/><span className="text-[#00FF41]">Football mastery</span>
          </h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={(u) => {
          setUser(u);
          localStorage.setItem('fm180_user', JSON.stringify(u));
        }} />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F0F0F0] font-sans selection:bg-[#00FF41]/30">
      <Routes>
        <Route element={<Layout user={user} onLogout={() => {
          setUser(null);
          localStorage.removeItem('fm180_user');
        }} />}>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/training" element={<TrainingSession user={user} updateUser={updateUser} />} />
          <Route path="/analysis" element={<MatchAnalysis />} />
          <Route path="/profile" element={<Profile user={user} updateUser={updateUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
