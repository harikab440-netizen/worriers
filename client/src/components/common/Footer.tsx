import React from 'react';
import { ShieldCheck, Lock, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Privacy-First Handoff</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Contact information is never shown publicly. Coordinate returns safely via protected
                in-app contact requests.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Safe Campus Meetings</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Always meet in well-lit public campus spaces such as the Student Center or Library
                help desk to exchange items.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Community Trust</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Campus Lost & Found is built for students, faculty, and staff. Be honest, verify
                ownership questions, and mark items returned.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Campus Lost & Found. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Powered by Supabase & Gemini GenAI</span>
            <span>Secure Role-Based Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
