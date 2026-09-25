import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  as?: "div" | "li" | "figure" | "section";
  delay?: number;
  className?: string;
  children: ReactNode;
};

export function Reveal({ as: Tag = "div", delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Position check on scroll instead of IntersectionObserver alone: some embedded
    // browsers throttle observers, which would leave content permanently hidden.
    const show = () => {
      node.dataset.visible = "true";
      cleanup();
    };
    const check = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40 && rect.bottom > 0) show();
    };
    const cleanup = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
    return cleanup;
  }, []);

  return (
    <Tag ref={ref as never} data-reveal className={cn(className)} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
