import https from 'https';
const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Safari/537.36' } };
https.get('https://html.duckduckgo.com/html/?q=site:youtube.com+football+tactics', opts, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const matches = body.match(/v%3D([A-Za-z0-9_-]{11})/g);
    if(matches) console.log("Tactics IDs:", [...new Set(matches.map(m=>m.slice(4)))]);
  });
});
