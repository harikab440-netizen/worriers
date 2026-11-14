import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Header: React.FC = () => {
  const { user, signOut, switchDemoUser } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    success('Signed out', 'You have been successfully signed out.');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                Campus Lost & Found
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Safe Student Handoff
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Browse Items
            </Link>

            <Link
              to="/listings/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 ml-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Report Item
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-200">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* Profile Pill & Signout */}
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user.display_name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-200">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}

            {/* Quick Demo Account Selector (Helpful for fast evaluation) */}
            <div className="relative ml-2">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                title="Switch demo persona for testing"
                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                Demo User
              </button>
              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchDemoUser('user-demo-1');
                      setDemoMenuOpen(false);
                      success('Switched Persona', 'Signed in as Alex Rivera (Student 1)');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
                  >
                    <span>Alex Rivera</span>
                    <span className="text-[10px] text-slate-400">Owner</span>
                  </button>
                  <button
                    onClick={() => {
                      switchDemoUser('user-demo-2');
                      setDemoMenuOpen(false);
                      success('Switched Persona', 'Signed in as Jordan Lee (Student 2)');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
                  >
                    <span>Jordan Lee</span>
                    <span className="text-[10px] text-slate-400">Finder</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Browse Items
          </Link>

          <Link
            to="/listings/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium text-white bg-indigo-600"
          >
            <PlusCircle className="w-5 h-5" />
            Report Lost or Found Item
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <LayoutDashboard className="w-5 h-5" />
                My Dashboard ({user.display_name})
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Demo Persona switch */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Test Persona:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  switchDemoUser('user-demo-1');
                  setMobileMenuOpen(false);
                  success('Switched', 'Signed in as Alex Rivera');
                }}
                className="px-2 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-700 text-center hover:bg-indigo-50"
              >
                Alex Rivera
              </button>
              <button
                onClick={() => {
                  switchDemoUser('user-demo-2');
                  setMobileMenuOpen(false);
                  success('Switched', 'Signed in as Jordan Lee');
                }}
                className="px-2 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-700 text-center hover:bg-indigo-50"
              >
                Jordan Lee
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
