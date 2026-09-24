import React, { useEffect, useState } from 'react';
import { CHILLY_BANG_INFO } from '../data/labelData';
import { CHILLY_BANG_BADGE_BASE64 } from '../data/chillyBangBadge';
import { generateQRDataURL } from '../utils/qrGenerator';
import {
  Download,
  Copy,
  Check,
  Printer,
  Globe,
  Share2,
  ExternalLink,
  Flame
} from 'lucide-react';

interface DigitalLabelProps {
  targetUrl: string;
  onOpenPrintSheet?: () => void;
  onOpenDeployModal?: () => void;
}

export const DigitalLabel: React.FC<DigitalLabelProps> = ({
  targetUrl,
  onOpenPrintSheet,
  onOpenDeployModal,
}) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    generateQRDataURL(targetUrl, {
      width: 600,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#1c140e',
        light: '#f3e7cf',
      },
    })
      .then((url) => {
        if (isMounted) setQrSrc(url);
      })
      .catch((err) => console.error(err));

    return () => {
      isMounted = false;
    };
  }, [targetUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadQR = async () => {
    setDownloading(true);
    try {
      const highResUrl = await generateQRDataURL(targetUrl, {
        width: 1600,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#100c09',
          light: '#ffffff',
        },
      });

      const a = document.createElement('a');
      a.href = highResUrl;
      a.download = 'chilly-bang-jar-qr.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-4 sm:py-8 px-3 sm:px-4">
      <div className="w-full max-w-[460px] pb-12 transition-all">
        {/* Centered Circular Badge Image */}
        <div className="badge-wrap flex justify-center pt-2 sm:pt-6">
          <div className="relative group">
            <img
              src="/chill_band_label.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = CHILLY_BANG_BADGE_BASE64;
              }}
              alt={CHILLY_BANG_INFO.name}
              className="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] rounded-full object-cover shadow-[0_0_0_4px_#100c09,0_18px_40px_-12px_rgba(0,0,0,0.85)] border border-[#33241a]/60 transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-[#c9a13b]/30 pointer-events-none" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-6 px-4">
         <h1 className="m-0 text-base sm:text-[17px] font-semibold tracking-wide text-[#f3e7cf] leading-snug">
            {CHILLY_BANG_INFO.name}
          </h1>
           {/* <p className="text-xs text-[#b7a488] mt-1 font-normal">
            {CHILLY_BANG_INFO.tagline}
          </p> */}
          
        </div>

        {/* Facts badge */}
        <div className="flex items-baseline justify-center my-4 sm:my-5 px-4">
          <span className="text-sm sm:text-[15px] font-semibold tracking-wider text-[#c9a13b] bg-[#1c140e] px-4 py-1 rounded-full border border-[#33241a] shadow-inner">
            {CHILLY_BANG_INFO.netVolumeDetails}
          </span>
        </div>

        {/* Content sections */}
        <div className="px-3 sm:px-5 space-y-6">
          {/* Product Information Table */}
          <div>
            <div className="text-[12px] sm:text-[12.5px] font-semibold tracking-wider text-[#c9a13b] mb-2.5 uppercase">
              Product Information
            </div>
            <table className="w-full border-collapse bg-[#1c140e] border border-[#33241a] rounded-xl overflow-hidden shadow-sm">
              <tbody>
                {CHILLY_BANG_INFO.specs.map((spec, idx) => (
                  <tr
                    key={spec.label}
                    className={idx !== CHILLY_BANG_INFO.specs.length - 1 ? 'border-b border-[#33241a]' : ''}
                  >
                    <td className="w-[42%] py-2.5 px-3.5 text-[#b7a488] text-[12px] sm:text-[12.5px] font-medium align-top">
                      {spec.label}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#f3e7cf] text-[13px] sm:text-[13.5px] align-top">
                      {spec.label === 'Manufacturer' ? (
                        <span className="font-medium text-[#f3e7cf]">{spec.value}</span>
                      ) : (
                        spec.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ingredients Table */}
          <div>
            <div className="text-[12px] sm:text-[12.5px] font-semibold tracking-wider text-[#c9a13b] mb-2.5 uppercase">
              Ingredients
            </div>
            <table className="w-full border-collapse bg-[#1c140e] border border-[#33241a] rounded-xl overflow-hidden shadow-sm">
              <tbody>
                {CHILLY_BANG_INFO.ingredients.map((ing, idx) => (
                  <tr
                    key={ing.number}
                    className={idx !== CHILLY_BANG_INFO.ingredients.length - 1 ? 'border-b border-[#33241a]' : ''}
                  >
                    <td className="w-8 py-2 px-3 text-[#c9a13b] text-xs font-semibold text-center">
                      {ing.number}
                    </td>
                    <td className="py-2 px-3.5 text-[#f3e7cf] text-[13px] sm:text-[13.5px]">
                      {ing.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11.5px] text-[#b7a488] mt-2 ml-1 leading-relaxed">
              {CHILLY_BANG_INFO.ingredientNote}
            </p>
          </div>

          {/* Allergen Information Callout */}
          <div>
            <div className="text-[12px] sm:text-[12.5px] font-semibold tracking-wider text-[#c9a13b] mb-2.5 uppercase">
              Allergen Information
            </div>
            <div className="bg-[#2a2010] border border-[#5c4a1e] rounded-xl p-3.5 sm:p-4 shadow-sm">
              <p className="text-[12.5px] font-semibold text-[#e0c26a] m-0 mb-1.5 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#e0c26a]" />
                {CHILLY_BANG_INFO.allergen.title}
              </p>
              <p className="text-[12px] sm:text-[12.5px] leading-relaxed text-[#b7a488] m-0">
                {CHILLY_BANG_INFO.allergen.description}
              </p>
            </div>
          </div>

          {/* Order / Contact Button */}
          <div>
            <div className="text-[12px] sm:text-[12.5px] font-semibold tracking-wider text-[#c9a13b] mb-2.5 uppercase">
              Order a Jar
            </div>
            <a
              className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 bg-[#25d366] hover:bg-[#20bd5a] text-[#0b1a10] font-semibold text-sm rounded-xl no-underline shadow-[0_4px_16px_rgba(37,211,102,0.25)] transition-all duration-200 active:scale-[0.98]"
              href={CHILLY_BANG_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.17c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.81-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.37-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.72 1.19 1.55 1.93 1.07.95 1.96 1.25 2.24 1.39.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
              </svg>
              <span>Order via WhatsApp </span>
            </a>
          </div>

          {/* Dynamic Live QR Code Box with Download & Print tools */}
          <div className="mt-8 bg-[#1c140e] border border-[#33241a] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative group/qr flex-shrink-0">
                {qrSrc ? (
                  <img
                    src="/chilly_bang_digital_label_qr.png"
                    alt="Scan to reopen this label"
                    className="w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] bg-[#f3e7cf] rounded-lg p-1.5 object-contain shadow-inner border border-[#33241a]"
                  />
                ) : (
                  <div className="w-[88px] h-[88px] bg-[#241811] animate-pulse rounded-lg flex items-center justify-center text-[#b7a488] text-xs">
                    Generating...
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#f3e7cf] m-0 mb-1">
                  Scan to reopen this label
                </p>
                <p className="text-[11.5px] text-[#b7a488] leading-relaxed m-0">
                  Print this code on the jar lid or sticker.
                </p>
                
               
              </div>
            </div>

          </div>

          {/* Footer */}
          <footer className="text-center pt-2 pb-6 text-[11px] tracking-widest uppercase text-[#8c7356]">
            {CHILLY_BANG_INFO.footerText}
          </footer>
        </div>
      </div>
    </div>
  );
};
