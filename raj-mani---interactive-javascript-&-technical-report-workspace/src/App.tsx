/**
 * @license
 * Author: Raj Mani (Frontend Web Developer Intern)
 * Project: Week 3 Task - Integrating JavaScript for Interactive User Experience
 */

import React, { useState } from 'react';
import { 
  InteractiveShowcase 
} from './components/InteractiveShowcase';
import { 
  ReportViewer 
} from './components/ReportViewer';
import { 
  SourceCodeViewer 
} from './components/SourceCodeViewer';
import { 
  generateDocxReport 
} from './utils/docxGenerator';
import { 
  Download, FileText, Code2, Play, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<'demo' | 'report' | 'source'>('demo');
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

  const handleGlobalDownloadDocx = async () => {
    try {
      setIsDownloadingDocx(true);
      const blob = await generateDocxReport();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Raj_Mani_Week3_Technical_Report.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate docx:', err);
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Contract: 3-Zone Architecture */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveSection('demo')}
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:text-blue-600 transition-colors cursor-pointer text-left"
            >
              Raj Mani <span className="font-normal text-slate-400">· Frontend Web Developer Intern</span>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveSection('demo')}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeSection === 'demo'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Interactive Demo
              {activeSection === 'demo' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveSection('report')}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeSection === 'report'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Technical Report (.docx)
              {activeSection === 'report' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveSection('source')}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeSection === 'source'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Source Deliverables
              {activeSection === 'source' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleGlobalDownloadDocx}
              disabled={isDownloadingDocx}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingDocx ? 'Generating...' : 'Download .DOCX Report'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around text-xs font-medium bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => setActiveSection('demo')}
            className={`py-1 ${activeSection === 'demo' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            Interactive Demo
          </button>
          <button
            onClick={() => setActiveSection('report')}
            className={`py-1 ${activeSection === 'report' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            Technical Report
          </button>
          <button
            onClick={() => setActiveSection('source')}
            className={`py-1 ${activeSection === 'source' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            Source Deliverables
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeSection === 'demo' && <InteractiveShowcase />}
        {activeSection === 'report' && <ReportViewer />}
        {activeSection === 'source' && <SourceCodeViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] py-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Week 3 Internship Task Deliverable · Engineered by Raj Mani
            </p>
            <p className="text-slate-400 mt-0.5">
              Integrating JavaScript for Interactive User Experience · Pure Vanilla Standards (HTML5 / CSS3 / ES2022)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button 
              onClick={() => setActiveSection('report')} 
              className="hover:text-blue-600 transition-colors"
            >
              View Report
            </button>
            <button 
              onClick={() => setActiveSection('source')} 
              className="hover:text-blue-600 transition-colors"
            >
              Inspect Source Code
            </button>
            <button 
              onClick={handleGlobalDownloadDocx}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Download Report (.docx)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
