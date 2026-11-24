// Genera public/og.jpg (1200x630) a partir del fondo de marca y el retrato.
// Uso: node scripts/og-image.mjs
import sharp from "sharp";

const W = 1200, H = 630, PW = 380, PH = 500;
const bg = await sharp("src/assets/fondo-organico.jpg").resize(W, H, { fit: "cover" }).toBuffer();
const mask = Buffer.from(
  `<svg width="${PW}" height="${PH}"><rect x="0" y="0" width="${PW}" height="${PH}" rx="${PW / 2}" ry="${PW / 2}"/><rect x="0" y="${PW / 2}" width="${PW}" height="${PH - PW / 2}" rx="24" ry="24"/></svg>`,
);
const portrait = await sharp("src/assets/carla-retrato.jpg")
  .resize(PW, PH, { fit: "cover", position: "top" })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();
const text = Buffer.from(`<svg width="${W}" height="${H}">
  <text x="90" y="290" font-family="Lora, Georgia, serif" font-size="96" fill="#2b4734">ConCiencia</text>
  <text x="94" y="350" font-family="Manrope, sans-serif" font-size="26" letter-spacing="9" fill="#b5653b">PSICOLOGÍA</text>
  <text x="94" y="430" font-family="Manrope, sans-serif" font-size="28" fill="#1f3327">Carla Castellano · Psicóloga sanitaria</text>
  <text x="94" y="472" font-family="Manrope, sans-serif" font-size="24" fill="#4a5f51">Valencia · Sagunto · Benisanó · Online</text>
</svg>`);
await sharp(bg)
  .composite([
    { input: text, top: 0, left: 0 },
    { input: portrait, top: (H - PH) / 2, left: W - PW - 90 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/og.jpg");
console.log("public/og.jpg generado");
