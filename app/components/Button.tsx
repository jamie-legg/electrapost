
export const Button = ({ children, onClick, variant = 'default', isActive = false }: { children: React.ReactNode, onClick: () => void, variant?: 'default' | 'outline' | 'active', isActive?: boolean }) => {
  const baseClasses = "flex transition-all items-center justify-center text-sm font-bold rounded-md px-2 my-1 font-mono w-max";
  const variantClasses = 
    variant === 'outline'
      ? "bg-transparent hover:bg-stone-700 text-stone-300 border-2 border-stone-300 hover:border-stone-400"
    : variant === 'active' || isActive
      ? "bg-stone-700 text-white border-2 border-stone-400"
    : "bg-stone-600 hover:bg-stone-700 border-2 border-black border-opacity-10";

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}