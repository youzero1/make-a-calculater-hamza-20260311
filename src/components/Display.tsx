'use client';

interface DisplayProps {
  expression: string;
  current: string;
}

export default function Display({ expression, current }: DisplayProps) {
  const fontSize =
    current.length > 12
      ? 'text-2xl'
      : current.length > 9
      ? 'text-3xl'
      : 'text-4xl';

  return (
    <div className="bg-gray-900 rounded-xl p-4 mb-4 min-h-[100px] flex flex-col justify-between shadow-inner">
      <div className="text-gray-400 text-sm text-right h-6 overflow-hidden truncate">
        {expression || '\u00A0'}
      </div>
      <div
        className={`text-white font-mono font-bold text-right overflow-hidden truncate ${fontSize}`}
      >
        {current || '0'}
      </div>
    </div>
  );
}
