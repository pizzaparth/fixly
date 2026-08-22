import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function Stars({ rating = 5, size = 16, count = null }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= rounded
                ? 'fill-yellow-400 text-yellow-500'
                : 'text-zinc-300'
            }
          />
        ))}
      </div>
      <span className="text-xs font-bold text-zinc-900 ml-1">
        {Number(rating).toFixed(1)}
      </span>
      {count !== null && (
        <span className="text-xs text-zinc-500 font-medium">
          ({count})
        </span>
      )}
    </div>
  );
}

export function SolidButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  size = 'md',
}) {
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-zinc-800 border border-black',
    blue: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
    purple: 'bg-purple-600 text-white hover:bg-purple-700 border border-purple-600',
    pink: 'bg-pink-600 text-white hover:bg-pink-700 border border-pink-600',
    green: 'bg-green-600 text-white hover:bg-green-700 border border-green-600',
    yellow: 'bg-yellow-400 text-black hover:bg-yellow-500 border border-yellow-500 font-bold',
    outline: 'bg-white text-zinc-900 border-2 border-zinc-900 hover:bg-zinc-100',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 border border-transparent',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`rounded-md font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function SolidBadge({ children, variant = 'neutral', className = '' }) {
  const styles = {
    neutral: 'bg-zinc-100 text-zinc-800 border border-zinc-300',
    blue: 'bg-blue-600 text-white border border-blue-600',
    purple: 'bg-purple-600 text-white border border-purple-600',
    pink: 'bg-pink-600 text-white border border-pink-600',
    green: 'bg-green-600 text-white border border-green-600',
    yellow: 'bg-yellow-400 text-black border border-yellow-500 font-bold',
    pending: 'bg-yellow-400 text-black border border-yellow-500 font-bold',
    ongoing: 'bg-blue-600 text-white border border-blue-600 font-bold',
    completed: 'bg-green-600 text-white border border-green-600 font-bold',
    rejected: 'bg-rose-600 text-white border border-rose-600 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider ${styles[variant] || styles.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

export function SolidCard({ children, className = '', highlight = null }) {
  const highlightStyles = {
    blue: 'border-l-4 border-l-blue-600',
    purple: 'border-l-4 border-l-purple-600',
    pink: 'border-l-4 border-l-pink-600',
    green: 'border-l-4 border-l-green-600',
    yellow: 'border-l-4 border-l-yellow-400',
  };

  return (
    <div
      className={`rounded-md bg-white border border-zinc-200 shadow-sm overflow-hidden ${highlight ? highlightStyles[highlight] : ''} ${className}`}
    >
      {children}
    </div>
  );
}
