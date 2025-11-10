import clsx from "clsx";

type ButtonVariants = "default" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariants;
  size?: ButtonSize;
} & React.ComponentProps<"button">;

export function Button({
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const buttonVariants: Record<ButtonVariants, string> = {
    default: clsx("bg-[#C2A537]/20 text-[#C2A537] hover:bg-[#C2A537]/30"),
    ghost: clsx("bg-slate-800/30 text-slate-200 hover:bg-slate-800/50"),
    danger: clsx("bg-red-900/20 text-red-400 hover:bg-red-900/30"),
    outline: clsx(
      "border border-slate-700 bg-slate-800/30 text-slate-200 hover:bg-slate-800/50",
    ),
  };

  const sizeVariants: Record<ButtonSize, string> = {
    sm: clsx(
      "text-xs/tight",
      "py-1",
      "px-2",
      "rounded-sm",
      "[&>svg]:h-3 [&>svg]:w-3",
      "gap-1",
    ),
    md: clsx(
      "text-base/tight",
      "py-2",
      "px-4",
      "rounded-md",
      "[&>svg]:h-4 [&>svg]:w-4",
      "gap-2",
    ),
    lg: clsx(
      "text-lg/tight",
      "py-4",
      "px-6",
      "rounded-lg",
      "[&>svg]:h-5 [&>svg]:w-5",
      "gap-3",
    ),
  };

  const buttonClasses = clsx(
    buttonVariants[variant],
    sizeVariants[size],
    "flex cursor-pointer items-center justify-center",
    "transition",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-none",
    props.className,
  );

  return <button {...props} className={buttonClasses} />;
}
