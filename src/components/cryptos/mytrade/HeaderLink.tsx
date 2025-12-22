import { cn } from '@/utils/StyleUtils';
import Link from 'next/link';

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
}
export default function HeaderLink({ href, className, children }: Props) {
  return (
    <Link href={href} className={cn(['hover:[&>i]:text-surface-main-text', className])}>
      {children}

      <i className="fa-solid fa-chevron-right text-surface-sub-text text-xs"></i>
    </Link>
  );
}
