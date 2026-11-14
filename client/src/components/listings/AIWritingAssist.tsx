import React, { useState } from 'react';
import { Sparkles, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ItemCategory } from '@campus/shared';

interface AIWritingAssistProps {
  title: string;
  description: string;
  onApplyCategory: (category: ItemCategory) => void;
  onApplyDescription: (description: string) => void;
}

export const AIWritingAssist: React.FC<AIWritingAssistProps> = ({
  title,
  description,
  onApplyCategory,
  onApplyDescription
}) => {
  const { token } = useAuth();
  const { warning, error: toastError } = useToast();

  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);

  const [suggestedCategory, setSuggestedCategory] = useState<{
    category: ItemCategory;
    confidence: number;
    reason: string;
  } | null>(null);

  const [improvedDescription, setImprovedDescription] = useState<{
    text: string;
    warnings: string[];
  } | null>(null);

  const handleSuggestCategory = async () => {
    if (!token) return;
    if (title.trim().length < 3 || description.trim().length < 10) {
      warning(
        'More details needed',
        'Please enter at least a short title and 10+ characters of description for category suggestion.'
      );
      return;
    }

    setLoadingCategory(true);
    setSuggestedCategory(null);
    try {
      const res = await api.suggestCategory(title, description, token);
      setSuggestedCategory({
        category: res.category,
        confidence: res.confidence,
        reason: res.reason
      });
    } catch (err: any) {
      toastError(
        'AI Suggestion Unavailable',
        err.message || 'Gemini assistance is currently unavailable. Please select category manually.'
      );
    } finally {
      setLoadingCategory(false);
    }
  };

  const handleImproveDescription = async () => {
    if (!token) return;
    if (description.trim().length < 10) {
      warning(
        'Draft too short',
        'Please write a draft description of at least 10 characters to improve.'
      );
      return;
    }

    setLoadingDescription(true);
    setImprovedDescription(null);
    try {
      const res = await api.improveDescription(description, token);
      setImprovedDescription({
        text: res.improved_description,
        warnings: res.warnings
      });
    } catch (err: any) {
      toastError(
        'AI Assistance Unavailable',
        err.message || 'Gemini assistance is currently unavailable. Non-AI features continue normally.'
      );
    } finally {
      setLoadingDescription(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/40 rounded-2xl p-4 border border-indigo-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
            Gemini AI Assistant (Optional)
          </h4>
        </div>
        <span className="text-[11px] text-indigo-500 font-medium">Never auto-overwrites</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSuggestCategory}
          disabled={loadingCategory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 shadow-sm transition-all disabled:opacity-50"
        >
          {loadingCategory ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          )}
          Suggest Category
        </button>

        <button
          type="button"
          onClick={handleImproveDescription}
          disabled={loadingDescription}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 shadow-sm transition-all disabled:opacity-50"
        >
          {loadingDescription ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          )}
          Polish Description & Privacy Check
        </button>
      </div>

      {/* Suggested Category Box */}
      {suggestedCategory && (
        <div className="p-3 bg-white rounded-xl border border-indigo-200 text-xs space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Suggested: <span className="text-indigo-600 font-bold">{suggestedCategory.category}</span>{' '}
              <span className="text-[11px] text-slate-400 font-normal">
                ({Math.round(suggestedCategory.confidence * 100)}% match)
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                onApplyCategory(suggestedCategory.category);
                setSuggestedCategory(null);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              <Check className="w-3 h-3" />
              Apply Category
            </button>
          </div>
          <p className="text-slate-500 text-[11px]">{suggestedCategory.reason}</p>
        </div>
      )}

      {/* Improved Description Box */}
      {improvedDescription && (
        <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800">Suggested Polished Description:</span>
            <button
              type="button"
              onClick={() => {
                onApplyDescription(improvedDescription.text);
                setImprovedDescription(null);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm"
            >
              <Check className="w-3 h-3" />
              Use This Text
            </button>
          </div>

          <p className="text-slate-700 italic bg-purple-50/50 p-2.5 rounded-lg border border-purple-100 whitespace-pre-wrap leading-relaxed">
            {improvedDescription.text}
          </p>

          {improvedDescription.warnings.length > 0 && (
            <div className="space-y-1 pt-1">
              {improvedDescription.warnings.map((w, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
