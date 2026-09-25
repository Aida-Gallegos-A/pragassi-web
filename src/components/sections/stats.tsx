import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CLIENTS, STATS } from "@/data/content";

function CountUp({ to, prefix, suffix }: { to: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    let frame = 0;
    const check = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top > window.innerHeight - 40 || rect.bottom < 0) return;
      window.removeEventListener("scroll", check);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1600);
        setValue(Math.round(to * (1 - Math.pow(1 - t, 4))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", check);
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      <span className="text-[0.5em] tracking-[-0.02em] text-muted">{suffix}</span>
    </span>
  );
}

export function Stats() {
  return (
    <section id="resultados" className="relative px-5 py-28 sm:px-[6.5%] md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SectionHeading
            eyebrow="Resultados comprobados"
            title={
              <>
                Los números detrás de cada <em className="font-serif font-normal text-gold">decisión</em> de contratación.
              </>
            }
          />
          <Reveal delay={120}>
            <p className="max-w-md text-[17px] leading-relaxed text-muted lg:ml-auto">
              Estudios de antecedentes a escala nacional combinados con capacitación en normatividad. La única consultora de RR. HH. que hace ambas cosas para el sector seguridad.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90} className="group relative bg-paper p-8 transition-colors duration-500 hover:bg-white md:p-10">
              <div className="text-[clamp(44px,4.4vw,64px)] font-medium leading-none tracking-[-0.05em] text-ink">
                {stat.value === null ? stat.text : <CountUp to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />}
              </div>
              <div className="mt-6 h-px w-10 bg-gold transition-all duration-500 group-hover:w-20" />
              <p className="mt-6 text-[15px] leading-relaxed text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl">
        <Reveal>
          <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.34em] text-muted">Empresas que confían en nuestros procesos</p>
        </Reveal>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-16 pr-16">
            {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((name, i) => (
              <span key={i} className="flex items-center gap-16 whitespace-nowrap font-serif text-[28px] text-ink/45 md:text-[34px]" aria-hidden={i >= CLIENTS.length}>
                {name}
                <span className="size-1.5 rounded-full bg-gold/60" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
