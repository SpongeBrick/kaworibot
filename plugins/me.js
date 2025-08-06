module.exports = {
  name: 'me',
  alias: [],
  async exec({ sock, m, user, userId }) {
    const caption = `👤 *User Info*\n\n` +
    `📍 ID: ${userId}\n` +
    `📛 Name: ${user.name}\n` +
    `⭐ Premium: ${user.premium ? 'Yes' : 'No'}\n` +
    `📊 Limit: ${user.limit}\n` +
    `🚫 Banned: ${user.banned ? 'Yes' : 'No'}\n` +
    `⏱ Last Seen: ${new Date(user.lastSeen).toLocaleString()}`;

    await sock.sendMessage(m.key.remoteJid, { text: caption }, { quoted: m });
  }
};
