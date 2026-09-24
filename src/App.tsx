import React, { useState, useEffect } from 'react';
import { DigitalLabel } from './components/DigitalLabel';
import { JarLidPrintPreview } from './components/JarLidPrintPreview';
import { VercelDeployModal } from './components/VercelDeployModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'label' | 'print-sheet'>('label');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string>('https://chilly-bang.vercel.app');

  // Detect current URL and query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlParam = searchParams.get('url');

      if (urlParam) {
        setTargetUrl(urlParam);
      } else if (window.location.href && !window.location.href.includes('localhost:3000')) {
        setTargetUrl(window.location.href);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#100c09] text-[#f3e7cf] flex flex-col font-['Poppins',sans-serif]">
      {/* Top navigation is removed and completely empty as requested */}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'label' && (
          <DigitalLabel
            targetUrl={targetUrl}
            onOpenPrintSheet={() => setCurrentView('print-sheet')}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
          />
        )}

       
      </main>

      {/* Vercel Deployment Modal */}
      <VercelDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        targetUrl={targetUrl}
      />
    </div>
  );
}
