module.exports = {
  name: 'menu',
  alias: ['/menu'],
  category: 'main',
  desc: 'Menampilkan menu utama KaworiBot',
  async exec({ sock, m, text, prefix }) {
    const name = m.pushName || 'Kamu';
    const hour = new Date().getHours();
    const watermark = '𝐤𝐚𝐰𝐨𝐫𝐢-𝐛𝐨𝐭, 𝐚 𝐬𝐢𝐦𝐩𝐥𝐞 𝐰𝐡𝐚𝐭𝐬𝐚𝐩𝐩-𝐛𝐨𝐭 𝐦𝐚𝐝𝐞 𝐛𝐲 𝐘𝐮𝐬𝐫𝐢𝐥 𝐅𝐚𝐥𝐚𝐡';

    let greeting = 'Hai';
    let emoji = '✨';
    if (hour >= 4 && hour < 11) {
      greeting = 'Selamat pagi';
      emoji = '🌅';
    } else if (hour >= 11 && hour < 15) {
      greeting = 'Selamat siang';
      emoji = '🌤';
    } else if (hour >= 15 && hour < 18) {
      greeting = 'Selamat sore';
      emoji = '🌇';
    } else {
      greeting = 'Selamat malam';
      emoji = '🌙';
    }

    const menuText = `
    ${greeting}, *${name}!* ${emoji}

    Berikut daftar fitur yang tersedia di KaworiBot:

    ╔═〔 📌 *Download* 〕
    ║⤷ TikTok: *${prefix}tiktok* | *${prefix}vt*
    ║⤷ YouTube: *${prefix}ytmp3*, *${prefix}ytmp4*
    ║⤷ Instagram: *${prefix}ig*
    ║⤷ Twitter/X: *${prefix}twitter*
    ║⤷ Spotify/Deezer: *${prefix}spotify*, *${prefix}deezer*
    ╠═════════════════

    ╔═〔 🎮 *Games & Fun* 〕
    ║⤷ Tebak Gambar: *${prefix}tebakgambar*
    ║⤷ Truth/Dare: *${prefix}truth*, *${prefix}dare*
    ║⤷ Confess & ChatGPT: *${prefix}confess*, *${prefix}ai*
    ╠═════════════════

    ╔═〔 🎨 *Stiker & Gambar AI* 〕
    ║⤷ Sticker: *${prefix}sticker*
    ║⤷ Sticker no BG: *${prefix}snobg*
    ║⤷ Emojimix: *${prefix}emojimix 😎+🔥*
    ║⤷ AI Image: *${prefix}imagine kucing lucu*
    ╠═════════════════

    ╔═〔 🎓 *Tools Pelajar* 〕
    ║⤷ OCR: *${prefix}ocr*
    ║⤷ PDF to Image/Text: *${prefix}pdf*
    ║⤷ E-Perpus: *${prefix}perpus [judul]*
    ╠═════════════════

    ╔═〔 ⚙️ *Fitur Tambahan* 〕
    ║⤷ Voice Changer: *${prefix}voicechipmunk*, *${prefix}voicedeep*
    ║⤷ Remini: *${prefix}remini*
    ║⤷ Text Style Maker: *${prefix}textmaker*
    ╠═════════════════

    ╔═〔 👑 *Premium* 〕
    ║⤷ Akses downloader tanpa limit 🎉
    ║⤷ Auto-respon prioritas 🚀
    ╚═════════════════


    _${watermark}_
    `.trim();

    const jid = m?.chat || m?.key?.remoteJid;
    if (!jid) return;

    await sock.sendMessage(jid, { text: menuText }, { quoted: m });
  }
};
