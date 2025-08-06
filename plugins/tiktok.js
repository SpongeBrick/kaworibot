const axios = require('axios');

module.exports = {
    name: 'tiktok',
    alias: ['tt', 'tikmp3', 'tikwm'],
    category: 'downloader',
    async exec({ sock, m, args, text, command }) {
        try {
            if (!args[0]) {
                return sock.sendMessage(m.key.remoteJid, { text: '⚠️ Example: /tiktok https://www.tiktok.com/@username/video/12345' }, { quoted: m });
            }

            const url = args[0];
            if (!url.includes('tiktok.com')) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ Invalid TikTok URL.' }, { quoted: m });
            }

            // Send waiting message with ⏳ emoji
            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });

            const response = await axios.get('https://api.neoxr.eu/api/tiktok', {
                params: {
                    url,
                    apikey: 'UCIELL' // Ganti sesuai kebutuhan
                }
            });

            const data = response.data;

            if (!data.status || !data.data?.video) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ Failed to fetch TikTok video.' }, { quoted: m });
            }

            const title = data.data.title || 'TikTok Video';

            const sendVideo = (link) => sock.sendMessage(m.key.remoteJid, {
                video: { url: link },
                caption: `🎬 *${title}*\nHere's your TikTok video! 🎉`,
            }, { quoted: m });

            const sendAudio = (link) => sock.sendMessage(m.key.remoteJid, {
                audio: { url: link },
                mimetype: 'audio/mp4',
                ptt: false
            }, { quoted: m });

            if (command === 'tiktok' || command === 'tt') {
                return sendVideo(data.data.video);
            } else if (command === 'tikwm') {
                return sendVideo(data.data.videoWM);
            } else if (command === 'tikmp3') {
                if (!data.data.audio) {
                    return sock.sendMessage(m.key.remoteJid, { text: '❌ Audio not available.' }, { quoted: m });
                }
                return sendAudio(data.data.audio);
            }
        } catch (error) {
            console.error('TikTok Plugin Error:', error);
            return sock.sendMessage(m.key.remoteJid, { text: `❌ Failed to fetch video.\nReason: ${error?.message || 'Unknown error'}` }, { quoted: m });
        }
    }
};
