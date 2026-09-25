import { Lock, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { REASONS } from "@/data/content";

export function Why() {
  return (
    <section id="por-que" className="relative px-5 py-28 sm:px-[6.5%] md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.15fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            eyebrow="Por qué Pragassi"
            title={
              <>
                No somos consultores de RR. HH. que <em className="font-serif font-normal text-gold">adaptaron</em> su portafolio.
              </>
            }
            intro="Trabajamos el sector seguridad desde el primer día. Nuestros estudios responden a los requisitos reales de empresas de seguridad privada, no a plantillas genéricas."
          />
          <Reveal delay={150} className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-6">
              <Zap className="size-5 text-gold" strokeWidth={1.5} />
              <h3 className="mt-4 text-[18px] font-medium tracking-[-0.02em]">Resultados ágiles</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">Entregas en tiempos competitivos, sin sacrificar precisión ni calidad. Entendemos la necesidad de responder de manera rápida y eficaz.</p>
            </div>
            <div className="rounded-3xl border border-line bg-white p-6">
              <Lock className="size-5 text-gold" strokeWidth={1.5} />
              <h3 className="mt-4 text-[18px] font-medium tracking-[-0.02em]">Absoluta confidencialidad</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">Toda la información de tus candidatos y empresa se maneja con total discreción y seguridad. Manejamos aviso de privacidad.</p>
            </div>
          </Reveal>
        </div>

        <ol className="relative">
          {REASONS.map((reason, i) => (
            <Reveal as="li" key={reason.title} delay={i * 100} className="group relative border-t border-line py-10 first:border-t-0 first:pt-0 md:py-14">
              <div className="flex gap-6 md:gap-10">
                <span className="font-serif text-[56px] leading-none text-gold/35 transition-colors duration-500 group-hover:text-gold md:text-[80px]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[clamp(24px,2.4vw,34px)] font-medium leading-tight tracking-[-0.035em] text-ink">{reason.title}</h3>
                  <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">{reason.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
