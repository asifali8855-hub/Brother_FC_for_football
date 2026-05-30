import { useState, useEffect } from "react";
import { CheckCircle, Circle, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDailyPlan } from "../lib/courseData";

export function TrainingSession({ user, updateUser }: { user: any, updateUser: (u: any) => void }) {
  const [session, setSession] = useState<any>(null);
  const [completedDrills, setCompletedDrills] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [expandedDrill, setExpandedDrill] = useState<string | null>(null);

  useEffect(() => {
    setSession(getDailyPlan(user.currentDay || 1));
  }, [user.currentDay]);

  const toggleDrill = (key: string) => {
    setCompletedDrills(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!session) {
    return <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading today's pitch...</div>;
  }

  const drills = [
    { id: "warmup", type: "Warm-Up", data: session.warmup },
    { id: "skill", type: "Individual Skill", data: session.skill },
    { id: "tactical", type: "Tactics", data: session.tactical },
    { id: "match", type: "Match Practice", data: session.match },
    { id: "fitness", type: "Fitness", data: session.fitness },
    { id: "recovery", type: "Recovery", data: session.recovery },
    { id: "mental", type: "Mental Prep", data: session.mental },
  ];

  const progress = Math.round((Object.values(completedDrills).filter(Boolean).length / drills.length) * 100);

  const playWhistle = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Ignored if not supported
    }
  };

  const handleCompleteDay = async () => {
    if (progress < 100 || submitting) return;
    setSubmitting(true);
    playWhistle();
    
    const newUser = {
      ...user,
      currentDay: (user.currentDay || 1) + 1,
      xp: (user.xp || 0) + 100,
      streak: (user.streak || 0) + 1,
      completedDays: [...(user.completedDays || []), {
        day: session.day,
        date: new Date().toISOString(),
        drillsCompleted: completedDrills
      }]
    };
    
    // Slight timeout for effect
    setTimeout(async () => {
      // Optimistic local update for offline
      updateUser(newUser);
      setCompletedDrills({});
      navigate('/');
      
      try {
        await fetch('/api/training/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            day: session.day,
            drills: completedDrills
          })
        });
      } catch (e) {
        console.log('Offline: sync deferred');
      } finally {
        setSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-10">
      
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Day <span className="text-[#00FF41]">{session.day}</span></h1>
        
        {/* Progress Bar */}
        <div className="w-full bg-zinc-900 rounded-full h-3 border border-white/5 overflow-hidden">
          <div 
            className="bg-[#00FF41] h-full transition-all duration-500 rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <p className="text-right text-xs text-zinc-400 font-bold uppercase tracking-widest">{progress}% Complete</p>
      </div>

      <div className="flex flex-col gap-4">
        {drills.map((drill) => (
          <div key={drill.id} className="flex flex-col border border-white/5 rounded-xl overflow-hidden bg-zinc-900/50">
            <button 
              onClick={() => setExpandedDrill(expandedDrill === drill.id ? null : drill.id)}
              className="w-full text-left hover:bg-zinc-900 transition-colors p-4 md:p-6 flex items-center justify-between group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#00FF41] mb-1">{drill.type}</span>
                <span className="text-xl font-bold uppercase italic text-[#F0F0F0]">{drill.data.title}</span>
                <span className="text-xs font-mono text-zinc-500 mt-1">{drill.data.duration}</span>
              </div>
              <div 
                className="p-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDrill(drill.id);
                }}
              >
                {completedDrills[drill.id] ? (
                  <CheckCircle className="w-8 h-8 text-[#00FF41] transition-transform scale-110" />
                ) : (
                  <Circle className="w-8 h-8 text-zinc-600 hover:text-zinc-400" />
                )}
              </div>
            </button>
            
            {expandedDrill === drill.id && drill.data.videoUrl && (
              <div className="p-4 pt-0 border-t border-white/5 bg-zinc-950/50">
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/5">
                  <iframe
                    src={drill.data.videoUrl}
                    title={drill.data.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {session.urduLesson && (
        <div className="mt-8 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-xl p-6 text-right" dir="rtl">
          <h2 className="text-xl font-bold text-[#00FF41] mb-3 font-sans">
            آج کا سبق: {session.urduLesson.title}
          </h2>
          <p className="text-[#F0F0F0] leading-relaxed text-lg font-sans">
            {session.urduLesson.content}
          </p>
        </div>
      )}

      {/* Gone: Embedded Video Section */}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCompleteDay}
          disabled={progress < 100 || submitting}
          className="bg-[#00FF41] text-black font-black italic uppercase tracking-wider py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
        >
          {submitting ? "Processing..." : `Complete Day ${session.day} & Proceed`}
        </button>
      </div>

       {/* Ad Placeholder Feed */}
      <div className="w-full bg-zinc-900 border border-white/5 rounded-xl h-24 flex flex-col items-center justify-center text-zinc-600 text-sm mt-4 font-bold uppercase tracking-widest">
        <span>[Ad Placeholder: Interstitial]</span>
        <span className="text-[8px] opacity-50 mt-1">Appears when training completes</span>
      </div>

    </div>
  );
}
