'use client';

interface DisplayProps {
  display: string;
  expression: string;
  hasError: boolean;
}

export default function Display({ display, expression, hasError }: DisplayProps) {
  const displayLength = display.length;
  const fontSize =
    displayLength > 12
      ? 'text-xl'
      : displayLength > 9
      ? 'text-2xl'
      : displayLength > 6
      ? 'text-3xl'
      : 'text-4xl';

  return (
    <div className="px-6 py-5 bg-slate-900 border-b border-slate-700">
      <div className="min-h-6 text-right text-slate-400 text-sm truncate mb-2">
        {expression || '\u00A0'}
      </div>
      <div
        className={`text-right font-light tracking-wider truncate ${
          hasError ? 'text-red-400 text-2xl' : `text-white ${fontSize}`
        }`}
      >
        {display}
      </div>
    </div>
  );
}
