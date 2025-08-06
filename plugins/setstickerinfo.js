const { setStickerMeta } = require('../lib/exif')

module.exports = async (sock, m, text, from, isOwner) => {
  if (!text.startsWith('/setstickerinfo')) return
  if (!isOwner) return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa menggunakan perintah ini.' }, { quoted: m })

  const args = text.split('|')
  if (args.length !== 2) {
    return sock.sendMessage(from, { text: '❌ Format salah.\nGunakan: /setstickerinfo packname|author' }, { quoted: m })
  }

  const [packname, author] = args
  setStickerMeta(packname.trim(), author.trim())

  await sock.sendMessage(from, { text: `✅ Info stiker diubah:\nPack: *${packname.trim()}*\nAuthor: *${author.trim()}*` }, { quoted: m })
}
