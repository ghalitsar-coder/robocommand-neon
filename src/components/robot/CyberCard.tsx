import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CyberCardProps {
  title?: string;
  accent?: "cyan" | "green" | "magenta" | "amber";
  children: ReactNode;
  className?: string;
  status?: ReactNode;
}

const accentMap = {
  cyan: "text-neon-cyan border-neon-cyan/40",
  green: "text-neon-green border-neon-green/40",
  magenta: "text-neon-magenta border-neon-magenta/40",
  amber: "text-neon-amber border-neon-amber/40",
};

export function CyberCard({ title, accent = "cyan", children, className, status }: CyberCardProps) {
  return (
    <div
      className={cn(
        "relative bg-card/70 backdrop-blur-sm border rounded-xl shadow-card-cyber overflow-hidden clip-corner",
        accentMap[accent],
        className,
      )}
    >
      {/* corner accents */}
      <span className={cn("absolute top-0 left-0 h-px w-12 bg-current opacity-80")} />
      <span className={cn("absolute top-0 left-0 w-px h-12 bg-current opacity-80")} />
      <span className={cn("absolute bottom-0 right-0 h-px w-12 bg-current opacity-80")} />
      <span className={cn("absolute bottom-0 right-0 w-px h-12 bg-current opacity-80")} />

      {title && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/40">
          <h3 className={cn("font-display text-xs uppercase tracking-[0.25em]", accentMap[accent].split(" ")[0])}>
            {title}
          </h3>
          {status}
        </div>
      )}
      <div className="p-4 relative z-10">{children}</div>
    </div>
  );
}
