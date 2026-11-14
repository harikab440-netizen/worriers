import React, { useState } from 'react';
import { ReplyPreference } from '@campus/shared';
import { Send, AlertCircle, Shield, Loader2 } from 'lucide-react';

interface ContactRequestFormProps {
  listingTitle: string;
  isOwner: boolean;
  onSubmit: (data: { message: string; reply_preference: ReplyPreference }) => Promise<void>;
  isSubmitting: boolean;
}

export const ContactRequestForm: React.FC<ContactRequestFormProps> = ({
  listingTitle,
  isOwner,
  onSubmit,
  isSubmitting
}) => {
  const [message, setMessage] = useState('');
  const [replyPreference, setReplyPreference] = useState<ReplyPreference>('in_app');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isOwner) {
      setError('You cannot submit a contact request to your own listing.');
      return;
    }

    const trimmed = message.trim();
    if (trimmed.length < 10 || trimmed.length > 1000) {
      setError('Message must be between 10 and 1,000 characters.');
      return;
    }

    await onSubmit({
      message: trimmed,
      reply_preference: replyPreference
    });
  };

  if (isOwner) {
    return (
      <div className="p-4 bg-slate-100 rounded-2xl text-center text-slate-600 text-xs">
        This is your own listing. You can view responses from students in your{' '}
        <span className="font-semibold text-slate-800">Dashboard</span>.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-800">
            Message to Poster
          </label>
          <span
            className={`text-xs ${
              message.length > 1000
                ? 'text-rose-500 font-semibold'
                : message.length >= 10
                ? 'text-slate-400'
                : 'text-amber-500'
            }`}
          >
            {message.length}/1000 chars (min 10)
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Describe why you believe this is your item, or how the owner can safely verify and retrieve "${listingTitle}"...`}
          className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
        />
        {error && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>

      {/* Reply Preference Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">Preferred Reply Method</label>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={`p-3 rounded-xl border text-xs cursor-pointer flex flex-col transition-all ${
              replyPreference === 'in_app'
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 font-semibold'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="reply_pref"
              checked={replyPreference === 'in_app'}
              onChange={() => setReplyPreference('in_app')}
              className="sr-only"
            />
            <span>In-App Message</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">
              Check dashboard for owner response
            </span>
          </label>

          <label
            className={`p-3 rounded-xl border text-xs cursor-pointer flex flex-col transition-all ${
              replyPreference === 'email_notification'
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 font-semibold'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="reply_pref"
              checked={replyPreference === 'email_notification'}
              onChange={() => setReplyPreference('email_notification')}
              className="sr-only"
            />
            <span>Email Notification</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">
              Receive notification alert
            </span>
          </label>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200">
        <Shield className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-700">Privacy Notice:</strong> Your message is visible only to
          the listing poster. Never share passwords, social security numbers, or sensitive banking
          details.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {isSubmitting ? 'Sending Request...' : 'Send Protected Contact Request'}
      </button>
    </form>
  );
};
