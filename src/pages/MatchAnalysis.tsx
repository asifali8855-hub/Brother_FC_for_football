import { Search, MonitorPlay, BookOpen, X } from "lucide-react";
import { useState } from "react";

export function MatchAnalysis() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<{title: string, content: string} | null>(null);
  const [search, setSearch] = useState("");

  const topics = [
    { title: "Famous Football Systems", type: "Article", icon: BookOpen, tag: "Tactics", content: "A deep dive into 4-3-3, 4-2-3-1, and 3-5-2 systems." },
    { title: "Pressing Systems Explained", type: "Video", icon: MonitorPlay, tag: "Defense", url: "https://www.youtube-nocookie.com/embed/DLzB_wAI88M" },
    { title: "Position Responsibilities: #10", type: "Article", icon: BookOpen, tag: "Midfield", content: "The #10 orchestrates play. Creating space and key passes." },
    { title: "Transition Play: Defense to Attack", type: "Video", icon: MonitorPlay, tag: "Tactics", url: "https://www.youtube-nocookie.com/embed/ulf9H1S31Vw" },
    { title: "Set-piece Tutorials (Corners)", type: "Video", icon: MonitorPlay, tag: "Set-pieces", url: "https://www.youtube-nocookie.com/embed/JdXgO4Z4vsc" },
    { title: "Off-ball Movement Fundamentals", type: "Article", icon: BookOpen, tag: "Attack", content: "Movement off the ball is 90% of the game." },
    { title: "فٹ بال میں ڈریبلنگ کی اہمیت (Dribbling Info)", type: "Article", icon: BookOpen, tag: "Urdu Guide", content: "ڈریبلنگ فٹ بال میں ایک بہت اہم مہارت ہے۔ اس سے کھلاڑی گیند کو کنٹرول کر کے آگے بڑھ سکتا ہے اور مخالفین کو چکمہ دے سکتا ہے۔ اچھے ڈریبلر میچ کا رخ بدل سکتے ہیں۔" },
    { title: "ڈفینس کے بنیادی اصول (Defending Basics)", type: "Article", icon: BookOpen, tag: "Urdu Guide", content: "اچھے دفاع کے لیے پوزیشننگ بہت ضروری ہے۔ مخالف کھلاڑی کو جگہ نہ دیں اور گیند پر نظر رکھیں۔ صحیح وقت پر ٹیکل کرنا سیکھیں۔" },
    { title: "فٹ بال میں پاسنگ کی اہمیت (Passing Drill)", type: "Article", icon: BookOpen, tag: "Urdu Guide", content: "ایک اچھا پاس پوری ٹیم کی گیم کو بدل سکتا ہے۔ ہمیشہ اپنے ساتھی کھلاڑی کی پوزیشن کو دیکھیں اور درست انداز میں پاس دیں۔ مختصر اور لمبے دونوں پاسز کی پریکٹس کریں۔" },
    { title: "فٹنس اور سٹیمنا (Fitness & Stamina)", type: "Article", icon: BookOpen, tag: "Urdu Guide", content: "فٹ بال 90 منٹ کا کھیل ہے جس میں زیادہ تر وقت بھاگنا پڑتا ہے۔ کارڈیو اور سپرنٹس پر زور دیں تاکہ میچ کے آخری لمحات میں بھی آپ تھکاوٹ کا شکار نہ ہوں۔" },
  ];

  const filteredTopics = topics.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.tag.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Match Analysis</h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Increase your Football IQ with tactical breakdowns.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="SEARCH TOPICS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:border-[#00FF41] text-sm font-bold placeholder-zinc-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((t, i) => (
          <div 
            key={i} 
            className="bg-zinc-900/50 border border-white/5 hover:border-[#00FF41]/50 transition-colors p-5 rounded-2xl flex flex-col gap-4 cursor-pointer group"
            onClick={() => {
              if (t.type === "Video" && t.url) {
                setActiveVideo(t.url);
              } else if (t.type === "Article" && t.content) {
                setActiveArticle({ title: t.title, content: t.content });
              }
            }}
          >
             <div className="flex justify-between items-start">
               <div className="p-2 bg-zinc-800 rounded text-[#00FF41] group-hover:bg-[#00FF41]/20 transition-colors">
                  <t.icon className="w-5 h-5" />
               </div>
               <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                 {t.tag}
               </span>
             </div>
             <h3 className="font-bold text-lg uppercase italic tracking-tight text-[#F0F0F0] mt-2 leading-tight group-hover:text-[#00FF41] transition-colors">
               {t.title}
             </h3>
             <div className="mt-auto pt-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-500 border-t border-white/5">
               <span>{t.type}</span>
               <span>Read Time: 5m</span>
             </div>
          </div>
        ))}
      </div>

       <div className="w-full bg-zinc-900 border border-white/5 rounded-xl h-24 flex items-center justify-center text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-4">
        [Ad Placeholder: Native List View Ad]
      </div>

      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <button 
            onClick={() => setActiveArticle(null)}
            className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-2xl bg-zinc-900 rounded-xl overflow-hidden border-2 border-[#00FF41]/20 shadow-[0_0_30px_rgba(0,255,65,0.1)] p-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-6 text-[#00FF41]">{activeArticle.title}</h2>
            <p className="text-[#F0F0F0] text-lg leading-relaxed">{activeArticle.content}</p>
          </div>
        </div>
      )}

      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border-2 border-[#00FF41]/20 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
            <iframe
              src={activeVideo}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
