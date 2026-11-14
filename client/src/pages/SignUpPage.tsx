import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthForm } from '../components/auth/AuthForm';
import { Compass } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signUp } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async ({ email, password, display_name }: any) => {
    setIsLoading(true);
    const { error } = await signUp(email, password, display_name);
    setIsLoading(false);

    if (error) {
      toastError('Registration Failed', error);
    } else {
      success(
        'Account Created!',
        'Your campus account is ready. If email confirmation is enabled on your domain, check your inbox.'
      );
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 animate-in fade-in duration-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-100 mb-4">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Join the campus lost and found community to report and claim items
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <AuthForm mode="signup" onSubmit={handleSignUp} isLoading={isLoading} />
      </div>
    </div>
  );
};
