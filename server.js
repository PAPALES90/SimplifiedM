const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Kullanıcıları tutacağımız liste
let aktifKullanicilar = {}; 

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => {
    // Kullanıcı bağlanınca ismini al
    socket.on('yeni-kullanici', (isim) => {
        aktifKullanicilar[socket.id] = isim;
        io.emit('kullanici-listesi', Object.values(aktifKullanicilar));
        io.emit('mesaj', `Sistem: ${isim} sohbete katıldı.`);
    });

    socket.on('mesaj', (veri) => { io.emit('mesaj', veri); });

    socket.on('disconnect', () => {
        const isim = aktifKullanicilar[socket.id];
        delete aktifKullanicilar[socket.id];
        io.emit('kullanici-listesi', Object.values(aktifKullanicilar));
        if(isim) io.emit('mesaj', `Sistem: ${isim} ayrıldı.`);
    });
});

http.listen(3000, () => console.log('Sunucu ayakta!'));
