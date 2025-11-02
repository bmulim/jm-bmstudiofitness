type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  noPadding?: boolean;
  noMinHeight?: boolean;
};

export function Container({
  children,
  className = "",
  maxWidth = "lg",
  noPadding = false,
  noMinHeight = false,
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`${!noMinHeight ? "min-h-screen" : ""} text-[#C0A231] ${className}`}
    >
      <div
        className={`mx-auto ${maxWidthClasses[maxWidth]} ${!noPadding ? "px-4 sm:px-6 lg:px-8" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
