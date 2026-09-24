import React, { useState, useEffect } from 'react';
import { generateQRDataURL, generateQRSVG, QROptions } from '../utils/qrGenerator';
import { CHILLY_BANG_INFO } from '../data/labelData';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Printer,
  Sparkles,
  Layers,
  Sliders,
  ShieldCheck,
  Flame,
  Globe
} from 'lucide-react';

interface QRCodeStudioProps {
  targetUrl: string;
  onUrlChange: (newUrl: string) => void;
  onOpenPrintSheet: () => void;
  onOpenDeployModal: () => void;
}

type QRTheme = 'cream' | 'dark-gold' | 'monochrome' | 'chilli-red';

export const QRCodeStudio: React.FC<QRCodeStudioProps> = ({
  targetUrl,
  onUrlChange,
  onOpenPrintSheet,
  onOpenDeployModal,
}) => {
  const [inputUrl, setInputUrl] = useState(targetUrl);
  const [theme, setTheme] = useState<QRTheme>('cream');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [previewQr, setPreviewQr] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolution, setResolution] = useState<number>(1200);

  // Sync external prop if changed
  useEffect(() => {
    setInputUrl(targetUrl);
  }, [targetUrl]);

  // Color mapping based on theme
  const getThemeColors = (t: QRTheme) => {
    switch (t) {
      case 'cream':
        return { dark: '#1c140e', light: '#f3e7cf' };
      case 'dark-gold':
        return { dark: '#c9a13b', light: '#100c09' };
      case 'monochrome':
        return { dark: '#000000', light: '#ffffff' };
      case 'chilli-red':
        return { dark: '#d92626', light: '#ffffff' };
    }
  };

  // Re-generate QR preview whenever inputUrl, theme, or errorCorrection changes
  useEffect(() => {
    let active = true;
    setIsGenerating(true);

    const colors = getThemeColors(theme);
    generateQRDataURL(targetUrl, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: errorCorrection,
      color: colors,
    })
      .then((dataUrl) => {
        if (active) {
          setPreviewQr(dataUrl);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setIsGenerating(false);
      });

    return () => {
      active = false;
    };
  }, [targetUrl, theme, errorCorrection]);

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      let cleaned = inputUrl.trim();
      if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
        cleaned = 'https://' + cleaned;
      }
      onUrlChange(cleaned);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      const colors = getThemeColors(theme);
      const highResDataUrl = await generateQRDataURL(targetUrl, {
        width: resolution,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: colors,
      });

      const a = document.createElement('a');
      a.href = highResDataUrl;
      a.download = `chilly-bang-qr-${theme}-${resolution}px.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download PNG:', err);
    }
  };

  const handleDownloadSVG = async () => {
    try {
      const colors = getThemeColors(theme);
      const svgString = await generateQRSVG(targetUrl, {
        width: 800,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: colors,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chilly-bang-qr-${theme}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download SVG:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyImage = async () => {
    try {
      const colors = getThemeColors(theme);
      const imgUrl = await generateQRDataURL(targetUrl, {
        width: 800,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: colors,
      });
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch (err) {
      console.error('Clipboard item not supported or denied:', err);
      // fallback download
      handleDownloadPNG();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b border-[#33241a] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c140e] border border-[#33241a] text-[#c9a13b] text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5" />
            Official QR Generator
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f3e7cf] tracking-tight">
            Chilly Bang QR & Print Studio
          </h2>
          <p className="text-sm text-[#b7a488] mt-1 max-w-xl">
            Generate high-resolution, scan-tested QR codes for your 260ml jar lids, retail stickers, and promotional posters.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-2 justify-center">
          <button
            type="button"
            onClick={onOpenPrintSheet}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a13b] hover:bg-[#d9b048] text-[#100c09] font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Jar Lid Stickers
          </button>
          <button
            type="button"
            onClick={onOpenDeployModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1c140e] hover:bg-[#281c13] text-[#f3e7cf] border border-[#33241a] font-medium text-sm rounded-xl transition-all"
          >
            <Globe className="w-4 h-4 text-[#c9a13b]" />
            Vercel Setup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Controls & URL configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target URL Card */}
          <div className="bg-[#1c140e] border border-[#33241a] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="target-url-input" className="text-sm font-semibold text-[#f3e7cf] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#c9a13b]" />
                Live Destination URL
              </label>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-xs text-[#c9a13b] hover:text-[#e0c26a] flex items-center gap-1 font-medium transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>

            <form onSubmit={handleApplyUrl} className="space-y-3">
              <div className="relative">
                <input
                  id="target-url-input"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://chilly-bang.vercel.app"
                  className="w-full bg-[#100c09] border border-[#33241a] focus:border-[#c9a13b] focus:ring-1 focus:ring-[#c9a13b] rounded-xl py-3 px-3.5 text-sm text-[#f3e7cf] placeholder-[#8c7356] font-mono outline-none transition-all pr-24"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#33241a] hover:bg-[#4a3426] text-[#f3e7cf] text-xs font-semibold rounded-lg transition-colors"
                >
                  Update
                </button>
              </div>

              {/* Quick URL presets */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="text-[#8c7356] py-0.5">Quick fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    const origin = typeof window !== 'undefined' ? window.location.href : 'https://chilly-bang.vercel.app';
                    setInputUrl(origin);
                    onUrlChange(origin);
                  }}
                  className="bg-[#241811] hover:bg-[#33241a] text-[#b7a488] hover:text-[#f3e7cf] border border-[#33241a] px-2.5 py-1 rounded-lg transition-colors"
                >
                  Current Preview URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const vercelSample = 'https://chilly-bang.vercel.app';
                    setInputUrl(vercelSample);
                    onUrlChange(vercelSample);
                  }}
                  className="bg-[#241811] hover:bg-[#33241a] text-[#b7a488] hover:text-[#f3e7cf] border border-[#33241a] px-2.5 py-1 rounded-lg transition-colors"
                >
                  chilly-bang.vercel.app
                </button>
              </div>
            </form>
          </div>

          {/* Style & Theme Selector */}
          <div className="bg-[#1c140e] border border-[#33241a] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-[#f3e7cf] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#c9a13b]" />
              Color Palette for Jar Label
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  id: 'cream' as QRTheme,
                  name: 'Jar Cream',
                  desc: 'Matches Label Background',
                  previewBg: '#f3e7cf',
                  previewDot: '#1c140e',
                },
                {
                  id: 'monochrome' as QRTheme,
                  name: 'Pure Mono',
                  desc: 'Highest Contrast / Thermal',
                  previewBg: '#ffffff',
                  previewDot: '#000000',
                },
                {
                  id: 'dark-gold' as QRTheme,
                  name: 'Dark Gold',
                  desc: 'Luxury Dark Branding',
                  previewBg: '#100c09',
                  previewDot: '#c9a13b',
                },
                {
                  id: 'chilli-red' as QRTheme,
                  name: 'Spicy Red',
                  desc: 'Fiery Eye-Catching',
                  previewBg: '#ffffff',
                  previewDot: '#d92626',
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    theme === t.id
                      ? 'border-[#c9a13b] bg-[#241811] ring-1 ring-[#c9a13b]'
                      : 'border-[#33241a] bg-[#100c09] hover:border-[#4a3426]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center border border-black/20 shadow-inner"
                      style={{ backgroundColor: t.previewBg }}
                    >
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: t.previewDot }} />
                    </div>
                    {theme === t.id && (
                      <span className="w-2 h-2 rounded-full bg-[#c9a13b]" />
                    )}
                  </div>
                  <div className="text-xs font-semibold text-[#f3e7cf]">{t.name}</div>
                  <div className="text-[10px] text-[#8c7356] leading-tight mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>

            {/* Error correction and print resolution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#33241a]">
              <div>
                <label className="text-xs font-medium text-[#b7a488] mb-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c9a13b]" />
                  Error Correction Level
                </label>
                <div className="grid grid-cols-4 gap-1 bg-[#100c09] p-1 rounded-xl border border-[#33241a]">
                  {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setErrorCorrection(level)}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        errorCorrection === level
                          ? 'bg-[#c9a13b] text-[#100c09]'
                          : 'text-[#8c7356] hover:text-[#f3e7cf]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-[10.5px] text-[#8c7356] mt-1">
                  <strong>Level H (30%)</strong> allows QR code to be scanned even with kitchen oils or smudges on the jar.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-[#b7a488] mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#c9a13b]" />
                  Export PNG Quality
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                  className="w-full bg-[#100c09] border border-[#33241a] rounded-xl py-2 px-3 text-xs text-[#f3e7cf] outline-none"
                >
                  <option value={600}>600 x 600 px (Standard Web)</option>
                  <option value={1200}>1200 x 1200 px (High-Res Print)</option>
                  <option value={2400}>2400 x 2400 px (Ultra 300+ DPI Master)</option>
                </select>
                <p className="text-[10.5px] text-[#8c7356] mt-1">
                  SVG is always available as infinite vector quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Live QR Preview & Actions */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#1c140e] border border-[#33241a] rounded-2xl p-6 text-center shadow-xl">
            <span className="text-xs font-semibold text-[#c9a13b] uppercase tracking-wider block mb-4">
              Live Printable QR Preview
            </span>

            {/* QR Card Frame */}
            <div className="relative inline-block p-4 rounded-2xl border border-[#33241a] bg-[#100c09] shadow-2xl">
              {previewQr ? (
                <img
                  src={previewQr}
                  alt="Chilly Bang QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl transition-all"
                  style={{ backgroundColor: getThemeColors(theme).light }}
                />
              ) : (
                <div className="w-64 h-64 bg-[#1c140e] animate-pulse rounded-xl flex items-center justify-center text-[#8c7356] text-sm">
                  Rendering...
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-[#100c09]/60 backdrop-blur-xs rounded-2xl flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-[#c9a13b] animate-spin" />
                </div>
              )}
            </div>

            <div className="mt-4 text-xs font-mono text-[#b7a488] break-all px-2 max-w-sm mx-auto">
              {targetUrl}
            </div>

            {/* Download Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownloadPNG}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#c9a13b] hover:bg-[#d9b048] text-[#100c09] font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>

              <button
                type="button"
                onClick={handleDownloadSVG}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#241811] hover:bg-[#33241a] text-[#f3e7cf] border border-[#33241a] font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-[#c9a13b]" />
                Vector SVG
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleCopyImage}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#100c09] hover:bg-[#1a120c] text-[#b7a488] hover:text-[#f3e7cf] border border-[#33241a] rounded-lg text-xs transition-colors"
              >
                {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedImage ? 'Copied Image!' : 'Copy to Clipboard'}
              </button>

              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-2 px-3 bg-[#100c09] hover:bg-[#1a120c] text-[#b7a488] hover:text-[#f3e7cf] border border-[#33241a] rounded-lg text-xs transition-colors"
                title="Test destination URL"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Test Link
              </a>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#241811] border border-[#33241a] rounded-2xl p-4 text-xs text-[#b7a488] space-y-2">
            <div className="font-semibold text-[#f3e7cf] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a13b]" />
              How this works for Chilly Bang Jars:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#b7a488]">
              <li>Deploy this app to Vercel to obtain your public URL.</li>
              <li>Paste your Vercel link above (e.g. <code className="text-[#e0c26a]">https://chillybang.vercel.app</code>).</li>
              <li>Click <strong>Jar Lid Stickers</strong> to print round 45mm/50mm sticker sheets for your jar lids.</li>
              <li>Customers scan the jar lid with their smartphone camera to instantly open your digital label!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
