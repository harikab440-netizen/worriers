import React, { useRef, useState } from 'react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_MIME_TYPES } from '@campus/shared';

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  onRemoveCurrentImage?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onFileSelect,
  onRemoveCurrentImage
}) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
      setError('Please select a valid JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError('Image file exceeds the 5 MB maximum size limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
    onRemoveCurrentImage?.();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Item Photo <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <span className="text-xs text-slate-400">JPEG, PNG, or WebP up to 5 MB</span>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer text-center ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50'
            : preview
            ? 'border-slate-300 bg-slate-50'
            : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
          aria-label="Upload item image"
        />

        {preview ? (
          <div className="relative inline-block group">
            <img
              src={preview}
              alt="Item preview"
              className="max-h-56 rounded-xl object-contain shadow-sm border border-slate-200"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700 transition-colors focus:ring-2 focus:ring-rose-500"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-slate-500 mt-2">Click to replace this photo</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Drop photo here, or <span className="text-indigo-600 underline">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add a clear photo to help owners identify their item faster
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
