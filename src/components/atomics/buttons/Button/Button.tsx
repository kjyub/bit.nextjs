import { useClickScaleAnimation } from '@/hooks/useClickScaleAnimation';
import { buttonVariants } from './Button.variants';
import type { ButtonProps } from './Props';
import Spinner from './Spinner';
import { cn } from '@/utils/StyleUtils';
import { useMergeRefs } from '@/hooks/useMergeRefs';

export function Button({ children, variant, size, isLoading, ...props }: ButtonProps) {
  const { ref: clickScaleRef } = useClickScaleAnimation<HTMLButtonElement>();
  const internalRef = useMergeRefs(clickScaleRef, props.ref);

  return (
    <button {...props} ref={internalRef} className={cn([buttonVariants({ variant, size }), props.className])}>
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
