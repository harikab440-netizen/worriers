import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { SignUpSchema, SignInSchema } from '@campus/shared';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, isLoading }) => {
  const isSignUp = mode === 'signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errMap: Record<string, string> = {};

    if (isSignUp) {
      const res = SignUpSchema.safeParse({
        email,
        password,
        display_name: displayName
      });
      if (!res.success) {
        res.error.issues.forEach((i) => {
          errMap[i.path[0] as string] = i.message;
        });
      }
    } else {
      const res = SignInSchema.safeParse({ email, password });
      if (!res.success) {
        res.error.issues.forEach((i) => {
          errMap[i.path[0] as string] = i.message;
        });
      }
    }

    setErrors(errMap);
    return Object.keys(errMap).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isSignUp) {
      await onSubmit({ email, password, display_name: displayName });
    } else {
      await onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display Name (Only for Sign Up) */}
      {isSignUp && (
        <div>
          <label
            htmlFor="auth-display-name"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Full Name or Campus Nickname
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="auth-display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              autoComplete="name"
              className={`w-full pl-9 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:ring-2 transition-all ${
                errors.display_name
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.display_name && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.display_name}
            </p>
          )}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Campus Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@campus.edu"
            autoComplete="email"
            className={`w-full pl-9 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:ring-2 transition-all ${
              errors.email
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="auth-password"
            className="block text-xs font-semibold text-slate-700"
          >
            Password
          </label>
          {!isSignUp && (
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="auth-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignUp ? 'At least 6 characters' : 'Enter password'}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className={`w-full pl-9 pr-10 py-2.5 text-sm bg-white border rounded-xl focus:ring-2 transition-all ${
              errors.password
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSignUp ? 'Create Campus Account' : 'Sign In'}
        </button>
      </div>

      {/* Switch mode link */}
      <div className="text-center pt-3 text-xs text-slate-500">
        {isSignUp ? (
          <span>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
              Sign In
            </Link>
          </span>
        ) : (
          <span>
            New to Campus Lost & Found?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </span>
        )}
      </div>
    </form>
  );
};
