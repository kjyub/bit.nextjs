import type { VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';
import type { buttonVariants } from './Button.variants';

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends ComponentPropsWithRef<'button'>, ButtonVariants {
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonStyle;
  children: React.ReactNode;
}

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'unstyled'; // base | large | xlarge

export type ButtonStyle = 'primary' | 'solid' | 'outlined' | 'disabled' | 'unstyled';
