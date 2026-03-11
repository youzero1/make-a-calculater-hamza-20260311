'use client';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'equals' | 'clear' | 'zero';
  className?: string;
}

export default function Button({
  label,
  onClick,
  variant = 'default',
  className = '',
}: ButtonProps) {
  const base =
    'flex items-center justify-center rounded-xl text-xl font-semibold cursor-pointer select-none transition-all duration-100 active:scale-95 shadow-md h-16';

  const variants: Record<string, string> = {
    default:
      'bg-gray-600 hover:bg-gray-500 text-white',
    operator:
      'bg-amber-500 hover:bg-amber-400 text-white',
    equals:
      'bg-amber-500 hover:bg-amber-400 text-white',
    clear:
      'bg-red-500 hover:bg-red-400 text-white',
    zero:
      'bg-gray-600 hover:bg-gray-500 text-white col-span-2',
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      aria-label={label}
    >
      {label}
    </button>
  );
}
