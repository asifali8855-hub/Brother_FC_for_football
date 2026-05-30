export function getDailyPlan(day: number) {
  // Pre-approved YouTube IDs for the categories (only VERIFIED WORKING videos)
  const warmupVids = ['sWjTnBmCHTY', 'ClEs4dzW2EA', 'tzOcnET9IBQ'];
  const skillVids = ['ClEs4dzW2EA', 'JdXgO4Z4vsc', '_uuqsGCiM9I', 'naEccnjzLxM', 'WpqzCxXguZ0', 'Fj3Jsn0Pa7c'];
  const tacticVids = ['Gi4ruPMJhp0', 'DLzB_wAI88M', 'ulf9H1S31Vw', 'Borf1ZVgwZk', '9X6o8romXzA', 'D6_ZQCqBly8'];
  const matchVids = ['LXb3EKWsInQ', 'Gi4ruPMJhp0'];
  const fitnessVids = ['WpqzCxXguZ0', 'naEccnjzLxM', 'sWjTnBmCHTY'];
  const recoveryVids = ['tzOcnET9IBQ', 'sWjTnBmCHTY'];
  const mentalVids = ['KXZaP0niM3g', 'tzOcnET9IBQ'];

  const vWarmup = warmupVids[(day - 1) % warmupVids.length];
  const vSkill = skillVids[(day - 1) % skillVids.length];
  const vTactic = tacticVids[(day - 1) % tacticVids.length];
  const vMatch = matchVids[(day - 1) % matchVids.length];
  const vFitness = fitnessVids[(day - 1) % fitnessVids.length];
  const vRecovery = recoveryVids[(day - 1) % recoveryVids.length];
  const vMental = mentalVids[(day - 1) % mentalVids.length];

  const focusSkillsArray = [
    "Ball Control & Close Touching",
    "Short Passing & Combinations",
    "Defensive Pressing Triggers",
    "Attacking Third Movement",
    "Endurance & High Intensity",
    "Mental Resilience & Focus",
    "Long Passing & Crossing",
    "1v1 Attacking Moves",
    "Match Play Application"
  ];
  const focusSkill = focusSkillsArray[(day - 1) % focusSkillsArray.length];

  // Urdu offline educational articles (rotated across 180 days)
  const urduLessons = [
    {
      title: "بنیادی اصول: بال کنٹرول (Ball Control Basics)",
      content: "بال کنٹرول فٹ بال کی سب سے اہم مہارت ہے۔ گیند کو اپنے پاؤں کے قریب رکھنا اور مخالف کھلاڑی سے محفوظ رکھنا ایک اچھے کھلاڑی کی نشانی ہے۔ آج کی مشق آپ کو یہ سکھائے گی کہ تیز دوڑتے ہوئے بھی گیند پر قابو کیسے پایا جائے۔"
    },
    {
      title: "پاسنگ کی اہمیت (The Importance of Passing)",
      content: "ایک میچ میں فرد واحد سب کچھ نہیں کر سکتا۔ اپنے ساتھی کھلاڑیوں کے ساتھ بہتر تال میل کے لیے درست اور تیز پاسنگ ضروری ہے۔ شارٹ پاسز سے ٹیم کا قبضہ برقرار رہتا ہے۔ جب آپ پاس دیں تو ہمیشہ اگلی پوزیشن کے لیے تیار رہیں۔"
    },
    {
      title: "دفاعی حکمت عملی (Defensive Tactics)",
      content: "اچھا دفاع حملے کی بہترین شروعات ہے۔ اپنی جگہ پر قائم رہیں، مخالف کو سوچنے کا موقع نہ دیں، اور گیند چھیننے کے لیے صحیح وقت کا انتظار کریں۔ جلد بازی میں ٹیکل کرنے سے گریز کریں۔"
    },
    {
      title: "جسمانی فٹنس اور برداشت (Fitness & Endurance)",
      content: "فٹ بال میں فٹنس کی بہت اہمیت ہے۔ 90 منٹ تک میدان میں دوڑنے کے لیے آپ کی کارڈیو بہت مضبوط ہونی چاہیے۔ سپرنٹنگ اور ریکوری کی مشقیں آپ کی صلاحیت کو بہتر بناتی ہیں۔"
    },
    {
      title: "گول اسکورنگ اور فنشنگ (Finishing & Scoring)",
      content: "پینلٹی باکس کے اندر سکون اور درستگی کی ضرورت ہوتی ہے۔ پاور سے زیادہ پلیسمنٹ پر توجہ دیں۔ ہمیشہ گول کیپر کی پوزیشن پر نظر رکھیں اور موقع ملتے ہی شوٹ کریں۔"
    },
    {
      title: "فلائیٹڈ پاسز اور کراسنگ (Crossing & Long Passes)",
      content: "ونگرز اور فل بیکس کے لیے کراسنگ بہت اہم ہے۔ گیند کو ہوا میں درست جگہ تک پہنچانے کے لیے پاؤں کے اوپری حصے کا استعمال کریں۔ اس سے آپ اپنے اسٹرائیکر کو گول کرنے کے بہترین مواقع فراہم کر سکتے ہیں۔"
    },
    {
      title: "فرسٹ ٹچ اور ریسیونگ (First Touch)",
      content: "دوڑتے وقت یا پاس وصول کرتے وقت آپ کا پہلا ٹچ فیصلہ کرتا ہے کہ آپ اگلی چال کیسے چلیں گے۔ اپنے جسم کی پوزیشن ایڈجسٹ کریں اور گیند کو فوراً قابو میں کرنے کی پریکٹس کریں۔"
    },
    {
      title: "ٹیم ورک اور کمیونیکیشن (Communication on Pitch)",
      content: "میدان میں اپنے ساتھیوں سے باقاعدہ بات چیت بہت ضروری ہے۔ اشاروں اور آواز کے ذریعے بتائیں کہ آپ پاس کے لیے تیار ہیں یا مخالف کھلاڑی قریب آ رہا ہے۔"
    },
    {
      title: "پری میچ روٹین (Pre-Match Preparation)",
      content: "میچ سے ایک دن پہلے اچھی نیند لیں اور ہلکی خوراک کھائیں۔ میچ سے پہلے مناسب وارم اپ اور اسٹریچنگ آپ کو انجری سے بچاسکتی ہے اور آپ کی کارکردگی میں نمایاں بہتری لاسکتی ہے۔"
    },
    {
      title: "ذہنی مضبوطی اور میچ کا دباؤ (Mental Toughness)",
      content: "بڑے میچوں میں دباؤ کا شکار ہو جانا عام بات ہے۔ لیکن بہترین کھلاڑی اپنے اعصاب پر قابو رکھتے ہیں۔ اپنی توجہ صرف کھیل پر رکھیں اور پچھلی غلطیوں کو بھول کر آگے بڑھیں۔"
    }
  ];

  const todayLesson = urduLessons[(day - 1) % urduLessons.length];

  // Progressive naming based on the day
  const phase = Math.ceil(day / 30); // 1-6 months
  const level = `Phase ${phase}`;

  return {
    day: day,
    focusSkill: focusSkill,
    warmup: { title: `Activation & Mobility - ${level}`, duration: "10 mins", videoUrl: `https://www.youtube-nocookie.com/embed/${vWarmup}` },
    skill: { title: `Technical Skill Protocol - Day ${day}`, duration: "15 mins", videoUrl: `https://www.youtube-nocookie.com/embed/${vSkill}` },
    tactical: { title: `Tactical Awareness Training - ${level}`, duration: "15 mins", videoUrl: `https://www.youtube-nocookie.com/embed/${vTactic}` },
    match: { title: `Match Scenarios / Shadow Play - Day ${day}`, duration: "20 mins", videoUrl: `https://www.youtube-nocookie.com/embed/${vMatch}` },
    fitness: { title: `Conditioning block - ${level}`, duration: "10 mins", videoUrl: `https://www.youtube-nocookie.com/embed/${vFitness}` },
    recovery: { title: "Regeneration & Stretching", duration: "10 mins", videoUrl: `https://www.youtube-nocookie.com/embed/${vRecovery}` },
    mental: { title: "Mental Visualization", duration: "10 mins", videoUrl: `https://www.youtube-nocookie.com/embed/${vMental}` },
    quote: `Consistency is the key. You are on Day ${day} out of 180. Keep grinding.`,
    urduLesson: todayLesson
  };
}
