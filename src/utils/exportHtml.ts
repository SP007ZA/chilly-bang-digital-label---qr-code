import { CHILLY_BANG_INFO } from '../data/labelData';
import { CHILLY_BANG_BADGE_BASE64 } from '../data/chillyBangBadge';
import { generateQRDataURL } from './qrGenerator';

/**
 * Creates a standalone, self-contained single-file HTML version
 * with the exact design, inline styles, base64 badge, and a freshly baked
 * QR code that points to the given live URL.
 */
export async function createStandaloneHtml(targetUrl: string): Promise<string> {
  let qrDataUrl = '';
  try {
    qrDataUrl = await generateQRDataURL(targetUrl, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1c140e',
        light: '#f3e7cf',
      },
    });
  } catch (err) {
    console.error('Failed to bake QR code into standalone HTML:', err);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${CHILLY_BANG_INFO.name}</title>
<meta name="description" content="${CHILLY_BANG_INFO.tagline}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #100c09;
    --panel: #1c140e;
    --panel-2: #241811;
    --line: #33241a;
    --cream: #f3e7cf;
    --cream-dim: #b7a488;
    --gold: #c9a13b;
    --amber-bg: #2a2010;
    --amber-line: #5c4a1e;
    --amber-text: #e0c26a;
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    background: var(--bg);
    color: var(--cream);
    font-family: 'Poppins', system-ui, sans-serif;
    display: flex;
    justify-content: center;
  }
  a { color: var(--gold); }

  .sheet {
    width: 100%;
    max-width: 460px;
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 30px);
  }

  .badge-wrap {
    display: flex;
    justify-content: center;
    padding-top: max(36px, env(safe-area-inset-top, 0px));
  }
  .badge-wrap img {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--bg), 0 18px 40px -12px rgba(0,0,0,.7);
    object-fit: cover;
  }

  .heading {
    text-align: center;
    margin: 22px 20px 0;
  }
  .heading h1 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: .3px;
    color: var(--cream);
    line-height: 1.4;
  }

  .facts {
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin: 18px 20px 26px;
  }
  .netvol {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: .4px;
    color: var(--gold);
    background: var(--panel);
    padding: 4px 16px;
    border-radius: 9999px;
    border: 1px solid var(--line);
  }

  .content { padding: 0 20px; }

  .section-heading {
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: .5px;
    color: var(--gold);
    margin: 28px 0 10px 2px;
    text-transform: uppercase;
  }
  .section-heading:first-child { margin-top: 0; }

  table.spec {
    width: 100%;
    border-collapse: collapse;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
  }
  table.spec tr:not(:last-child) td { border-bottom: 1px solid var(--line); }
  table.spec td {
    padding: 10px 14px;
    font-size: 13.5px;
    vertical-align: top;
  }
  table.spec td:first-child {
    width: 40%;
    color: var(--cream-dim);
    font-size: 12.5px;
  }
  table.spec td a { color: var(--gold); text-decoration: underline; }

  table.ingredients {
    width: 100%;
    border-collapse: collapse;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
  }
  table.ingredients td {
    padding: 9px 14px;
    font-size: 13.5px;
  }
  table.ingredients tr:not(:last-child) td { border-bottom: 1px solid var(--line); }
  table.ingredients td.n {
    width: 26px;
    color: var(--gold);
    font-size: 12px;
    font-weight: 600;
  }
  .ing-note {
    font-size: 11.5px;
    color: var(--cream-dim);
    margin: 10px 4px 0;
    line-height: 1.5;
  }

  .callout {
    background: var(--amber-bg);
    border: 1px solid var(--amber-line);
    border-radius: 10px;
    padding: 12px 14px;
  }
  .callout .callout-title {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--amber-text);
    margin: 0 0 4px;
  }
  .callout p {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.55;
    color: var(--cream-dim);
  }

  .order-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 16px;
    background: #25d366;
    color: #0b1a10;
    font-weight: 600;
    font-size: 14px;
    border-radius: 10px;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.25);
    transition: transform 0.15s ease;
  }
  .order-btn:active { transform: scale(0.98); }
  .order-btn svg { width: 20px; height: 20px; flex: none; }

  .qr-wrap {
    margin-top: 28px;
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 14px;
  }
  .qr-wrap img {
    width: 86px; height: 86px;
    background: var(--cream);
    border-radius: 6px;
    padding: 6px;
    flex: none;
  }
  .qr-copy .qr-title { font-size: 13px; font-weight: 600; margin: 0 0 4px; color: var(--cream); }
  .qr-copy .qr-sub { font-size: 11.5px; color: var(--cream-dim); line-height: 1.5; margin: 0; }
  .qr-copy .qr-link { font-size: 10.5px; color: var(--gold); word-break: break-all; margin-top: 4px; }

  footer {
    text-align: center;
    margin-top: 28px;
    font-size: 10.5px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #8c7356;
  }

  @media (max-width: 360px) {
    .badge-wrap img { width: 220px; height: 220px; }
  }
</style>
</head>
<body>
<div class="sheet">

  <div class="badge-wrap">
    <img src="${CHILLY_BANG_BADGE_BASE64}" alt="${CHILLY_BANG_INFO.name}">
  </div>

  <div class="heading">
    <h1>${CHILLY_BANG_INFO.name}</h1>
  </div>

  <div class="facts">
    <div class="netvol">${CHILLY_BANG_INFO.netVolumeDetails}</div>
  </div>

  <div class="content">

    <div class="section-heading">Product Information</div>
    <table class="spec">
      ${CHILLY_BANG_INFO.specs
        .map(
          (s) =>
            `<tr><td>${s.label}</td><td>${s.value}</td></tr>`
        )
        .join('\n      ')}
    </table>

    <div class="section-heading">Ingredients</div>
    <table class="ingredients">
      ${CHILLY_BANG_INFO.ingredients
        .map(
          (ing) =>
            `<tr><td class="n">${ing.number}</td><td>${ing.name}</td></tr>`
        )
        .join('\n      ')}
    </table>
    <p class="ing-note">${CHILLY_BANG_INFO.ingredientNote}</p>

    <div class="section-heading">Allergen Information</div>
    <div class="callout">
      <p class="callout-title">${CHILLY_BANG_INFO.allergen.title}</p>
      <p>${CHILLY_BANG_INFO.allergen.description}</p>
    </div>

    <div class="section-heading">Order a Jar</div>
    <a class="order-btn" href="${CHILLY_BANG_INFO.whatsappLink}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.17c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.81-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.37-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.72 1.19 1.55 1.93 1.07.95 1.96 1.25 2.24 1.39.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z"/></svg>
      Order via WhatsApp (${CHILLY_BANG_INFO.whatsappDisplayNumber})
    </a>

    <div class="qr-wrap">
      <img src="${qrDataUrl}" alt="QR code linking to this digital label">
      <div class="qr-copy">
        <p class="qr-title">Scan to reopen this label</p>
        <p class="qr-sub">Print this code on the jar lid or sticker.</p>
        <p class="qr-link">${targetUrl}</p>
      </div>
    </div>

    <footer>${CHILLY_BANG_INFO.footerText}</footer>
  </div>
</div>
</body>
</html>`;
}
