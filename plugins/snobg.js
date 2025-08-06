const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "snobg",
    command: ["snobg"],
    tags: "sticker",
    description: "Buat stiker tanpa background",
    async exec({ sock, m }) {
        const isQuotedImage = m.quoted && m.quoted.message && m.quoted.message.imageMessage;
        const isDirectImage = m.message && m.message.imageMessage;

        if (!isQuotedImage && !isDirectImage) {
            return await sock.sendMessage(m.key.remoteJid, {
                text: "❌ Kirim atau balas gambar dengan perintah /snobg"
            }, { quoted: m });
        }

        const mediaMessage = isQuotedImage ? m.quoted : m;
        const mediaBuffer = await downloadMediaMessage(mediaMessage, "buffer", {}, {
            reuploadRequest: sock.updateMediaMessage
        });

        const mediaPath = path.join(__dirname, "../temp", `${Date.now()}.jpg`);
        fs.writeFileSync(mediaPath, mediaBuffer);

        try {
            const form = new FormData();
            form.append("image_file", fs.createReadStream(mediaPath));

            const response = await axios.post("https://api.remove.bg/v1.0/removebg", form, {
                headers: {
                    ...form.getHeaders(),
                                              "X-Api-Key": "Gp3Jsw73hS6heqzfwKbwXa3t"
                },
                responseType: "arraybuffer"
            });

            const result = response.data;
            const stickerPath = path.join(__dirname, "../temp", `${Date.now()}-nobg.webp`);
            fs.writeFileSync(stickerPath, result);

            await sock.sendMessage(m.key.remoteJid, {
                sticker: fs.readFileSync(stickerPath)
            }, { quoted: m });

            fs.unlinkSync(mediaPath);
            fs.unlinkSync(stickerPath);
        } catch (err) {
            console.error("Remove.bg Error:", err.response?.data || err.message);
            await sock.sendMessage(m.key.remoteJid, {
                text: "❌ Gagal menghapus background! Pastikan API Key benar atau quota tidak habis."
            }, { quoted: m });
            fs.unlinkSync(mediaPath);
        }
    }
};
