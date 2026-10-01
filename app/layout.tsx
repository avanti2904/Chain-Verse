import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/common/Navbar';

export const metadata: Metadata = {
  title: 'CareOrchestrate AI | Healthcare AI Model Orchestration Platform',
  description: 'Intelligent coordination layer routing healthcare tasks to specialized models, clinical rules, and clinician review.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <p className="font-semibold text-slate-700">CareOrchestrate AI • Healthcare AI Model Orchestration Platform</p>
            <p>One healthcare system. Multiple specialized AI models. One intelligent orchestration layer.</p>
            <p className="text-[11px] text-slate-400 pt-1">
              Fictional Demo Environment • Non-diagnostic medical assistance only • Clinician verification required
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
