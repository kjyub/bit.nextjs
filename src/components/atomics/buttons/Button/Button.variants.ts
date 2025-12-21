import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  ['flex flex-center gap-1 rounded-xl font-medium disabled:cursor-not-allowed', 'transition-all ease-out'],
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-500/70 text-surface-main-text hover:bg-indigo-500/80 active:bg-indigo-500 disabled:bg-slate-700/50 disabled:text-slate-400',
        solid:
          'bg-slate-600/70 text-slate-100 hover:bg-slate-600/80 active:bg-slate-600 disabled:bg-gray-300 disabled:text-gray-500',
        outlined:
          'border border-overlay-border-3 text-gray-800 bg-transparent hover:bg-overlay-bg-1 active:bg-overlay-bg-2 disabled:border-gray-300 disabled:text-gray-500',
        disabled: 'text-slate-400 bg-slate-700/50',
        unstyled: '',
      },
      size: {
        sm: ['h-8', 'px-3', 'text-[0.825rem]'],
        md: ['h-10', 'px-4'],
        lg: ['h-12', 'px-5'],
        xl: ['h-14', 'px-6'],
        unstyled: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
);
