import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthForm } from '../components/auth/AuthForm';
import { Compass, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, switchDemoUser } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSignIn = async ({ email, password }: any) => {
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toastError('Sign In Failed', error);
    } else {
      success('Welcome back!', 'You have successfully signed in.');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 animate-in fade-in duration-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-100 mb-4">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your account</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Access your campus listings and coordinate item handoffs
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <AuthForm mode="signin" onSubmit={handleSignIn} isLoading={isLoading} />

        {/* Quick Demo Accounts for fast testing */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
            Quick Demo Accounts (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                switchDemoUser('user-demo-1');
                success('Signed In', 'Logged in as Demo Student Alex Rivera');
                navigate(from, { replace: true });
              }}
              className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Alex Rivera</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Listing Owner</span>
            </button>

            <button
              type="button"
              onClick={() => {
                switchDemoUser('user-demo-2');
                success('Signed In', 'Logged in as Demo Student Jordan Lee');
                navigate(from, { replace: true });
              }}
              className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Jordan Lee</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Item Finder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
