import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-24 text-center animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-semibold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        The page you are looking for doesn't exist, has been removed, or has moved to a new URL.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campus Listings
        </Link>
      </div>
    </div>
  );
};
