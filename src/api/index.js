const http = require('http')
const { router } = require('./routes/router')
const mongodbConnect = require('./utils/database').mongodbConnect

const PORT = process.env.PORT || 5500;

mongodbConnect(async () => {
    server.listen(PORT, () => console.log(`[server] Server running on port ${PORT}`))
})

const server = http.createServer((req, res) => {
    // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); 

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Add the allowed HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Add the allowed headers
    return res.end();
  }
        router(req, res)
})
