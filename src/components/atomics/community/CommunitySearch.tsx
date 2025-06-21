'use client';

import useFocus from '@/hooks/useFocus';
import { cn } from '@/utils/StyleUtils';
import { useEffect, useState } from 'react';

interface ICommunitySearch {
  onSearch: (search: string) => void;
  defaultValue: string;
  width?: string;
  placeholder?: string;
}
export default function CommunitySearch({ onSearch, defaultValue = '', placeholder = '' }: ICommunitySearch) {
  const [value, setValue] = useState<string>('');
  const { isFocused, ref } = useFocus();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className={cn([
        'flex items-center flex-1 h-10 px-3 space-x-2 rounded-lg bg-slate-500/30 backdrop-blur-sm transition-colors',
        isFocused && 'bg-slate-500/40',
      ])}
    >
      <input
        className={'w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-500'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(value)}
        placeholder={placeholder}
        ref={ref}
      />

      <button className={'text-slate-400 hover:text-slate-200 text-sm'} type="button">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
}
