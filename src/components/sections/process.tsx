import { ClipboardCheck, ScanSearch } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { STEPS } from "@/data/content";

export function Process() {
  return (
    <section id="proceso" className="relative overflow-hidden bg-mist/70 px-5 py-28 sm:px-[6.5%] md:py-36">
      <div className="pointer-events-none absolute -left-40 top-20 size-[480px] rounded-full bg-white blur-[100px]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Método de cuatro fases"
          title={
            <>
              Cuatro etapas. Tiempos definidos. <em className="font-serif font-normal text-gold">Resultados aplicables.</em>
            </>
          }
          intro="Cada encargo sigue el mismo método riguroso: desde el primer contacto hasta la entrega con interpretación lista para decidir. Usted sabe qué ocurre y cuándo."
        />

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-[27px] hidden h-px bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 lg:block" />
          <ol className="grid gap-6 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 120} className="relative">
                <div className="relative z-10 grid size-14 place-items-center rounded-full border border-gold/40 bg-paper font-serif text-[18px] text-gold shadow-[0_0_0_8px_rgb(236_242_251)]">
                  {step.n}
                </div>
                <div className="mt-8 rounded-[28px] border border-white bg-white/70 p-7 backdrop-blur-xl transition-all duration-500 hover:bg-white hover:shadow-[0_30px_70px_-40px_rgb(15_42_74/0.4)]">
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">{step.tag}</p>
                  <h3 className="mt-3 text-[22px] font-medium leading-tight tracking-[-0.03em] text-ink">{step.title}</h3>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <Reveal className="flex gap-6 rounded-[28px] bg-navy p-8 text-white md:p-10">
            <ScanSearch className="size-7 shrink-0 text-gold-soft" strokeWidth={1.4} />
            <div>
              <h3 className="text-[22px] font-medium tracking-[-0.03em]">El diagnóstico previo no es opcional</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">
                La mayoría de las empresas de seguridad llegan con un proceso de contratación que tiene huecos que no conocen. El diagnóstico los expone antes de que un candidato los explote.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="flex gap-6 rounded-[28px] border border-line bg-white p-8 md:p-10">
            <ClipboardCheck className="size-7 shrink-0 text-gold" strokeWidth={1.4} />
            <div>
              <h3 className="text-[22px] font-medium tracking-[-0.03em] text-ink">Resultados listos para decidir</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Cada informe incluye una lectura de riesgo por candidato, no solo un expediente. Tiempos de entrega acordados por contrato: sin sorpresas, sin extensiones no comunicadas.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
