const axios = require('axios');

module.exports = {
    name: 'instagram',
    alias: ['ig', 'reels', 'igdl'],
    category: 'downloader',
    async exec({ sock, m, args }) {
        try {
            const url = args[0];
            if (!url || !url.includes('instagram.com')) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ URL Instagram tidak valid.' }, { quoted: m });
            }

            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });

            let response;
            try {
                response = await axios.get('https://api.neoxr.eu/api/ig-fetch', {
                    params: {
                        url,
                        apikey: 'UCIELL'
                    },
                    timeout: 15000
                });
            } catch (err) {
                console.error('⛔ IG-Fetch API error:', err.code || err.message);
                return sock.sendMessage(m.key.remoteJid, {
                    text: `❌ Gagal mengambil data dari Instagram.\nAlasan: ${err.code || 'Network error'}`,
                }, { quoted: m });
            }

            const result = response.data;

            if (!result.status || !Array.isArray(result.data) || result.data.length === 0) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ Media tidak ditemukan atau tidak bisa diakses.' }, { quoted: m });
            }

            for (let item of result.data) {
                if (!item.url || !item.type) continue;

                const message = item.type === 'video'
                ? {
                    video: { url: item.url },
                    caption: '🎥 Video dari Instagram.'
                }
                : {
                    image: { url: item.url },
                    caption: '📸 Gambar dari Instagram.'
                };

                await sock.sendMessage(m.key.remoteJid, message, { quoted: m });
            }

        } catch (err) {
            console.error('Instagram IG-Fetch Error:', err);
            return sock.sendMessage(m.key.remoteJid, {
                text: `❌ Terjadi kesalahan saat mengunduh konten.\nDetail: ${err?.message || 'Unknown error'}`,
            }, { quoted: m });
        }
    }
};
