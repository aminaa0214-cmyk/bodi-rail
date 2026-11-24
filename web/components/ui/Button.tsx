import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-blue text-white hover:bg-blue-dark hover:text-white",
  dark: "bg-navy text-white hover:text-white hover:opacity-90",
  white: "bg-white text-navy hover:text-navy",
  "outline-light": "border border-white/60 text-white hover:bg-white/8 hover:text-white",
} as const;

const sizes = {
  md: "min-h-12 rounded-[10px] px-6 text-[15px]",
  sm: "min-h-11 rounded-md px-6 text-sm",
} as const;

type ButtonStyleProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Том үсэгтэй, арай том товч */
  caps?: boolean;
  className?: string;
};

export function buttonClass({ variant = "primary", size = "md", caps, className }: ButtonStyleProps = {}) {
  return cn(
    "inline-flex items-center gap-2 font-semibold no-underline disabled:cursor-wait disabled:opacity-70",
    sizes[size],
    variants[variant],
    caps && "min-h-[52px] px-7 text-sm font-bold uppercase tracking-[.06em]",
    className,
  );
}

type LinkButtonProps = ButtonStyleProps & { href: string; children: React.ReactNode };

/** Холбоос хэлбэртэй товч */
export function ButtonLink({ href, children, ...style }: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClass(style)}>
      {children}
    </Link>
  );
}

type NativeButtonProps = ButtonStyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, caps, className, type = "button", ...props }: NativeButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, caps, className })} {...props} />;
}
