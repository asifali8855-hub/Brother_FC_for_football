import https from 'https';
https.get('https://html.duckduckgo.com/html/?q=site:youtube.com+football+dribbling', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const matches = body.match(/v%3D([A-Za-z0-9_-]{11})/g);
    if(matches) console.log("Dribbling IDs:", [...new Set(matches.map(m=>m.slice(4)))]);
  });
});
https.get('https://html.duckduckgo.com/html/?q=site:youtube.com+football+tactics', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const matches = body.match(/v%3D([A-Za-z0-9_-]{11})/g);
    if(matches) console.log("Tactics IDs:", [...new Set(matches.map(m=>m.slice(4)))]);
  });
});
https.get('https://html.duckduckgo.com/html/?q=site:youtube.com+football+defending', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const matches = body.match(/v%3D([A-Za-z0-9_-]{11})/g);
    if(matches) console.log("Defending IDs:", [...new Set(matches.map(m=>m.slice(4)))]);
  });
});
