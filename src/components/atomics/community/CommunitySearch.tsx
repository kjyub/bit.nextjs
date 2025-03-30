'use client'

import { useEffect, useState } from 'react'

interface ICommunitySearch {
  onSearch: (search: string) => void
  defaultValue: string
  width?: string
  placeholder?: string
}
export default function CommunitySearch({
  onSearch,
  defaultValue = '',
  width = '80px',
  placeholder = '',
}: ICommunitySearch) {
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className={`flex items-center h-10 px-3 space-x-2 rounded-lg bg-slate-500/30 backdrop-blur-sm`}>
      <input
        style={{ width: width }} // tailwind 변수 테스트
        className={`bg-transparent text-sm text-slate-300 placeholder:text-slate-500`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch(value)}
        placeholder={placeholder}
      />

      <button className={`text-slate-400 hover:text-slate-200 text-sm`}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  )
}
