import { useState } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Settings, Shield, Edit3, Trash2, ArrowDownToLine, ArrowUpToLine } from "lucide-react";

export function Profile({ user, updateUser }: { user: any, updateUser: (u: any) => void }) {
  const [showSettings, setShowSettings] = useState(false);
  
  const skillData = [
    { subject: 'Passing', A: 80, fullMark: 100 },
    { subject: 'Shooting', A: 65, fullMark: 100 },
    { subject: 'Dribbling', A: 75, fullMark: 100 },
    { subject: 'Pace', A: 85, fullMark: 100 },
    { subject: 'Physical', A: 60, fullMark: 100 },
    { subject: 'Defense', A: 40, fullMark: 100 },
  ];

  const xpPerLevel = 500;
  const currentXP = user.xp || 0;
  const currentLevel = Math.floor(currentXP / xpPerLevel) + 1;
  const xpInLevel = currentXP % xpPerLevel;
  const progressPercent = (xpInLevel / xpPerLevel) * 100;

  const handleReset = () => {
    if(confirm("Are you sure you want to reset all your offline progress? This cannot be undone.")) {
      updateUser({
        ...user,
        xp: 0,
        streak: 0,
        currentDay: 1,
        completedDays: []
      });
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "brother_fc_backup.json");
    dlAnchorElem.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loaded = JSON.parse(e.target?.result as string);
        if (loaded && loaded.id) {
          updateUser(loaded);
          alert("Progress loaded successfully!");
        }
      } catch(err) {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-zinc-800 border-2 border-[#00FF41] rounded flex items-center justify-center text-4xl font-black italic text-[#F0F0F0] shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter truncate">{user.name}</h1>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-1">Academy Player • Level {currentLevel}</p>
            <div className="mt-2 w-48 max-w-full">
              <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-1">
                <span>XP: {xpInLevel} / {xpPerLevel}</span>
                <span>Next: Lvl {currentLevel + 1}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00FF41] rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`border p-2 rounded-xl transition-colors ${showSettings ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800'}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="bg-zinc-900 border border-[#00FF41]/30 rounded-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
          <h3 className="font-black italic uppercase tracking-tighter text-xl mb-2 text-[#00FF41]">App Settings & Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={handleExport} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2">
              <ArrowDownToLine className="w-4 h-4" /> Export Backup
            </button>
            <div className="relative">
              <input type="file" accept=".json" onChange={handleImport} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                <ArrowUpToLine className="w-4 h-4" /> Import Backup
              </button>
            </div>
            <button onClick={handleReset} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-red-500/20">
              <Trash2 className="w-4 h-4" /> Reset Progress
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 italic mt-2 uppercase tracking-tight">Note: Export your data frequently. Resetting will permanently wipe your offline tracker history.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart: Skills */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 relative">
           <button className="absolute right-4 top-4 text-zinc-500 hover:text-[#00FF41]">
             <Edit3 className="w-4 h-4" />
           </button>
           <h3 className="font-black italic uppercase tracking-tighter text-2xl mb-4 text-center">Technical Radar</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }} />
                  <Radar name="Skills" dataKey="A" stroke="#00FF41" fill="#00FF41" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Info Grid */}
        <div className="flex flex-col gap-4">
           {/* ... leave alone */}
           <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Physical Stats</h4>
             <p className="font-black italic uppercase tracking-tighter text-xl">Height: 180cm • Weight: 72kg</p>
           </div>
           
           <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Dominant Foot</h4>
             <p className="font-black italic uppercase tracking-tighter text-xl">Right</p>
           </div>

           <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Current Goal</h4>
             <p className="font-black italic uppercase tracking-tighter text-xl">Improve Match Stamina & Final Third Passing</p>
           </div>
           
           <div className="mt-auto bg-zinc-900/50 border border-[#00FF41]/20 rounded-2xl p-5 flex items-start gap-4">
             <Shield className="w-6 h-6 text-[#00FF41] shrink-0" />
             <p className="text-sm font-bold uppercase italic tracking-tight text-zinc-300">
               "Great passing technique, but we need to see more intensity off the ball." <br/>
               <span className="text-[#00FF41] font-bold uppercase tracking-widest text-[10px] mt-2 block">- Coach Virtual Notes</span>
             </p>
           </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 mt-4">
        <h3 className="font-black italic uppercase tracking-tighter text-2xl mb-4 border-b border-white/10 pb-2">Training History Log</h3>
        {(!user.completedDays || user.completedDays.length === 0) ? (
          <p className="text-sm text-zinc-500 italic font-bold">No history available locally yet. Go train!</p>
        ) : (
          <div className="flex flex-col gap-3">
            {user.completedDays.map((log: any, idx: number) => (
              <div key={idx} className="bg-[#050505] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-[#00FF41] font-bold uppercase tracking-widest text-xs">Day {log.day}</h4>
                  <p className="text-zinc-300 font-bold text-sm mt-1">{new Date(log.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Drills Completed</p>
                   <p className="text-xl font-black italic">{Object.keys(log.drillsCompleted).length}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
