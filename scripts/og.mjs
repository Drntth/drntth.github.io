import sharp from "sharp";

const W = 1200,
  H = 630;
const avatar = await sharp("src/assets/avatar.jpg")
  .resize(240, 240, { fit: "cover" })
  .composite([
    {
      input: Buffer.from(
        '<svg width="240" height="240"><circle cx="120" cy="120" r="120"/></svg>',
      ),
      blend: "dest-in",
    },
  ])
  .png()
  .toBuffer();

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#e11d48"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="#0d0a17"/>
  <circle cx="1120" cy="40" r="360" fill="#e11d48" opacity=".2"/>
  <circle cx="60" cy="0" r="380" fill="#7c3aed" opacity=".28"/>
  <circle cx="1000" cy="315" r="127" fill="url(#g)"/>
  <rect x="80" y="400" width="120" height="6" rx="3" fill="url(#g)"/>
  <text x="80" y="290" font-size="68" font-weight="700" fill="#f1edff" font-family="Arial, Helvetica, sans-serif">Tóth Dorina Ildikó</text>
  <text x="80" y="350" font-size="34" fill="#a39dbd" font-family="Arial, Helvetica, sans-serif">Software Developer - AI &amp; Backend</text>
  <text x="80" y="470" font-size="26" fill="#a78bfa" font-family="Arial, Helvetica, sans-serif">drntth.github.io</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: avatar, left: 880, top: 195 }])
  .png()
  .toFile("public/og.png");
