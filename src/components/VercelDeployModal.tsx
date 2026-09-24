import React, { useState } from 'react';
import { createStandaloneHtml } from '../utils/exportHtml';
import {
  X,
  Globe,
  Terminal,
  FileCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({
  isOpen,
  onClose,
  targetUrl,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [downloadingHtml, setDownloadingHtml] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadStandaloneHtml = async () => {
    setDownloadingHtml(true);
    try {
      const html = await createStandaloneHtml(targetUrl);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Chilly Bang — Digital Label.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingHtml(false);
    }
  };

  const gitCommands = `# 1. Initialize git and commit
git init
git add .
git commit -m "Deploy Chilly Bang Digital Label"

# 2. Push to GitHub (using GitHub CLI or standard git remote)
gh repo create chilly-bang --public --source=. --push

# 3. Or deploy instantly using Vercel CLI
npx vercel`;

  const vercelJsonCode = `{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1c140e] border border-[#33241a] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#f3e7cf]">
        {/* Header */}
        <div className="p-6 border-b border-[#33241a] flex items-center justify-between sticky top-0 bg-[#1c140e]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-[#33241a] flex items-center justify-center text-white">
              <svg viewBox="0 0 76 65" fill="currentColor" className="w-5 h-5">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#f3e7cf]">Deploy on Vercel</h3>
              <p className="text-xs text-[#b7a488]">
                Publish your Chilly Bang digital label in under 2 minutes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[#241811] text-[#b7a488] hover:text-[#f3e7cf] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Choice Banner */}
          <div className="bg-[#241811] border border-[#33241a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#c9a13b] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Quickest Route
              </div>
              <div className="text-sm font-semibold text-[#f3e7cf]">
                Download Ready-To-Host HTML File
              </div>
              <p className="text-xs text-[#b7a488]">
                Contains the full brand styling, jar badge, and active QR code in a single standalone file.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              disabled={downloadingHtml}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c9a13b] hover:bg-[#d9b048] text-[#100c09] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              {downloadingHtml ? 'Generating...' : 'Download .html'}
            </button>
          </div>

          {/* 3 Simple Steps for TypeScript + Vite on Vercel */}
          <div>
            <h4 className="text-sm font-semibold text-[#f3e7cf] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#c9a13b] text-[#100c09] flex items-center justify-center text-xs font-bold">
                1
              </span>
              Standard Vercel Deployment (Full TypeScript App)
            </h4>

            <div className="space-y-3">
              <div className="bg-[#100c09] border border-[#33241a] rounded-xl p-3.5 text-xs text-[#b7a488] space-y-1.5">
                <div className="font-semibold text-[#f3e7cf] flex items-center gap-2">
                  <span className="text-[#c9a13b]">Step A:</span> Push code to GitHub or run Vercel CLI
                </div>
                <p>
                  In your project terminal, run the commands below. Vercel automatically detects the Vite + TypeScript setup with zero configuration needed.
                </p>
                <div className="relative mt-2">
                  <pre className="bg-[#18120c] p-3 rounded-lg font-mono text-[11px] text-[#e0c26a] overflow-x-auto border border-[#33241a]">
                    {gitCommands}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="absolute right-2 top-2 p-1.5 bg-[#241811] hover:bg-[#33241a] text-[#b7a488] hover:text-[#f3e7cf] rounded-md text-[10px] flex items-center gap-1 border border-[#33241a]"
                  >
                    {copiedCode === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode === 'git' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-[#100c09] border border-[#33241a] rounded-xl p-3.5 text-xs text-[#b7a488] space-y-1.5">
                <div className="font-semibold text-[#f3e7cf] flex items-center gap-2">
                  <span className="text-[#c9a13b]">Step B:</span> Import into Vercel
                </div>
                <p>
                  Visit <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-[#c9a13b] underline">vercel.com/new</a>, click <strong>Import</strong> on your repository, and click <strong>Deploy</strong>.
                </p>
              </div>

              <div className="bg-[#100c09] border border-[#33241a] rounded-xl p-3.5 text-xs text-[#b7a488] space-y-1.5">
                <div className="font-semibold text-[#f3e7cf] flex items-center gap-2">
                  <span className="text-[#c9a13b]">Step C:</span> Copy your live Vercel link into QR Studio!
                </div>
                <p>
                  Once Vercel gives you your link (e.g. <code className="text-[#e0c26a]">https://chilly-bang.vercel.app</code>), paste it into this app’s <strong>QR & Print Studio</strong> to download and print your official jar lid QR codes.
                </p>
              </div>
            </div>
          </div>

          {/* vercel.json configuration included */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-[#b7a488] flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#c9a13b]" />
                Included vercel.json (Already configured in this project)
              </h4>
              <button
                type="button"
                onClick={() => copyToClipboard(vercelJsonCode, 'vercelJson')}
                className="text-[11px] text-[#c9a13b] hover:text-[#e0c26a] flex items-center gap-1 font-medium"
              >
                {copiedCode === 'vercelJson' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCode === 'vercelJson' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-[#100c09] p-3 rounded-xl font-mono text-[11px] text-[#b7a488] border border-[#33241a]">
              {vercelJsonCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#33241a] bg-[#140e0a] flex items-center justify-between">
          <span className="text-xs text-[#8c7356]">
            Chilly Bang by OG · Centurion, SA
          </span>
          <a
            href="https://vercel.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#c9a13b] hover:underline flex items-center gap-1"
          >
            Vercel Documentation
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
