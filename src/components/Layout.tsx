import { Outlet, NavLink } from "react-router-dom";
import { Home, Dumbbell, Activity, User, LogOut, Download } from "lucide-react";
import { cn } from "../lib/utils";
import appLogo from '@/assets/.aistudio/Gemini_Generated_Image_a3g087a3g087a3g0.png';
import { useState, useEffect } from "react";

export function Layout({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("Please install from your browser menu (Add to Home Screen) as the app is already supported or installed.");
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Training", path: "/training", icon: Dumbbell },
    { name: "Analysis", path: "/analysis", icon: Activity },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050505]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0a0a0a] p-4 sticky top-0 h-screen">
        <div className="flex-1 flex flex-col gap-8">
          <div className="px-2 flex flex-col gap-3">
             <img src={appLogo} alt="Logo" className="w-12 h-12 object-contain rounded-full shadow-[0_0_15px_rgba(0,255,65,0.2)]" />
            <h1 className="font-black italic uppercase tracking-tighter text-2xl leading-none">
              Brother FC app <br/><span className="text-[#00FF41] text-xs tracking-widest">Football mastery</span>
            </h1>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold uppercase tracking-widest text-xs",
                    isActive 
                      ? "bg-white/5 text-[#00FF41]" 
                      : "text-zinc-500 hover:bg-zinc-800 hover:text-[#F0F0F0]"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
            
            <button 
              onClick={handleInstallClick}
              className="mt-4 flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] hover:bg-[#00FF41]/20 font-bold uppercase tracking-widest text-[10px]"
            >
              <Download className="w-6 h-6" />
              Download APK (App)
            </button>
          </nav>
        </div>
        <div className="pt-4 border-t border-white/10 flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#F0F0F0]">{user.name}</span>
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Lvl {user.level || 1} • {user.xp} XP</span>
          </div>
          <button onClick={onLogout} className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-8">
        {/* Mobile Header (Ad Placeholders later) */}
        <div className="md:hidden flex items-center justify-between mb-6 pt-2">
          <h1 className="font-black italic uppercase tracking-tighter text-xl flex items-center gap-2">
            <img src={appLogo} alt="Logo" className="w-8 h-8 object-contain rounded-full shadow-[0_0_10px_rgba(0,255,65,0.2)]" />
            <span>Brother FC</span>
          </h1>
          <div className="flex items-center gap-3">
             <button onClick={handleInstallClick} className="p-2 bg-[#00FF41]/10 rounded-full text-[#00FF41]">
               <Download className="w-4 h-4" />
             </button>
             <div className="bg-zinc-900 border border-white/5 px-3 py-1 rounded-full text-xs font-bold"><span className="text-[#00FF41]">🔥 {user.streak}</span> Days</div>
          </div>
        </div>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-zinc-950/90 backdrop-blur-lg pb-safe">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-lg transition-all",
                  isActive ? "text-[#00FF41]" : "text-zinc-500 hover:text-zinc-300"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-6 h-6", isActive && "text-[#00FF41]")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
