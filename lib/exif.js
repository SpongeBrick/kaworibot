const { Sticker } = require('wa-sticker-formatter');

async function writeExifImg(buffer, options = {}) {
  const sticker = new Sticker(buffer, {
    pack: options.packname || '',
    author: options.author || '',
    type: 'full',
    categories: ['🤖'],
    quality: 70
  });
  return await sticker.toBuffer();
}

module.exports = { writeExifImg };
