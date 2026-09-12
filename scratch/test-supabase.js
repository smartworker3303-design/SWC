const https = require('https');

const url = 'https://gshjsocoqmazijlpiaos.supabase.co/rest/v1/products?select=*&order=id';
const options = {
  headers: {
    'apikey': 'sb_publishable_ufnsjXxQi6p6gvWZEfg30Q_QEyd66V6',
    'Authorization': 'Bearer sb_publishable_ufnsjXxQi6p6gvWZEfg30Q_QEyd66V6'
  }
};

const startTime = Date.now();
https.get(url, options, (res) => {
  let dataSize = 0;
  res.on('data', (chunk) => {
    dataSize += chunk.length;
  });
  res.on('end', () => {
    const timeTaken = Date.now() - startTime;
    console.log(`Total payload size: ${(dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Time taken: ${timeTaken} ms`);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
