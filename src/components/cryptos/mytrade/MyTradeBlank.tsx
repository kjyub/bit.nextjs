interface Props {
  isShow: boolean;
  message: string;
}
export default function MyTradeBlank({ isShow, message }: Props) {
  if (!isShow) {
    return null;
  }

  return (
    <div className="md:sticky md:bottom-[40%] flex flex-col items-center md:pt-32 max-md:pb-8 m-auto gap-2 pointer-events-none">
      <div className="relative flex flex-center size-12 md:size-16 [&>i]:absolute">
        <i className="fa-solid fa-magnifying-glass z-10 text-2xl md:text-3xl text-slate-400 translate-x-3 translate-y-1"></i>
        <i className="fa-solid fa-file-invoice text-4xl md:text-5xl text-slate-500/80"></i>
      </div>
      <span className="max-md:text-sm text-slate-400/70 font-medium">{message}</span>
    </div>
  );
}
