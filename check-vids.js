const https = require('https');
const vids = ['QZ0D6xUryR0', 'b1hI4g-R7vM', 'e1y9U85Cq0I', '1L6s5zXG0H4', '9xezb3QhK3M'];

vids.forEach(id => {
  https.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, (res)=>{
    let d='';
    res.on('data', c=>d+=c);
    res.on('end', ()=>console.log(id, d));
  });
});
