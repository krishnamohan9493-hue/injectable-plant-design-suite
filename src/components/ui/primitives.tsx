import * as React from "react";
export function Card({ className = "", children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`} {...p}>{children}</div>;
}
export function CardHeader({ className = "", children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 p-5 pb-3 ${className}`} {...p}>{children}</div>;
}
export function CardTitle({ className = "", children, ...p }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-sm font-semibold tracking-tight ${className}`} {...p}>{children}</h3>;
}
export function CardDesc({ className = "", children, ...p }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xs text-muted-foreground ${className}`} {...p}>{children}</p>;
}
export function CardContent({ className = "", children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 pt-0 ${className}`} {...p}>{children}</div>;
}
export function Badge({ variant = "default", className = "", children, ...p }: { variant?: "default" | "outline" | "success" | "warn" | "destructive"; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  const map: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    outline: "border bg-background",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
    warn: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
    destructive: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[variant]} ${className}`} {...p}>{children}</span>;
}
export function Button({ variant = "default", size = "default", className = "", children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "secondary"; size?: "default" | "sm" | "icon" }) {
  const v: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    outline: "border bg-background hover:bg-accent",
    ghost: "hover:bg-accent",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  const s: Record<string, string> = { default: "h-9 px-4 py-2", sm: "h-8 px-3 text-xs", icon: "h-9 w-9" };
  return <button className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${v[variant]} ${s[size]} ${className}`} {...p}>{children}</button>;
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" {...props} />;
}
export function Label({ className = "", ...p }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`text-xs font-medium leading-none peer-disabled:opacity-70 ${className}`} {...p} />;
}
export function Separator({ className = "" }: { className?: string }) { return <div className={`h-px w-full bg-border ${className}`} />; }
