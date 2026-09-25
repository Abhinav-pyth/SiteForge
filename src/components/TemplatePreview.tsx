import React from 'react';

interface TemplatePreviewProps {
  templateId: string;
  className?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId, className = '' }) => {
  const previews: Record<string, React.ReactNode> = {
    'saas-landing': (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded"></div>
          <div className="h-2 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="h-3 w-3/4 bg-gray-800 rounded mb-2"></div>
          <div className="h-2 w-full bg-gray-400 rounded mb-1"></div>
          <div className="h-2 w-2/3 bg-gray-400 rounded mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-blue-600 rounded"></div>
            <div className="h-6 w-20 bg-white border border-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    ),
    'restaurant': (
      <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 p-4 flex flex-col">
        <div className="text-center mb-3">
          <div className="h-3 w-24 bg-amber-900 rounded mx-auto mb-2"></div>
          <div className="h-2 w-32 bg-amber-700 rounded mx-auto"></div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="bg-white rounded p-2">
            <div className="h-12 bg-amber-200 rounded mb-1"></div>
            <div className="h-2 w-full bg-gray-300 rounded"></div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="h-12 bg-amber-200 rounded mb-1"></div>
            <div className="h-2 w-full bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    ),
    'portfolio': (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-slate-100 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-20 bg-gray-800 rounded"></div>
          <div className="flex gap-2">
            <div className="h-2 w-8 bg-gray-400 rounded"></div>
            <div className="h-2 w-8 bg-gray-400 rounded"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-1/2 pr-3">
            <div className="h-3 w-full bg-gray-800 rounded mb-2"></div>
            <div className="h-2 w-full bg-gray-400 rounded mb-1"></div>
            <div className="h-2 w-3/4 bg-gray-400 rounded mb-3"></div>
            <div className="h-5 w-16 bg-gray-800 rounded"></div>
          </div>
          <div className="w-1/2 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded"></div>
        </div>
      </div>
    ),
    'ecommerce': (
      <div className="w-full h-full bg-gradient-to-br from-pink-50 to-rose-100 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-16 bg-gray-800 rounded"></div>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded p-2 flex flex-col">
              <div className="h-14 bg-gradient-to-br from-pink-200 to-rose-200 rounded mb-2"></div>
              <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
              <div className="h-2 w-1/2 bg-pink-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    ),
    'agency': (
      <div className="w-full h-full bg-gradient-to-br from-violet-50 to-purple-100 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg"></div>
          <div className="h-3 w-20 bg-gray-800 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="h-4 w-3/4 bg-gray-800 rounded mb-2"></div>
          <div className="h-2 w-full bg-gray-400 rounded mb-1"></div>
          <div className="h-2 w-2/3 bg-gray-400 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-12 bg-violet-200 rounded"></div>
            <div className="h-12 bg-purple-200 rounded"></div>
            <div className="h-12 bg-pink-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    'real-estate': (
      <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-24 bg-emerald-900 rounded"></div>
          <div className="h-5 w-16 bg-emerald-600 rounded"></div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="bg-white rounded overflow-hidden">
            <div className="h-16 bg-gradient-to-br from-emerald-200 to-teal-200"></div>
            <div className="p-2">
              <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
              <div className="h-2 w-2/3 bg-emerald-600 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded overflow-hidden">
            <div className="h-16 bg-gradient-to-br from-teal-200 to-cyan-200"></div>
            <div className="p-2">
              <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
              <div className="h-2 w-2/3 bg-emerald-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    'education': (
      <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-blue-100 p-4 flex flex-col">
        <div className="text-center mb-3">
          <div className="h-3 w-28 bg-blue-900 rounded mx-auto mb-2"></div>
          <div className="h-2 w-32 bg-blue-600 rounded mx-auto"></div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded p-2">
              <div className="w-8 h-8 bg-blue-200 rounded mb-1"></div>
              <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
              <div className="h-2 w-1/2 bg-blue-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    ),
    'blog': (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-zinc-100 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-20 bg-gray-800 rounded"></div>
          <div className="flex gap-2">
            <div className="h-2 w-8 bg-gray-400 rounded"></div>
            <div className="h-2 w-8 bg-gray-400 rounded"></div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-white rounded p-3">
            <div className="h-3 w-3/4 bg-gray-800 rounded mb-2"></div>
            <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
            <div className="h-2 w-2/3 bg-gray-300 rounded"></div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="h-3 w-3/4 bg-gray-800 rounded mb-2"></div>
            <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
            <div className="h-2 w-2/3 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    ),
    'healthcare': (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-sky-100 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <div className="h-3 w-20 bg-blue-900 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="h-3 w-2/3 bg-gray-800 rounded mb-2"></div>
          <div className="h-2 w-full bg-gray-400 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 bg-blue-200 rounded"></div>
            <div className="h-10 bg-sky-200 rounded"></div>
            <div className="h-10 bg-cyan-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    'event': (
      <div className="w-full h-full bg-gradient-to-br from-fuchsia-50 to-pink-100 p-4 flex flex-col">
        <div className="text-center mb-3">
          <div className="h-4 w-32 bg-fuchsia-900 rounded mx-auto mb-2"></div>
          <div className="h-2 w-24 bg-fuchsia-600 rounded mx-auto"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="h-16 bg-gradient-to-br from-fuchsia-200 to-pink-200 rounded"></div>
            <div className="h-16 bg-gradient-to-br from-pink-200 to-rose-200 rounded"></div>
            <div className="h-16 bg-gradient-to-br from-rose-200 to-red-200 rounded"></div>
            <div className="h-16 bg-gradient-to-br from-purple-200 to-fuchsia-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    'startup': (
      <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-violet-100 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded"></div>
            <div className="h-3 w-16 bg-gray-800 rounded"></div>
          </div>
          <div className="h-5 w-14 bg-indigo-600 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="h-4 w-3/4 bg-gray-800 rounded mb-2"></div>
          <div className="h-2 w-full bg-gray-400 rounded mb-1"></div>
          <div className="h-2 w-2/3 bg-gray-400 rounded mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-indigo-600 rounded"></div>
            <div className="h-6 w-20 bg-white border border-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    ),
    'fashion': (
      <div className="w-full h-full bg-gradient-to-br from-neutral-50 to-stone-100 p-4 flex flex-col">
        <div className="text-center mb-3">
          <div className="h-3 w-20 bg-neutral-900 rounded mx-auto mb-1"></div>
          <div className="h-2 w-24 bg-neutral-600 rounded mx-auto"></div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded overflow-hidden flex flex-col">
              <div className="h-16 bg-gradient-to-br from-neutral-200 to-stone-200"></div>
              <div className="p-2 flex-1 flex flex-col justify-end">
                <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
                <div className="h-2 w-1/2 bg-neutral-900 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {previews[templateId] || (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-4xl opacity-30">🌐</div>
        </div>
      )}
    </div>
  );
};
