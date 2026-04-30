import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelCardProps {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  status?: ReactNode;
}

/** Minimalist executive card. Kept the filename for compatibility. */
export function CyberCard({ title, eyebrow, children, className, status }: PanelCardProps) {
  return (
    <section
      className={cn(
        "bg-surface border border-border rounded-lg shadow-card overflow-hidden",
        className,
      )}
    >
      {(title || status) && (
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex flex-col">
            {eyebrow && <span className="label-eyebrow">{eyebrow}</span>}
            {title && (
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {title}
              </h3>
            )}
          </div>
          {status}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
