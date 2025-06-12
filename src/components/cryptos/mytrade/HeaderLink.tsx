import { cn } from '@/utils/StyleUtils';
import Link from 'next/link';

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
}
export default function HeaderLink({ href, className, children }: Props) {
  return (
    <Link href={href} className={cn(['hover:[&>i]:text-slate-400', className])}>
      {children}

      <i className="fa-solid fa-chevron-right text-slate-500 text-xs"></i>
    </Link>
  );
}
