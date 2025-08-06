const {
  default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const P = require('pino');

// Global config
global.owner = ['6281227844398'];

// Inisialisasi dan struktur awal database
const dbPath = './db.json';
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ data: { users: {} } }, null, 2));
}
let db = JSON.parse(fs.readFileSync(dbPath));

// Pastikan struktur penting tersedia
if (!db.data) db.data = {};
if (!db.data.users) db.data.users = {};

// Fungsi untuk menyimpan database
function saveDB() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// Load plugin dari folder ./plugins
const commands = new Map();
const pluginDir = path.join(__dirname, 'plugins');

fs.readdirSync(pluginDir).forEach(file => {
  if (file.endsWith('.js')) {
    try {
      const plugin = require(path.join(pluginDir, file));
      if (plugin.name && typeof plugin.exec === 'function') {
        commands.set(plugin.name, plugin);
        console.log(`✅ Loaded plugin: ${plugin.name}`);
      } else {
        console.log(`⚠️  Plugin tidak valid: ${file}`);
      }
    } catch (err) {
      console.error(`❌ Gagal load plugin ${file}:`, err);
    }
  }
});

// Fungsi utama untuk menjalankan bot
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
                            auth: state,
                            version,
                            browser: ['KaworiBot', 'Chrome', '1.0.0']
  });

  // Event handler untuk pesan masuk
  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const m = messages[0];
      if (!m || !m.message || m.key.fromMe) return;

      const from = m.key.remoteJid;
      const sender = m.key.participant || from;
      const userId = sender.endsWith('@s.whatsapp.net') ? sender : from;

      // Tambahkan user baru jika belum ada
      if (!db.data.users[userId]) {
        db.data.users[userId] = {
          name: m.pushName || 'Pengguna',
          premium: false,
          limit: 10,
          banned: false,
          blocked: false,
          lastSeen: Date.now()
        };
        saveDB();
        console.log(`📥 Pengguna baru: ${userId}`);
      }

      const type = Object.keys(m.message)[0];
      const body =
      m.message?.conversation ||
      m.message?.[type]?.text ||
      m.message?.[type]?.caption ||
      '';

      const prefix = '/';
      if (!body.startsWith(prefix)) return;

      const args = body.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const cmd = [...commands.values()].find(
        cmd =>
        cmd.name === commandName ||
        (cmd.alias && cmd.alias.includes(commandName))
      );

      if (cmd) {
        await cmd.exec({
          sock,
          m,
          args,
          text: args.join(' '),
                       command: commandName,
                       prefix,
                       db,
                       userId,
                       user: db.data.users[userId],
                       saveDB
        });
      }
    } catch (err) {
      console.error('❌ Plugin error:', err);
    }
  });

  // Simpan kredensial
  sock.ev.on('creds.update', saveCreds);

  // Handle disconnect dan reconnect
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log('❌ Terputus: Kamu telah logout.');
      } else {
        console.log('🔁 Menyambung ulang...');
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ Bot terhubung!');
    }
  });
}

startBot();
