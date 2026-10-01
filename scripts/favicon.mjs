import sharp from 'sharp';
const src = 'src/assets/avatar.jpg';
const circle = (s) => Buffer.from(`<svg><circle cx="${s/2}" cy="${s/2}" r="${s/2}"/></svg>`);
for (const [name, size] of [['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180]]) {
  await sharp(src).resize(size, size, { fit: 'cover' })
    .composite([{ input: circle(size), blend: 'dest-in' }])
    .png().toFile(`public/${name}`);
}