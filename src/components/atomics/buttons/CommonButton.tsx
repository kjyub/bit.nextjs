import tw from 'tailwind-styled-components';

const Button = tw.button`
    h-10 px-3 py-1 
    rounded-xl bg-slate-500/50 hover:bg-slate-500/70
    text-sm text-slate-200 
    transition-colors
`;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}
export default function CommonButton({ children, ...props }: Props) {
  return (
    <Button {...props}>
      {children}
    </Button>
  );
}
