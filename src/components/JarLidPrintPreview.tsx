import React, { useState, useEffect } from 'react';
import { generateQRDataURL } from '../utils/qrGenerator';
import { CHILLY_BANG_INFO } from '../data/labelData';
import { Printer, ArrowLeft, Sliders, Check } from 'lucide-react';

interface JarLidPrintPreviewProps {
  targetUrl: string;
  onBack: () => void;
}

export const JarLidPrintPreview: React.FC<JarLidPrintPreviewProps> = ({
  targetUrl,
  onBack,
}) => {
  const [stickerQr, setStickerQr] = useState<string>('');
  const [stickerSize, setStickerSize] = useState<'45mm' | '55mm' | '65mm'>('55mm');
  const [sheetLayout, setSheetLayout] = useState<'grid' | 'single'>('grid');
  const [showCutGuides, setShowCutGuides] = useState<boolean>(true);

  useEffect(() => {
    generateQRDataURL(targetUrl, {
      width: 600,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#100c09',
        light: '#ffffff',
      },
    })
      .then(setStickerQr)
      .catch(console.error);
  }, [targetUrl]);

  const handlePrint = () => {
    window.print();
  };

  // Sticker size pixels in preview
  const getSizeDimensions = () => {
    switch (stickerSize) {
      case '45mm':
        return 'w-[180px] h-[180px] p-3 text-[10px]';
      case '55mm':
        return 'w-[220px] h-[220px] p-4 text-[11px]';
      case '65mm':
        return 'w-[260px] h-[260px] p-5 text-[12px]';
    }
  };

  // Render a single circular sticker badge
  const renderSticker = (keyIndex: number) => (
    <div
      key={keyIndex}
      className={`relative rounded-full flex flex-col items-center justify-between text-center bg-[#100c09] text-[#f3e7cf] border shadow-md transition-transform ${
        showCutGuides ? 'border-dashed border-[#c9a13b]/60' : 'border-transparent'
      } ${getSizeDimensions()}`}
      style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      }}
    >
      {/* Top Header */}
      <div className="pt-1">
        <div className="font-bold tracking-widest text-[#c9a13b] text-xs uppercase leading-none">
          Chilly Bang
        </div>
        <div className="text-[9px] text-[#b7a488] tracking-tight mt-0.5 uppercase">
          Homemade by OG
        </div>
      </div>

      {/* Center QR code */}
      <div className="p-1.5 bg-white rounded-lg shadow-xs my-auto">
        {stickerQr ? (
          <img
            src={stickerQr}
            alt="Chilly Bang QR"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Bottom Footer */}
      <div className="pb-1">
        <div className="text-[9px] text-[#e0c26a] font-medium tracking-wide">
          SCAN FOR LABEL & ALLERGENS
        </div>
        <div className="text-[8px] text-[#8c7356] font-mono mt-0.5">
          260ml Jar · Centurion, SA
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Controls Bar - Hidden on print */}
      <div className="no-print mb-8 bg-[#1c140e] border border-[#33241a] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 bg-[#241811] hover:bg-[#33241a] text-[#f3e7cf] border border-[#33241a] rounded-xl transition-colors"
            title="Back to Studio"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-[#f3e7cf]">
              Jar Lid & Sticker Print Sheet
            </h2>
            <p className="text-xs text-[#b7a488]">
              Ready-to-print circular sticker templates for your 260ml Chilly Bang jar lids.
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Size picker */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#8c7356]">Lid Size:</span>
            {(['45mm', '55mm', '65mm'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setStickerSize(size)}
                className={`px-2.5 py-1 rounded-lg border font-medium ${
                  stickerSize === size
                    ? 'bg-[#c9a13b] text-[#100c09] border-[#c9a13b]'
                    : 'bg-[#100c09] text-[#b7a488] border-[#33241a] hover:text-[#f3e7cf]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Grid vs Single */}
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setSheetLayout('grid')}
              className={`px-2.5 py-1 rounded-lg border ${
                sheetLayout === 'grid'
                  ? 'bg-[#33241a] text-[#f3e7cf] border-[#c9a13b]'
                  : 'bg-[#100c09] text-[#8c7356] border-[#33241a]'
              }`}
            >
              Full Sheet (12x)
            </button>
            <button
              type="button"
              onClick={() => setSheetLayout('single')}
              className={`px-2.5 py-1 rounded-lg border ${
                sheetLayout === 'single'
                  ? 'bg-[#33241a] text-[#f3e7cf] border-[#c9a13b]'
                  : 'bg-[#100c09] text-[#8c7356] border-[#33241a]'
              }`}
            >
              Single Test
            </button>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a13b] hover:bg-[#d9b048] text-[#100c09] font-bold text-sm rounded-xl transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print Sheet
          </button>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="print-sheet bg-[#18120c] border border-[#33241a] rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="no-print text-center mb-6 text-xs text-[#8c7356] flex items-center justify-center gap-2">
          <span>Target Print URL:</span>
          <code className="text-[#c9a13b] font-mono">{targetUrl}</code>
        </div>

        {sheetLayout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {Array.from({ length: 12 }).map((_, idx) => renderSticker(idx))}
          </div>
        ) : (
          <div className="flex justify-center py-8">
            {renderSticker(0)}
          </div>
        )}

        <div className="no-print text-center mt-10 text-xs text-[#8c7356]">
          Tip: Select <strong>Landscape or Portrait</strong> in your browser print dialogue. Set margins to <strong>Minimum</strong> or <strong>None</strong> for sticker sheets.
        </div>
      </div>
    </div>
  );
};
