const https = require('https');
const fs = require('fs');
https.get('https://coverr.co/videos/a-close-up-of-a-watch-on-a-wrist-8041', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = data.match(/https:\/\/[^\"]+\.mp4/g);
    if (urls && urls.length > 0) {
      console.log('Downloading', urls[0]);
      const file = fs.createWriteStream('./public/videos/watch-bg.mp4');
      
      // Ensure directory exists
      if (!fs.existsSync('./public/videos')) {
        fs.mkdirSync('./public/videos', { recursive: true });
      }

      https.get(urls[0], response => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Download completed');
        });
      });
    } else {
      console.log('No mp4 found');
    }
  });
});
