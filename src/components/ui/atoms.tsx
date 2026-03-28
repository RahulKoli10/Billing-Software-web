import React from "react";
import { cn } from "@/lib/utils";

export const Badge = ({ children, variant = "neutral", className }: { children: React.ReactNode, variant?: "success" | "warning" | "error" | "neutral" | "primary", className?: string }) => {
  const variants = {
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    neutral: "bg-gray-100 text-gray-600",
    primary: "bg-blue-100 text-blue-700",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant as keyof typeof variants] || variants.neutral, className)}>
      {children}
    </span>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      ghost: "bg-transparent text-gray-500 hover:bg-gray-50",
      outline: "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-bold transition-all disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Card = ({ children, className, title, subtitle, ...props }: React.HTMLAttributes<HTMLDivElement> & { title?: string, subtitle?: string }) => {
  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-sm border border-gray-100", className)} {...props}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 font-body">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
