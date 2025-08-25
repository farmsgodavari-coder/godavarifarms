"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const sizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-3.5 py-2 text-sm",
  lg: "px-4.5 py-2.5 text-base",
};

const variantClasses: Record<Variant, string> = {
  primary: "btn-base btn-primary",
  ghost: "btn-base btn-ghost",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", iconLeft, iconRight, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cls(variantClasses[variant], sizeClasses[size], className)}
      {...rest}
    >
      {iconLeft && <span className="mr-2 inline-flex">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="ml-2 inline-flex">{iconRight}</span>}
    </button>
  );
});

export default Button;
