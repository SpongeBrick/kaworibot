const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
    name: 'sticker',
    alias: ['stiker', 's', 'stick', 'sticker'],
    category: 'media',
    async exec({ sock, m }) {
        let mediaMessage, mimeType;

        // Cek apakah membalas pesan media
        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedImage = quoted?.imageMessage;
        const quotedVideo = quoted?.videoMessage;

        if (quotedImage || quotedVideo) {
            mediaMessage = quotedImage || quotedVideo;
            mimeType = quotedImage ? 'image' : 'video';
        } else {
            // Jika tidak membalas, cek apakah media dikirim langsung
            const image = m.message?.imageMessage;
            const video = m.message?.videoMessage;

            if (image || video) {
                mediaMessage = image || video;
                mimeType = image ? 'image' : 'video';
            }
        }

        if (!mediaMessage || !mimeType) {
            return await sock.sendMessage(m.key.remoteJid, {
                text: '❌ Stress yak??'
            }, { quoted: m });
        }

        const messageStub = { message: { [`${mimeType}Message`]: mediaMessage } };

        try {
            const buffer = await downloadMediaMessage(messageStub, 'buffer', {}, { logger: console, reuploadRequest: sock });

            if (!Buffer.isBuffer(buffer)) {
                console.log('[DEBUG] Hasil downloadMediaMessage bukan Buffer:', typeof buffer);
                return await sock.sendMessage(m.key.remoteJid, {
                    text: '❌ Gagal mengunduh media, pastikan kirim ulang.'
                }, { quoted: m });
            }

            const sticker = new Sticker(buffer, {
                pack: 'Kawori-Bot',
                author: 'Yusril Falah',
                type: mimeType === 'image' ? StickerTypes.FULL : StickerTypes.CROPPED,
                quality: 80,
            });

            const stickerBuffer = await sticker.toBuffer();

            await sock.sendMessage(
                m.key.remoteJid,
                { sticker: stickerBuffer },
                { quoted: m }
            );
        } catch (err) {
            console.error('❌ Plugin error:', err);
            await sock.sendMessage(m.key.remoteJid, {
                text: '❌ Terjadi kesalahan saat membuat stiker.'
            }, { quoted: m });
        }
    }
};
