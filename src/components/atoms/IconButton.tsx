
interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * IconButton - 아이콘 기반 버튼
 * Undo, Redo, Hint, Erase 등 다양한 제어 버튼
 */
export function IconButton({
  label,
  onClick,
  disabled = false,
  icon,
  variant = 'primary',
}: IconButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-400 hover:bg-gray-500 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-150 flex items-center gap-2
        ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : variantClasses[variant]}
        active:scale-95
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
