'use client';

// ============================================================================
// Global Navigation Bar
// Allows seamless switching between Patient, Doctor, and Admin roles for hackathon evaluation
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ShieldAlert, Stethoscope, User, Settings, Globe } from 'lucide-react';
import { SupportedLanguage } from '@/types';

interface NavbarProps {
  currentLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export function Navbar({ currentLanguage = 'en', onLanguageChange }: NavbarProps) {
  const pathname = usePathname();

  const isPatient = pathname.startsWith('/patient');
  const isDoctor = pathname.startsWith('/doctor');
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-700 transition">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                  CareOrchestrate
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                    AI Kernel
                  </span>
                </span>
                <p className="text-xs text-slate-500 hidden sm:block">Healthcare AI Model Orchestration Platform</p>
              </div>
            </Link>
          </div>

          {/* Role Navigation Switcher (Hackathon Test Bar) */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Link
              href="/patient"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                isPatient
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Patient Portal
            </Link>

            <Link
              href="/doctor"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                isDoctor
                  ? 'bg-white text-teal-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor Station
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                isAdmin
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Admin & Orchestrator
            </Link>
          </nav>

          {/* Right Controls: Language & Demo Indicator */}
          <div className="flex items-center gap-3">
            {onLanguageChange && (
              <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1 bg-white text-xs text-slate-700">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={currentLanguage}
                  onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                  className="bg-transparent border-none text-xs font-medium focus:outline-none cursor-pointer"
                  aria-label="Select preferred language"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>
            )}

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Demo Mode Active
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
