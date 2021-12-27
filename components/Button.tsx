type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  ...extraProps
}) => {
  return (
    <button
      type={type}
      sx={{
        backgroundColor: 'accent',
        color: '#fff',
        borderRadius: '8px',
        border: 'none',
        padding: '0.25rem 0.5rem',
        cursor: 'pointer',
        '&:not([aria-disg abled]):hover': {
          transform: 'scale(1.05)',
        },
      }}
      onClick={onClick}
      {...extraProps}
    >
      {children}
    </button>
  );
};
