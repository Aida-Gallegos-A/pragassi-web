import { Compass, Gem, Target } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS } from "@/data/content";

const PRINCIPLES = [
  {
    icon: Target,
    title: "Misión",
    body: "Reducir el riesgo de contratación mediante estudios sistemáticos y capacitación en cumplimiento normativo, sin atajos.",
  },
  {
    icon: Compass,
    title: "Visión",
    body: "Ser la consultora de referencia en verificación de personal para el sector seguridad en México, con cobertura nacional y cero concesiones en rigor.",
  },
  {
    icon: Gem,
    title: "Valores",
    body: "Confidencialidad en cada expediente. Exactitud en cada informe. Velocidad sin omisiones. Siempre respetando los valores y la ética de nuestros clientes.",
  },
];

export function About() {
  return (
    <section id="nosotros" className="relative px-5 py-28 sm:px-[6.5%] md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Quiénes somos"
          title={
            <>
              Detrás de cada buena contratación, hay un <em className="font-serif font-normal text-gold">estudio Pragassi.</em>
            </>
          }
          intro="Pragassi nació para cerrar la brecha entre una contratación apresurada y el cumplimiento normativo real. Operamos en todo México con el mismo estándar en cada estudio que entregamos."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 100} className="rounded-[28px] border border-line bg-white p-8 md:p-10">
              <Icon className="size-6 text-gold" strokeWidth={1.4} />
              <h3 className="mt-8 font-serif text-[30px] text-ink">{title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="relative mt-5 overflow-hidden rounded-[32px] bg-navy px-8 py-14 text-white grain md:px-14 md:py-20">
          <div className="pointer-events-none absolute -right-20 top-1/2 size-[420px] -translate-y-1/2 rounded-full border border-gold-soft/20" />
          <div className="pointer-events-none absolute -right-4 top-1/2 size-[260px] -translate-y-1/2 rounded-full border border-gold-soft/15" />
          <div className="relative grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
            <div className="font-serif text-[120px] leading-none text-gold-soft md:text-[160px]">
              15<span className="align-top text-[0.3em] text-white/60"> años</span>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold-soft">Historial</p>
              <h3 className="mt-3 text-[clamp(26px,2.8vw,40px)] font-medium leading-tight tracking-[-0.035em]">Construido en el sector más exigente de México.</h3>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/65">
                Desde el primer estudio hasta el expediente mil, operamos bajo las mismas condiciones: datos sensibles, plazos reales y clientes que no pueden permitirse un error de contratación. Empresas como Grupo GSI, Cometra, Seguritec, Tecnoval y otras más en el ramo nos han confiado sus procesos de selección.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-24 grid gap-5 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="figure" key={t.author} delay={i * 120} className="relative rounded-[28px] border border-line bg-gradient-to-br from-white to-mist/60 p-8 md:p-12">
              <div className="flex gap-1 text-gold" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} viewBox="0 0 20 20" className="size-4 fill-current" aria-hidden="true">
                    <path d="m10 1.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.8l-5.3 2.8 1-5.8L1.5 7.7l5.9-.9Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-6 font-serif text-[clamp(22px,2.1vw,30px)] leading-snug text-ink">“{t.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="grid size-11 place-items-center rounded-full bg-navy text-[15px] font-medium text-gold-soft">{t.author.charAt(0)}</span>
                <span>
                  <span className="block text-[15px] font-medium text-ink">{t.author}</span>
                  <span className="block text-[13px] text-muted">{t.role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
