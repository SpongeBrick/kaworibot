const fetch = require('node-fetch');

module.exports = {
    name: 'fb',
    alias: ['facebook'],
    category: 'downloader',
    desc: 'Download video dari Facebook',

    async exec({ sock, m, args }) {
        if (!args[0]) return sock.sendMessage(m.key.remoteJid, { text: '🚫 Masukkan link Facebook yang valid!' }, { quoted: m });

        const url = args[0];
        const apikey = 'UCIELL'; // ganti kalau kamu punya sendiri
        const api = `https://api.neoxr.eu/api/fb?url=${encodeURIComponent(url)}&apikey=${apikey}`;

        try {
            const res = await fetch(api);
            const json = await res.json();

            if (!json.status || !json.data || json.data.length === 0) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ Gagal mendapatkan video. Pastikan link valid dan publik.' }, { quoted: m });
            }

            // Ambil kualitas HD jika tersedia, kalau tidak fallback ke SD
            const video = json.data.find(v => v.quality === 'HD') || json.data[0];

            await sock.sendMessage(m.key.remoteJid, {
                video: { url: video.url },
                caption: `🎬 Facebook Video (${video.quality})`
            }, { quoted: m });

        } catch (err) {
            console.error('FB Plugin Error:', err);
            sock.sendMessage(m.key.remoteJid, { text: '🚫 Terjadi kesalahan saat mengunduh video.' }, { quoted: m });
        }
    }
};
