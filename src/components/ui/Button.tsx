import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'subtle';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500/20 text-brand-200 border-brand-500/30 hover:bg-brand-500/30',
  ghost: 'bg-transparent text-slate-300 border-white/10 hover:bg-white/10',
  subtle: 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({
  children,
  className = '',
  variant = 'subtle',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

