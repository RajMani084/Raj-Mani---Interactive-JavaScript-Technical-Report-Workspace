/**
 * @license
 * Author: Raj Mani (Frontend Web Developer Intern)
 * Project: Week 3 Task - Integrating JavaScript for Interactive User Experience
 */

import React, { useState } from 'react';
import { 
  FileCode, Download, Copy, Check, FolderArchive, 
  ExternalLink, Terminal, Layers
} from 'lucide-react';
import JSZip from 'jszip';
import { 
  STANDALONE_HTML, 
  STANDALONE_CSS, 
  STANDALONE_JS, 
  STANDALONE_README 
} from '../data/standaloneFiles';

export function SourceCodeViewer() {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'readme'>('js');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const files = {
    html: { name: 'index.html', content: STANDALONE_HTML, lang: 'html' },
    css: { name: 'styles.css', content: STANDALONE_CSS, lang: 'css' },
    js: { name: 'script.js', content: STANDALONE_JS, lang: 'javascript' },
    readme: { name: 'README.md', content: STANDALONE_README, lang: 'markdown' }
  };

  const currentFile = files[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      zip.file('index.html', STANDALONE_HTML);
      zip.file('styles.css', STANDALONE_CSS);
      zip.file('script.js', STANDALONE_JS);
      zip.file('README.md', STANDALONE_README);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'raj-mani-week3-javascript-submission.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <FileCode className="w-4 h-4" />
            <span>Standalone Deliverable Files</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Source Code Deliverables &amp; Inspector
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineered by <strong>Raj Mani</strong> · Pure Vanilla Web Standards (Zero Build Step Required)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <FolderArchive className="w-4 h-4" />
            <span>{isZipping ? 'Bundling ZIP...' : 'Download Full ZIP Bundle'}</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="bg-[#0d1117] text-slate-200 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Tab Bar */}
        <div className="bg-[#161b22] border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {[
              { id: 'js', label: 'script.js', icon: 'JS' },
              { id: 'html', label: 'index.html', icon: '<>' },
              { id: 'css', label: 'styles.css', icon: '#' },
              { id: 'readme', label: 'README.md', icon: 'MD' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-blue-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className="text-[10px] text-slate-500 font-bold">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownloadSingle}
              className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {currentFile.name}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[70vh] font-mono text-xs leading-relaxed">
          <pre className="text-slate-300">
            <code>{currentFile.content}</code>
          </pre>
        </div>

        {/* Footer Meta */}
        <div className="bg-[#161b22] border-t border-slate-800 px-4 py-2 text-[11px] font-mono text-slate-500 flex justify-between items-center">
          <span>File: {currentFile.name}</span>
          <span>Author: Raj Mani (Frontend Web Developer Intern)</span>
        </div>
      </div>
    </div>
  );
}
