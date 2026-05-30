import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Flame, Trophy, TrendingUp } from "lucide-react";
import { getDailyPlan } from "../lib/courseData";

export function Dashboard({ user }: { user: any }) {
  const [dailyPlan, setDailyPlan] = useState<any>(null);

  const currentXP = user.xp || 0;
  const currentLevel = Math.floor(currentXP / 500) + 1;

  useEffect(() => {
    setDailyPlan(getDailyPlan(user.currentDay || 1));
  }, [user.currentDay]);

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto h-full">
      {/* Ad Placeholder Header */}
      <div className="w-full bg-zinc-900 border border-white/5 rounded-xl h-24 flex items-center justify-center text-zinc-600 text-sm font-bold uppercase tracking-widest">
        [Ad Placeholder: Banner]
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Welcome / Quote */}
          <div className="bg-zinc-900/50 border-2 border-dashed border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Welcome, <br/><span className="text-[#00FF41]">{user.name}</span></h2>
            <div className="flex flex-col gap-2 mb-6 mt-4">
               <div className="flex justify-between items-end">
                 <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Day <span className="text-[#00FF41]">{dailyPlan?.day || 1}</span> of 180</p>
                 {dailyPlan?.focusSkill && (
                   <p className="text-[#00FF41] font-bold uppercase tracking-widest text-[10px] bg-[#00FF41]/10 px-2 py-1 rounded">
                     ✦ Focus: {dailyPlan.focusSkill}
                   </p>
                 )}
               </div>
               <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                 <div 
                   className="bg-[#00FF41] h-full rounded-full" 
                   style={{ width: `${Math.min(100, Math.max(1, ((dailyPlan?.day || 1) / 180) * 100))}%` }}
                 ></div>
               </div>
            </div>
            {dailyPlan && (
              <>
                <div className="w-8 h-1 bg-[#00FF41] mb-4"></div>
                <blockquote className="text-zinc-300 italic text-sm md:text-base font-bold uppercase tracking-tight">
                  "{dailyPlan.quote}"
                </blockquote>
              </>
            )}
          </div>

          {/* Start Training CTA */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 ring-1 ring-[#00FF41]/20 shadow-[0_0_20px_rgba(0,255,65,0.05)]">
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-[#F0F0F0] mb-1">Today's Session</h3>
              <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Warm-up, Dribbling, Tactics & Recovery (~60 mins)</p>
            </div>
            <Link 
              to="/training" 
              className="w-full sm:w-auto px-8 py-3 bg-[#00FF41] hover:opacity-80 text-black font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Play fill="currentColor" className="w-4 h-4" /> Start
            </Link>
          </div>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col gap-4">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Current Streak</p>
              <p className="text-3xl font-black italic">{user.streak} <span className="text-sm">DAYS</span></p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Experience</p>
              <p className="text-3xl font-black italic">{user.xp} <span className="text-sm">XP</span></p>
            </div>
          </div>
           <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-[#00FF41]/10 border border-[#00FF41]/20 flex items-center justify-center text-[#00FF41]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Level</p>
              <p className="text-3xl font-black italic text-[#00FF41]">{currentLevel}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ad Placeholder Feed */}
      <div className="w-full bg-zinc-900 border border-white/5 rounded-xl h-32 flex items-center justify-center text-zinc-600 text-sm font-bold uppercase tracking-widest">
        [Ad Placeholder: Native Content]
      </div>
    </div>
  );
}
