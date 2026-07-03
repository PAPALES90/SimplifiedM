const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// index.html'i sunmak için
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Birisi bağlandı');
  socket.on('mesaj', (veri) => {
    io.emit('mesaj', veri);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Sunucu ayakta!'));