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

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className={cn([
        'flex items-center flex-1 h-10 px-3 space-x-2 rounded-lg bg-surface-sub-background transition-colors',
        'focus-within:bg-surface-sub-background-active',
      ])}
    >
      <input
        className={'w-full bg-transparent text-sm text-surface-main-text placeholder:text-surface-sub-text/50'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(value)}
        placeholder={placeholder}
      />

      <button className={'text-surface-sub-text hover:text-surface-main-text text-sm'} type="button">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
}
