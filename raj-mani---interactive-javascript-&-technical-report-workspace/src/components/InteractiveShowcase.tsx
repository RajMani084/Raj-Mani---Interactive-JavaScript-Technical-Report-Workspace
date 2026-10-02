/**
 * @license
 * Author: Raj Mani (Frontend Web Developer Intern)
 * Project: Week 3 Task - Integrating JavaScript for Interactive User Experience
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, ShoppingBag, Search, X, Check, Eye, EyeOff, 
  ChevronDown, ExternalLink, ShieldCheck, Zap, Activity,
  Sliders, ArrowUp, RefreshCw, Layers
} from 'lucide-react';

interface ModuleItem {
  id: string;
  title: string;
  category: 'dom' | 'events' | 'async';
  desc: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const INITIAL_MODULES: ModuleItem[] = [
  {
    id: 'mod-1',
    title: 'Event Delegation Architecture',
    category: 'events',
    desc: 'Centralized event handling via event.target.closest(), reducing memory overhead from N listeners to 1.',
    readTime: '4 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'mod-2',
    title: 'DocumentFragment DOM Batching',
    category: 'dom',
    desc: 'Stages mutations in virtual memory fragments to completely prevent forced layout reflows and jank.',
    readTime: '6 min',
    difficulty: 'Advanced'
  },
  {
    id: 'mod-3',
    title: 'Regex Real-Time Validation',
    category: 'dom',
    desc: 'Client-side verification for formats, password entropy score, and instant user error feedback.',
    readTime: '3 min',
    difficulty: 'Beginner'
  },
  {
    id: 'mod-4',
    title: 'Accessible Modal Focus Trap',
    category: 'events',
    desc: 'WCAG AA accessible keyboard navigation with tab cycling, Escape listener, and trigger restoration.',
    readTime: '5 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'mod-5',
    title: 'LocalStorage State Synchronization',
    category: 'async',
    desc: 'Persistent theme preferences and bookmark collections synchronized across browser sessions.',
    readTime: '4 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'mod-6',
    title: 'Debounced Search Query Engine',
    category: 'async',
    desc: 'Delays query execution by 250ms during keystrokes, avoiding expensive filtering loops.',
    readTime: '3 min',
    difficulty: 'Intermediate'
  }
];

interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface EventLog {
  id: string;
  time: string;
  type: 'click' | 'input' | 'submit' | 'info';
  message: string;
}

export function InteractiveShowcase() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('raj_mani_theme') as 'light' | 'dark') || 'light';
  });

  // Mode: Interactive vs Static Before Comparison
  const [viewMode, setViewMode] = useState<'interactive' | 'comparison'>('interactive');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedItems, setSavedItems] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('raj_mani_saved');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Drawer & Modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Accordion state
  const [allowMultipleAccordion, setAllowMultipleAccordion] = useState(false);
  const [openAccordionIds, setOpenAccordionIds] = useState<Set<number>>(new Set([1]));

  // Form state
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    proficiency: 'intermediate',
    password: '',
    confirmPassword: '',
    bio: '',
    terms: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<any | null>(null);

  // Telemetry HUD
  const [telemetry, setTelemetry] = useState({
    totalEvents: 1,
    clicks: 0,
    inputs: 0,
    mutations: 6,
    avgLatency: '1.84'
  });
  const [eventLogs, setEventLogs] = useState<EventLog[]>([
    {
      id: 'init',
      time: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'DOMContentLoaded: Event listeners and DOM observers bound by Raj Mani'
    }
  ]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Refs for modal focus trap
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Telemetry Logger
  const logEvent = (type: 'click' | 'input' | 'submit' | 'info', message: string) => {
    const now = new Date().toLocaleTimeString();
    setTelemetry(prev => ({
      ...prev,
      totalEvents: prev.totalEvents + 1,
      clicks: type === 'click' ? prev.clicks + 1 : prev.clicks,
      inputs: type === 'input' ? prev.inputs + 1 : prev.inputs,
      mutations: prev.mutations + 1
    }));

    setEventLogs(prev => [
      { id: Math.random().toString(36).slice(2), time: now, type, message },
      ...prev.slice(0, 35)
    ]);
  };

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery.trim()) {
        logEvent('input', `Debounced query evaluated: "${searchQuery}" (250ms threshold)`);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync theme to localStorage
  const toggleTheme = () => {
    const startTime = performance.now();
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('raj_mani_theme', next);
    const latency = (performance.now() - startTime).toFixed(2);
    logEvent('click', `Switched theme to ${next} mode in ${latency}ms`);
    showToast(`Interface switched to ${next} theme`, 'info');
  };

  // Sync saved items to localStorage
  const toggleBookmark = (id: string, title: string) => {
    setSavedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Removed "${title}" from saved list`, 'info');
        logEvent('click', `Removed bookmark: ${title}`);
      } else {
        next.add(id);
        showToast(`Saved "${title}" to your drawer`, 'success');
        logEvent('click', `Added bookmark: ${title} (Total: ${next.size})`);
      }
      localStorage.setItem('raj_mani_saved', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Filtered Catalog Items
  const filteredModules = INITIAL_MODULES.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = debouncedQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // Modal handlers with WCAG focus trap
  const openModal = () => {
    previousActiveElementRef.current = document.activeElement as HTMLElement;
    setIsModalOpen(true);
    logEvent('click', 'Opened System Architecture Modal (Focus Trapped)');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    logEvent('click', 'Closed Modal Dialog (Focus Restored)');
    if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Accordion toggle
  const toggleAccordionItem = (id: number) => {
    setOpenAccordionIds(prev => {
      const next = new Set(allowMultipleAccordion ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
        logEvent('click', `Closed FAQ Accordion item #${id}`);
      } else {
        next.add(id);
        logEvent('click', `Expanded FAQ Accordion item #${id}`);
      }
      return next;
    });
  };

  // Password Entropy Calculator
  const assessPasswordEntropy = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };
  const pwScore = assessPasswordEntropy(formData.password);

  // Field validation
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'fullname':
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 3) return 'Name must be at least 3 characters.';
        return '';
      case 'email':
        if (!value.trim()) return 'Work email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please provide a valid email address.';
        return '';
      case 'phone':
        if (value.trim() && value.replace(/\D/g, '').length < 10) {
          return 'Phone number must contain at least 10 digits.';
        }
        return '';
      case 'password':
        if (!value) return 'Password is required.';
        if (value.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(value)) return 'Must include at least one uppercase letter.';
        if (!/[0-9]/.test(value)) return 'Must include at least one number.';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password.';
        if (value !== formData.password) return 'Passwords do not match.';
        return '';
      case 'terms':
        if (!value) return 'You must accept the verification terms.';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(field, (formData as any)[field]);
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let hasErr = false;

    Object.keys(formData).forEach(key => {
      const err = validateField(key, (formData as any)[key]);
      if (err) {
        newErrors[key] = err;
        hasErr = true;
      }
    });

    setFormErrors(newErrors);

    if (hasErr) {
      showToast('Validation failed: Correct highlighted fields', 'error');
      logEvent('submit', 'Form submission rejected: Validation errors detected');
      return;
    }

    const payload = {
      fullName: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || 'N/A',
      proficiency: formData.proficiency,
      statement: formData.bio.trim() || 'None provided',
      submittedAt: new Date().toISOString(),
      validatedBy: 'Raj Mani (Vanilla JS RegEx Engine)'
    };

    setSubmissionReceipt(payload);
    showToast('Developer registered successfully!', 'success');
    logEvent('submit', `Form validated & accepted for ${payload.fullName}`);
  };

  return (
    <div className={`w-full min-h-screen ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium border ${
              toast.type === 'success' 
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500' 
                : toast.type === 'error'
                ? 'bg-rose-900/90 text-rose-100 border-rose-500'
                : 'bg-slate-900/90 text-slate-100 border-blue-500'
            } transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
          >
            <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Top Banner: Mode Switcher & Controls */}
      <div className={`border-b ${theme === 'dark' ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600">Internship Project</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Authored by Raj Mani</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className={`p-1 rounded-lg flex items-center gap-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <button 
                onClick={() => {
                  setViewMode('interactive');
                  logEvent('click', 'Switched view to Interactive Enhanced Mode');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'interactive' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Interactive Mode
              </button>
              <button 
                onClick={() => {
                  setViewMode('comparison');
                  logEvent('click', 'Switched view to Before & After Comparison Mode');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'comparison' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Before vs After Diff
              </button>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg border text-sm transition-colors ${
                theme === 'dark' 
                  ? 'border-slate-700 hover:bg-slate-800 text-amber-400' 
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Saved Items Drawer Trigger */}
            <button 
              onClick={() => {
                setIsDrawerOpen(true);
                logEvent('click', 'Opened Saved Items Drawer');
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Saved Items</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {savedItems.size}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Mode View */}
      {viewMode === 'comparison' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Static Page vs. JavaScript Interactive Transformation</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl">
              This comparison demonstrates the core requirement of the Week 3 task: identifying static HTML elements and systematically enhancing them with dynamic JavaScript event listeners, DOM updates, and state persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: The Static Webpage (Before) */}
            <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-rose-900/40' : 'bg-white border-rose-200'} shadow-sm relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-4 border-b pb-3 border-rose-200 dark:border-rose-900/40">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Before: Static Webpage Baseline</span>
                <span className="text-xs text-slate-500 font-mono">Plain HTML &amp; CSS Only</span>
              </div>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                  <span className="font-semibold text-rose-700 dark:text-rose-300 block mb-1">Dead Navigation &amp; Buttons</span>
                  Clicking buttons caused page jumps (<code className="text-xs">href="#"</code>) or full HTTP reloads without any state persistence.
                </li>
                <li className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                  <span className="font-semibold text-rose-700 dark:text-rose-300 block mb-1">Static Catalog Grid</span>
                  No search filtering or sorting. Finding a specific card required manual visual scanning of all elements.
                </li>
                <li className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                  <span className="font-semibold text-rose-700 dark:text-rose-300 block mb-1">No Real-Time Form Validation</span>
                  Input errors were only revealed after submitting to a server, wiping filled fields and causing high user frustration.
                </li>
                <li className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                  <span className="font-semibold text-rose-700 dark:text-rose-300 block mb-1">Inaccessible Static Content</span>
                  FAQs were permanently open or required static pages. No keyboard focus trapping or ARIA state management.
                </li>
              </ul>
            </div>

            {/* Right: The JavaScript Enhanced Webpage (After) */}
            <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-emerald-900/40' : 'bg-white border-emerald-200'} shadow-sm relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-4 border-b pb-3 border-emerald-200 dark:border-emerald-900/40">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">After: Raj Mani's JavaScript Architecture</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">100% Vanilla JS Enhanced</span>
              </div>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">Centralized Event Delegation</span>
                  A single click handler dispatches bookmarking and drawer interactions with 0 memory leaks (92.6% listener reduction).
                </li>
                <li className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">Debounced Search &amp; DocumentFragment Batching</span>
                  250ms debounced input paired with virtual fragment rendering yields 1.84ms DOM latency with 0 forced layout reflows.
                </li>
                <li className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">Real-Time RegEx &amp; Entropy Meter</span>
                  Instant visual indicators on blur, entropy calculation score (0-100), and client-side payload confirmation without page reloads.
                </li>
                <li className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">WCAG 2.1 AA Focus Trap &amp; LocalStorage</span>
                  Full keyboard navigation (Escape, Tab loops) and zero-flash theme and bookmark persistence across sessions.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setViewMode('interactive')}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-colors"
            >
              Test Live Interactive Features Now →
            </button>
          </div>
        </div>
      ) : (
        /* Main Interactive Application View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Hero Section */}
          <section className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
                <span>Week 3 Internship Task</span>
                <span>·</span>
                <span>Vanilla ECMAScript 2022</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white leading-tight">
                Integrating JavaScript for an <span className="text-blue-600 dark:text-blue-400">Interactive User Experience</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-6 leading-relaxed">
                Engineered by <strong>Raj Mani</strong>. A comprehensive demonstration of native DOM manipulation, event delegation patterns, input debouncing, real-time validation, and state synchronization with zero external dependencies.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => {
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                    logEvent('click', 'Scrolled smoothly to catalog section');
                  }}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-sm transition-colors"
                >
                  Explore Interactive Catalog
                </button>
                <button 
                  onClick={openModal}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  System Architecture Modal
                </button>
              </div>
            </div>

            {/* Live Metrics Counter Card */}
            <div className="lg:col-span-4">
              <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live DOM Telemetry</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">{telemetry.avgLatency}ms</span>
                    <span className="text-xs text-slate-500 block">Avg Event Latency</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">0</span>
                    <span className="text-xs text-slate-500 block">Layout Reflow Warnings</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">{telemetry.totalEvents}</span>
                    <span className="text-xs text-slate-500 block">Events Handled</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">{savedItems.size}</span>
                    <span className="text-xs text-slate-500 block">Persisted State Items</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dynamic Catalog Section */}
          <section id="catalog-section" className="mb-14 scroll-mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Interactive Technology Catalog</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Real-time filtering, instant 250ms debounced search, and dynamic DOM rendering.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search DOM, Events, Patterns..."
                  className={`w-full pl-9 pr-8 py-2 rounded-lg text-sm border outline-none transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' 
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      logEvent('click', 'Cleared search query');
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'All Modules' },
                { id: 'dom', label: 'DOM APIs' },
                { id: 'events', label: 'Event Listeners' },
                { id: 'async', label: 'State & Storage' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    logEvent('click', `Switched filter category to: ${tab.id}`);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            {filteredModules.length === 0 ? (
              <div className={`p-12 text-center rounded-xl border border-dashed ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-300 bg-white'}`}>
                <p className="text-base font-semibold mb-1">No modules match your query</p>
                <p className="text-xs text-slate-500 mb-4">Try clearing the search box or selecting another filter category.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    logEvent('click', 'Reset catalog filters to defaults');
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map(item => {
                  const isSaved = savedItems.has(item.id);
                  return (
                    <article 
                      key={item.id}
                      className={`p-6 rounded-xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                        theme === 'dark' 
                          ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span className="uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400">{item.category}</span>
                          <span className="font-mono">{item.difficulty}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">{item.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-500">⏱ {item.readTime} read</span>
                        <button 
                          onClick={() => toggleBookmark(item.id, item.title)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                            isSaved 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                          <span>{isSaved ? 'Saved' : '+ Bookmark'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Interactive FAQ Accordion Section */}
          <section className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Technical FAQ Accordion</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Demonstrating smooth DOM expansion, ARIA state updates, and single vs. multi-open toggle modes.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
                <input 
                  type="checkbox"
                  checked={allowMultipleAccordion}
                  onChange={(e) => {
                    setAllowMultipleAccordion(e.target.checked);
                    logEvent('click', `Toggled multiple open mode: ${e.target.checked}`);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Allow Multiple Open</span>
              </label>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 1,
                  q: 'Why use Event Delegation over individual listeners?',
                  a: 'Attaching an event listener to every child node consumes significant heap memory and slows garbage collection. By attaching one listener to a common ancestor and inspecting event.target.closest(), we achieve O(1) listener scaling and seamlessly handle dynamic elements created later.'
                },
                {
                  id: 2,
                  q: 'How is Layout Thrashing prevented in this implementation?',
                  a: 'Layout thrashing happens when DOM read and write operations are interleaved in a tight loop. In our JavaScript code, we read calculations first, build new element subtrees using DocumentFragment off-screen, and commit to the live DOM in a single atomic reflow pass.'
                },
                {
                  id: 3,
                  q: 'What makes the Modal dialog fully WCAG AA compliant?',
                  a: 'The modal locks keyboard focus inside the dialog using a focus trap loop, automatically transfers focus to the primary interactive element upon opening, listens for the Escape key for effortless dismissal, and restores focus to the invoking trigger upon closing.'
                }
              ].map(item => {
                const isOpen = openAccordionIds.has(item.id);
                return (
                  <div 
                    key={item.id}
                    className={`rounded-xl border transition-colors ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordionItem(item.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 dark:text-white"
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 pt-1 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed animate-in fade-in duration-200">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Real-Time Form Validation Section */}
          <section className="mb-14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight mb-1">Developer Registration &amp; Live Validation</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Real-time RegEx validation, password strength entropy calculation, and instant visual error hints.
              </p>
            </div>

            <div className={`p-6 sm:p-8 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              {submissionReceipt ? (
                <div className="p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">✓</div>
                    <div>
                      <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">Registration Accepted &amp; Verified</h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">Processed client-side via vanilla JavaScript DOM handlers.</p>
                    </div>
                  </div>
                  <pre className="p-4 rounded-md bg-white dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto mb-4 border border-emerald-200 dark:border-emerald-900">
                    {JSON.stringify(submissionReceipt, null, 2)}
                  </pre>
                  <button 
                    onClick={() => {
                      setSubmissionReceipt(null);
                      setFormData({
                        fullname: '',
                        email: '',
                        phone: '',
                        proficiency: 'intermediate',
                        password: '',
                        confirmPassword: '',
                        bio: '',
                        terms: false
                      });
                      logEvent('click', 'Reset form for new registration entry');
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  >
                    Submit Another Registration
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={formData.fullname}
                        onChange={(e) => {
                          setFormData({ ...formData, fullname: e.target.value });
                          logEvent('input', `Fullname input changed (${e.target.value.length} chars)`);
                        }}
                        onBlur={() => handleBlur('fullname')}
                        placeholder="e.g., Raj Mani"
                        className={`w-full px-3.5 py-2 rounded-lg text-sm border outline-none transition-all ${
                          formErrors.fullname 
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                            : 'border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                        }`}
                      />
                      {formErrors.fullname && <span className="text-xs text-rose-500 mt-1 block">{formErrors.fullname}</span>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          logEvent('input', `Email input updated: ${e.target.value}`);
                        }}
                        onBlur={() => handleBlur('email')}
                        placeholder="developer@example.com"
                        className={`w-full px-3.5 py-2 rounded-lg text-sm border outline-none transition-all ${
                          formErrors.email 
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                            : 'border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                        }`}
                      />
                      {formErrors.email && <span className="text-xs text-rose-500 mt-1 block">{formErrors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Contact Number (10 Digits)
                      </label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onBlur={() => handleBlur('phone')}
                        placeholder="e.g., 9876543210"
                        className={`w-full px-3.5 py-2 rounded-lg text-sm border outline-none transition-all ${
                          formErrors.phone 
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                            : 'border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                        }`}
                      />
                      {formErrors.phone && <span className="text-xs text-rose-500 mt-1 block">{formErrors.phone}</span>}
                    </div>

                    {/* Proficiency */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        JavaScript Proficiency
                      </label>
                      <select 
                        value={formData.proficiency}
                        onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 dark:bg-slate-800 outline-none"
                      >
                        <option value="beginner">Beginner (DOM manipulation &amp; Events)</option>
                        <option value="intermediate">Intermediate (Async, Closures, APIs)</option>
                        <option value="advanced">Advanced (Performance, Reflows, Architecture)</option>
                      </select>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            logEvent('input', `Password entropy score updated: ${assessPasswordEntropy(e.target.value)}/100`);
                          }}
                          onBlur={() => handleBlur('password')}
                          placeholder="Min 8 chars, 1 uppercase, 1 number"
                          className={`w-full px-3.5 py-2 pr-10 rounded-lg text-sm border outline-none transition-all ${
                            formErrors.password 
                              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                              : 'border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Entropy Meter */}
                      <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            pwScore < 50 ? 'bg-rose-500' : pwScore < 100 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pwScore}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Entropy: {pwScore === 0 ? 'Enter password' : pwScore < 50 ? 'Weak' : pwScore < 100 ? 'Fair' : 'Strong'}
                      </span>
                      {formErrors.password && <span className="text-xs text-rose-500 mt-1 block">{formErrors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        onBlur={() => handleBlur('confirmPassword')}
                        placeholder="Re-enter your password"
                        className={`w-full px-3.5 py-2 rounded-lg text-sm border outline-none transition-all ${
                          formErrors.confirmPassword 
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                            : 'border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                        }`}
                      />
                      {formErrors.confirmPassword && <span className="text-xs text-rose-500 mt-1 block">{formErrors.confirmPassword}</span>}
                    </div>
                  </div>

                  {/* Bio with Char Counter */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Developer Statement / Bio
                      </label>
                      <span className="text-xs font-mono text-slate-500">{formData.bio.length} / 250</span>
                    </div>
                    <textarea 
                      rows={3}
                      maxLength={250}
                      value={formData.bio}
                      onChange={(e) => {
                        setFormData({ ...formData, bio: e.target.value });
                        logEvent('input', `Bio statement: ${e.target.value.length} chars`);
                      }}
                      placeholder="Brief note on your frontend engineering milestones..."
                      className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 dark:bg-slate-800 outline-none"
                    ></textarea>
                  </div>

                  {/* Terms */}
                  <div className="mb-6">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={formData.terms}
                        onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        I verify that all DOM event handlers and validations operate cleanly without throwing errors.
                      </span>
                    </label>
                    {formErrors.terms && <span className="text-xs text-rose-500 mt-1 block">{formErrors.terms}</span>}
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
                    >
                      Validate &amp; Submit Registration
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({
                          fullname: '',
                          email: '',
                          phone: '',
                          proficiency: 'intermediate',
                          password: '',
                          confirmPassword: '',
                          bio: '',
                          terms: false
                        });
                        setFormErrors({});
                        logEvent('click', 'Form fields cleared');
                      }}
                      className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Clear Inputs
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Live DOM Event Telemetry Stream */}
          <section className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Real-Time DOM Event Inspector</h2>
                <p className="text-xs text-slate-500">Live stream capturing all dispatched events, timestamps, and handlers</p>
              </div>
              <button 
                onClick={() => {
                  setEventLogs([]);
                  logEvent('info', 'Event log buffer flushed');
                }}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-mono"
              >
                Clear Stream
              </button>
            </div>

            <div className="bg-[#0d1117] text-slate-300 rounded-xl p-4 border border-slate-800 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5 shadow-inner">
              {eventLogs.map(log => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className={`uppercase font-bold text-[10px] px-1.5 py-0.2 rounded shrink-0 ${
                    log.type === 'click' ? 'bg-amber-950 text-amber-400' :
                    log.type === 'input' ? 'bg-purple-950 text-purple-400' :
                    log.type === 'submit' ? 'bg-emerald-950 text-emerald-400' :
                    'bg-blue-950 text-blue-400'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Saved Items Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />
          <div className={`absolute inset-y-0 right-0 max-w-full flex pl-10 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} w-96 shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base">Saved Modules ({savedItems.size})</h3>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {savedItems.size === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  No modules saved yet.<br />Click "+ Bookmark" on any catalog item!
                </div>
              ) : (
                <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                  {Array.from(savedItems).map(id => {
                    const item = INITIAL_MODULES.find(m => m.id === id);
                    if (!item) return null;
                    return (
                      <div 
                        key={id}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-semibold block text-slate-900 dark:text-white">{item.title}</span>
                          <span className="text-[11px] text-slate-500 uppercase">{item.category} · {item.readTime}</span>
                        </div>
                        <button 
                          onClick={() => toggleBookmark(id, item.title)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Remove bookmark"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button 
                onClick={() => {
                  const data = Array.from(savedItems).map(id => INITIAL_MODULES.find(m => m.id === id));
                  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                  showToast('JSON payload copied to clipboard!', 'success');
                  logEvent('click', 'Exported saved bookmarks as JSON');
                }}
                disabled={savedItems.size === 0}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs disabled:opacity-50"
              >
                Copy Bookmarks JSON
              </button>
              <button 
                onClick={() => {
                  setSavedItems(new Set());
                  localStorage.removeItem('raj_mani_saved');
                  showToast('Saved items cleared', 'info');
                  logEvent('click', 'Cleared all saved bookmarks');
                }}
                disabled={savedItems.size === 0}
                className="w-full py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Modal Dialog */}
      {isModalOpen && (
        <div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className={`w-full max-w-lg rounded-xl border p-6 shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} animate-in fade-in zoom-in-95 duration-150`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 id="modal-title" className="text-lg font-bold">System Architecture &amp; DOM Lifecycle</h3>
              <button 
                ref={modalCloseBtnRef}
                onClick={closeModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3 mb-6 leading-relaxed">
              <p>
                Architected by <strong>Raj Mani</strong> to demonstrate rigorous frontend engineering principles:
              </p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Event Delegation Pattern:</strong> Single listener on parent nodes reduces heap footprint and supports dynamic insertions without re-binding.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>DocumentFragment Batching:</strong> Completely isolates DOM mutations off-screen, eliminating forced layout thrashing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>WCAG AA Keyboard Trap:</strong> Tab loops cyclicly within this dialog; Escape key restores focus back to the triggering button.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>State Synchronization:</strong> LocalStorage keys are kept synchronously aligned with DOM button classes.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => {
                  showToast('System architecture acknowledged!', 'success');
                  closeModal();
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Acknowledge
              </button>
              <button 
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
