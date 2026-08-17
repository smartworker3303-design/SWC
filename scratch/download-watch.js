const https = require('https');
const fs = require('fs');

if (!fs.existsSync('./public/videos')) {
  fs.mkdirSync('./public/videos', { recursive: true });
}

const file = fs.createWriteStream('./public/videos/watch-bg.mp4');
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': 'https://www.pexels.com/'
  }
};

const url = 'https://videos.pexels.com/video-files/10728498/10728498-hd_1920_1080_30fps.mp4';

function download(urlToFetch) {
  https.get(urlToFetch, options, response => {
    if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
      console.log('Redirecting to:', response.headers.location);
      download(response.headers.location);
    } else if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download complete');
      });
    } else {
      console.log('Error:', response.statusCode);
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => console.log(data));
    }
  }).on('error', err => {
    console.log('Network error:', err);
  });
}

download(url);
