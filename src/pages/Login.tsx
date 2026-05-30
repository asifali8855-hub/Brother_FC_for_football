import React, { useState, useEffect } from "react";
import appLogo from '@/assets/.aistudio/Gemini_Generated_Image_a3g087a3g087a3g0.png';

export function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{totalUsers: number, activeToday: number} | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const localKey = `fm180_profile_${email}`;
      
      let finalUser = null;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        finalUser = data.user;
        // Save for offline
        localStorage.setItem(localKey, JSON.stringify({ ...data.user, _pwd: password }));
      } catch (err: any) {
        // Fallback to offline
        console.log("Offline login attempt...");
        if (isRegister) {
          finalUser = { id: crypto.randomUUID(), name, email, xp: 0, streak: 0, currentDay: 1, completedDays: [] };
          localStorage.setItem(localKey, JSON.stringify({ ...finalUser, _pwd: password }));
        } else {
          const saved = localStorage.getItem(localKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed._pwd === password) {
               finalUser = parsed;
            } else {
               throw new Error("Invalid format/password offline");
            }
          } else {
            throw new Error("No offline profile found. Need internet to login.");
          }
        }
      }
      if (finalUser) {
        onLogin(finalUser);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-white/5 p-8 shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={appLogo} alt="Logo" className="w-20 h-20 object-contain rounded-full border-2 border-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.2)] mb-4" />
          <h1 className="font-black italic uppercase tracking-tighter text-4xl text-[#F0F0F0] mb-2 leading-none">
            Brother FC app <br/><span className="text-[#00FF41]">Football mastery</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-4">A product of emergency engineer products</p>
          {stats && (
            <div className="mt-4 flex gap-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
              <span className="bg-zinc-800 px-3 py-1 rounded">👥 Total Users: {stats.totalUsers}</span>
              <span className="bg-zinc-800 px-3 py-1 rounded text-[#00FF41]">🔥 Active Today: {stats.activeToday}</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00FF41] transition-colors text-[#F0F0F0] font-bold" 
                placeholder="LIONEL MESSI" 
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00FF41] transition-colors text-[#F0F0F0] font-bold" 
              placeholder="PLAYER@CLUB.COM" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00FF41] transition-colors text-[#F0F0F0] font-bold tracking-widest" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-[#00FF41] hover:opacity-80 text-black font-black italic uppercase tracking-wider py-3 rounded-xl mt-4 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : (isRegister ? "Join Academy" : "Enter Pitch")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-[#00FF41] transition-colors"
          >
            {isRegister ? "Already have an account? Login" : "New talent? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
