const http = require('https');

const data = '';
const req = http.get('https://nominatim.openstreetmap.org/reverse?format=json&lat=13.0418&lon=80.2341&addressdetails=1', {
  headers: { 'User-Agent': 'NodeTest' }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});
req.on('error', e => console.error(e));
