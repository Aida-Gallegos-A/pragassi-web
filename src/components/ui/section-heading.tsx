import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, dark, align = "left", className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.34em]",
          dark ? "text-gold-soft" : "text-gold",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-px w-7 bg-current" />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "text-[clamp(34px,4.6vw,64px)] font-medium leading-[1.04] tracking-[-0.045em] text-balance",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-6 max-w-2xl text-[17px] leading-relaxed text-pretty", dark ? "text-white/65" : "text-muted", align === "center" && "mx-auto")}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
