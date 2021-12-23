type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      sx={{
        backgroundColor: 'accent',
        color: '#fff',
        borderRadius: '32px',
        border: 'none',
        padding: '0.25rem 0.5rem',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
