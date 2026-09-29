// Generates the profile photo and Open Graph images. Run with `npm run images`.
// The source photo (data/photo/pedro-source.png) is git-ignored: its background shows other people.
import sharp from 'sharp';

const SOURCE = 'data/photo/pedro-source.png';
const CROP = { left: 125, top: 0, width: 490, height: 612 };

// Soft mask around head and shoulders; everything outside it gets blurred.
const { width, height } = await sharp(SOURCE).metadata();
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs><filter id="f"><feGaussianBlur stdDeviation="10"/></filter></defs>
  <rect width="100%" height="100%" fill="#000"/>
  <g filter="url(#f)" fill="#fff">
    <ellipse cx="372" cy="292" rx="203" ry="270"/>
    <ellipse cx="380" cy="505" rx="120" ry="80"/>
    <ellipse cx="400" cy="720" rx="420" ry="250"/>
  </g>
</svg>`;
const mask = await sharp(Buffer.from(maskSvg)).extractChannel(0).raw().toBuffer();
const rgb = await sharp(SOURCE).removeAlpha().png().toBuffer();
const sharpLayer = await sharp(rgb)
  .joinChannel(mask, { raw: { width, height, channels: 1 } })
  .png()
  .toBuffer();
const blurred = await sharp(rgb).blur(22).modulate({ brightness: 0.95, saturation: 0.7 }).png().toBuffer();
const composed = await sharp(blurred).composite([{ input: sharpLayer }]).png().toBuffer();

const portrait = await sharp(composed).extract(CROP).resize(480, 600).toBuffer();

await sharp(portrait).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile('public/images/pedro-bengoa.jpg');

const copy = {
  en: {
    headline: 'Solutions Architect &amp; technical leader',
    lines: ['Technology is a tool. The interesting', 'part is figuring out what to build,', 'why, and how.'],
  },
  es: {
    headline: 'Solutions Architect y líder técnico',
    lines: ['La tecnología es una herramienta.', 'Lo interesante es descubrir qué', 'construir, por qué y cómo.'],
  },
};

const PHOTO = { x: 810, y: 105, w: 320, h: 400, r: 24 };
const photoForOg = await sharp(portrait)
  .resize(PHOTO.w, PHOTO.h)
  .composite([
    {
      input: Buffer.from(`<svg width="${PHOTO.w}" height="${PHOTO.h}"><rect width="${PHOTO.w}" height="${PHOTO.h}" rx="${PHOTO.r}" fill="#fff"/></svg>`),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

for (const [lang, c] of Object.entries(copy)) {
  const tagline = c.lines.map((l, i) => `<text x="110" y="${440 + i * 44}" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#ecebe6">${l}</text>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#111110"/>
  <rect x="0" y="0" width="12" height="630" fill="#f5a524"/>
  <text x="80" y="140" font-family="Consolas, 'Courier New', monospace" font-size="28" fill="#a3a29b">// pedro<tspan fill="#f5a524">.</tspan>bengoa</text>
  <text x="80" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="84" font-weight="700" fill="#ecebe6">Pedro Bengoa<tspan fill="#f5a524">.</tspan></text>
  <text x="80" y="315" font-family="Segoe UI, Arial, sans-serif" font-size="36" fill="#a3a29b">${c.headline}</text>
  <rect x="80" y="405" width="4" height="120" fill="#f5a524"/>
  ${tagline}
  <rect x="${PHOTO.x - 3}" y="${PHOTO.y - 3}" width="${PHOTO.w + 6}" height="${PHOTO.h + 6}" rx="${PHOTO.r + 3}" fill="#f5a524"/>
</svg>`;
  await sharp(Buffer.from(svg))
    .composite([{ input: photoForOg, left: PHOTO.x, top: PHOTO.y }])
    .png()
    .toFile(`public/og/og-${lang}.png`);
}

console.log('Wrote public/images/pedro-bengoa.jpg and public/og/og-{en,es}.png');
