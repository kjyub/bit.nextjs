import tw from 'tailwind-styled-components';

const Button = tw.button`
    h-10 px-3 py-1 
    rounded-xl bg-surface-sub-background hover:bg-surface-sub-background-active
    text-sm text-surface-main-text 
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
