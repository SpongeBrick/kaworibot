const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFileSync } = require('fs');

module.exports = {
    name: 'toimg',
    cmd: ['toimg'],
    tags: 'tools',
    desc: 'Mengubah stiker menjadi gambar',
    async run({ sock, m }) {
        // Helper untuk mengirim pesan aman
        async function safeSendMessage(chatId, content, options = {}) {
            try {
                if (!chatId) throw new Error('chatId kosong!');
                return await sock.sendMessage(chatId, content, options);
            } catch (err) {
                console.error('❌ safeSendMessage error:', err);
            }
        }

        // Pastikan reply stiker
        if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
            return await safeSendMessage(m.chat, { text: '❗ Balas stiker dengan perintah /toimg untuk mengubahnya menjadi gambar.' }, { quoted: m });
        }

        try {
            const media = await downloadMediaMessage(m.quoted, 'buffer', {}, { logger: console });
            if (!media) throw new Error('Media gagal diunduh.');

            const filename = `./temp/${Date.now()}.png`;
            writeFileSync(filename, media);

            await sock.sendMessage(m.chat, {
                image: fs.readFileSync(filename),
                                   caption: '✅ Stiker berhasil diubah menjadi gambar!',
            }, { quoted: m });

            fs.unlinkSync(filename);
        } catch (err) {
            console.error('❌ Gagal mengubah stiker:', err);
            await safeSendMessage(m.chat, { text: '⚠️ Terjadi kesalahan saat mengubah stiker ke gambar.' }, { quoted: m });
        }
    }
};
