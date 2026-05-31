import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Activity, Zap, LogOut, Menu, X } from 'lucide-react';

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  streak: number;
  currentDay?: number;
  level?: number;
  completedDays?: any[];
}

interface DailyTraining {
  day: number;
  warmup: { title: string; duration: string };
  skill: { title: string; duration: string };
  tactical: { title: string; duration: string };
  match: { title: string; duration: string };
  fitness: { title: string; duration: string };
  recovery: { title: string; duration: string };
  quote: string;
  videos: Array<{ category: string; title: string; url: string }>;
}

// Login Component
function Login({ onLogin }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isLogin
            ? { email, password }
            : { email, password, name }
        ),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Authentication failed');
      }

      const data = await response.json();
      onLogin(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-8">
          <h1 className="text-3xl font-black text-[#00FF41] mb-2 text-center">Brother FC</h1>
          <p className="text-center text-[#A0A0A0] mb-8">Football Mastery</p>

          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050505] border border-[#00FF41]/30 rounded-lg px-4 py-2 text-[#F0F0F0] focus:outline-none focus:border-[#00FF41] placeholder-[#666]"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050505] border border-[#00FF41]/30 rounded-lg px-4 py-2 text-[#F0F0F0] focus:outline-none focus:border-[#00FF41] placeholder-[#666]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050505] border border-[#00FF41]/30 rounded-lg px-4 py-2 text-[#F0F0F0] focus:outline-none focus:border-[#00FF41] placeholder-[#666]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF41] text-[#050505] font-bold py-2 rounded-lg hover:bg-[#00FF41]/90 disabled:opacity-50 transition"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#00FF41] hover:underline text-sm"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#00FF41] mb-4">Welcome, {user.name}! 🎯</h1>
          <p className="text-[#A0A0A0]">Your Football Mastery Journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
            <p className="text-[#A0A0A0] text-sm mb-2">Current Level</p>
            <p className="text-3xl font-bold text-[#00FF41]">{user.level || 1}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
            <p className="text-[#A0A0A0] text-sm mb-2">Total XP</p>
            <p className="text-3xl font-bold text-[#00FF41]">{user.xp || 0}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
            <p className="text-[#A0A0A0] text-sm mb-2">Current Streak</p>
            <p className="text-3xl font-bold text-[#00FF41]">{user.streak || 0}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
            <p className="text-[#A0A0A0] text-sm mb-2">Days Completed</p>
            <p className="text-3xl font-bold text-[#00FF41]">{user.completedDays?.length || 0}</p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#00FF41] mb-4">Community Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">Total Users</span>
                  <span className="text-[#00FF41] font-bold">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">Active Today</span>
                  <span className="text-[#00FF41] font-bold">{stats.activeToday}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#00FF41] mb-4">Next Challenge</h2>
              <p className="text-[#A0A0A0]">Day {user.currentDay || 1}</p>
              <p className="text-sm text-[#666] mt-2">Keep your streak alive! Complete today's training.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Training Session Component
function TrainingSession({ user, updateUser }: any) {
  const [training, setTraining] = useState<DailyTraining | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/training/daily?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to load training');
        const data = await response.json();
        setTraining(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load training');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchTraining();
  }, [user]);

  const handleCompleteTraining = async () => {
    try {
      const response = await fetch('/api/training/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          day: training?.day || 1,
          drills: ['warmup', 'skill', 'tactical', 'match', 'fitness', 'recovery'],
        }),
      });

      if (!response.ok) throw new Error('Failed to complete training');
      const updatedUser = await response.json();
      updateUser(updatedUser.user);
      setCompleted(true);
      setTimeout(() => setCompleted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete training');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF41]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 flex items-center gap-4">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-500">Error</h3>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!training) return null;

  const phases = [
    { icon: Activity, label: 'Warmup', data: training.warmup },
    { icon: Zap, label: 'Skill', data: training.skill },
    { icon: Activity, label: 'Tactical', data: training.tactical },
    { icon: Zap, label: 'Match', data: training.match },
    { icon: Activity, label: 'Fitness', data: training.fitness },
    { icon: Activity, label: 'Recovery', data: training.recovery },
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#00FF41] mb-2">Day {training.day} Training</h1>
          <p className="text-[#A0A0A0]">{training.quote}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {phases.map(({ icon: Icon, label, data }, idx) => (
            <div key={idx} className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-4 hover:border-[#00FF41]/50 transition">
              <div className="flex items-center gap-3 mb-3">
                <Icon size={20} className="text-[#00FF41]" />
                <h3 className="font-bold">{label}</h3>
              </div>
              <p className="text-sm text-[#A0A0A0] mb-2">{data.title}</p>
              <p className="text-xs text-[#00FF41]">⏱️ {data.duration}</p>
            </div>
          ))}
        </div>

        {training.videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#00FF41] mb-4">Training Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {training.videos.map((video, idx) => (
                <div key={idx} className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="200"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full"
                  ></iframe>
                  <div className="p-3">
                    <p className="text-xs text-[#00FF41] font-semibold">{video.category}</p>
                    <p className="text-sm font-semibold">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleCompleteTraining}
            className="flex-1 bg-[#00FF41] text-[#050505] font-bold py-3 rounded-lg hover:bg-[#00FF41]/90 transition flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            Complete Training
          </button>
        </div>

        {completed && (
          <div className="mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0" />
            <span className="text-green-200">Great job! Training completed! 🎉</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Profile Component
function Profile({ user, updateUser }: any) {
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/user/${user.id}/history`);
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF41]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-[#00FF41] mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#00FF41] mb-4">User Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[#A0A0A0] text-sm">Name</p>
                <p className="text-[#F0F0F0] font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-[#A0A0A0] text-sm">Email</p>
                <p className="text-[#F0F0F0] font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-[#A0A0A0] text-sm">Member Since</p>
                <p className="text-[#F0F0F0] font-semibold">
                  {new Date(history?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {history && (
            <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#00FF41] mb-4">Training Stats</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[#A0A0A0] text-sm">Total Logins</p>
                  <p className="text-2xl text-[#00FF41] font-bold">{history.totalLogins}</p>
                </div>
                <div>
                  <p className="text-[#A0A0A0] text-sm">Days Completed</p>
                  <p className="text-2xl text-[#00FF41] font-bold">{history.completedDays?.length || 0}</p>
                </div>
                <div>
                  <p className="text-[#A0A0A0] text-sm">Total XP</p>
                  <p className="text-2xl text-[#00FF41] font-bold">{history.totalXP}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {history?.loginHistory && (
          <div className="mt-8 bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#00FF41] mb-4">Recent Activity</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.loginHistory.slice(-10).reverse().map((login: string, idx: number) => (
                <div key={idx} className="text-[#A0A0A0] text-sm p-2 border-b border-[#00FF41]/10">
                  {new Date(login).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Match Analysis Component
function MatchAnalysis() {
  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-[#00FF41] mb-8">Match Analysis</h1>
        <div className="bg-[#1a1a1a] border border-[#00FF41]/20 rounded-lg p-8 text-center">
          <p className="text-[#A0A0A0]">Match analysis features coming soon! 🚀</p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateUser = (newUserData: User) => {
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
          <h1 className="font-black italic uppercase tracking-tighter text-4xl text-[#F0F0F0] text-center leading-none">
            Brother FC <br/><span className="text-[#00FF41]">Football mastery</span>
          </h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={(u: User) => {
      setUser(u);
      localStorage.setItem('fm180_user', JSON.stringify(u));
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F0F0F0] font-sans selection:bg-[#00FF41]/30">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#00FF41]/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-[#00FF41]">Brother FC</h1>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded-lg transition ${currentPage === 'dashboard' ? 'bg-[#00FF41] text-[#050505]' : 'text-[#A0A0A0] hover:text-[#00FF41]'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('training')}
              className={`px-4 py-2 rounded-lg transition ${currentPage === 'training' ? 'bg-[#00FF41] text-[#050505]' : 'text-[#A0A0A0] hover:text-[#00FF41]'}`}
            >
              Training
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              className={`px-4 py-2 rounded-lg transition ${currentPage === 'profile' ? 'bg-[#00FF41] text-[#050505]' : 'text-[#A0A0A0] hover:text-[#00FF41]'}`}
            >
              Profile
            </button>
            <button
              onClick={() => {
                setUser(null);
                localStorage.removeItem('fm180_user');
                setCurrentPage('dashboard');
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#00FF41]"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#00FF41]/20 p-4 space-y-2">
            <button
              onClick={() => { setCurrentPage('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${currentPage === 'dashboard' ? 'bg-[#00FF41] text-[#050505]' : 'text-[#A0A0A0] hover:text-[#00FF41]'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { setCurrentPage('training'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${currentPage === 'training' ? 'bg-[#00FF41] text-[#050505]' : 'text-[#A0A0A0] hover:text-[#00FF41]'}`}
            >
              Training
            </button>
            <button
              onClick={() => { setCurrentPage('profile'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${currentPage === 'profile' ? 'bg-[#00FF41] text-[#050505]' : 'text-[#A0A0A0] hover:text-[#00FF41]'}`}
            >
              Profile
            </button>
            <button
              onClick={() => {
                setUser(null);
                localStorage.removeItem('fm180_user');
                setCurrentPage('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {currentPage === 'dashboard' && <Dashboard user={user} />}
        {currentPage === 'training' && <TrainingSession user={user} updateUser={updateUser} />}
        {currentPage === 'profile' && <Profile user={user} updateUser={updateUser} />}
        {currentPage === 'analysis' && <MatchAnalysis />}
      </main>
    </div>
  );
}
