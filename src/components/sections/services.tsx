import { ArrowUpRight, BrainCircuit, Briefcase, CalendarCheck, CreditCard, FileSearch, GraduationCap, House, MapPinned, Phone, Plus, School, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES, STUDY_TYPES } from "@/data/content";
import { cn } from "@/lib/utils";

const ICONS = { antecedentes: FileSearch, capacitacion: GraduationCap, reclutamiento: UserCheck };
const STUDY_ICONS = [Briefcase, CreditCard, School, Phone, House, Plus];
const MAIN_FACTS = [
  { icon: MapPinned, label: "Cobertura nacional" },
  { icon: CalendarCheck, label: "Plazos pactados por contrato" },
  { icon: ShieldCheck, label: "Sin subcontratar etapas críticas" },
];

export function Services() {
  const [main, ...rest] = SERVICES;
  const MainIcon = ICONS[main.id as keyof typeof ICONS];

  return (
    <section id="servicios" className="relative px-5 pb-28 sm:px-[6.5%] md:pb-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Nuestros servicios"
          title={
            <>
              Sin fisuras en <em className="font-serif font-normal text-gold">ninguna</em> etapa del proceso.
            </>
          }
          intro="Identifica lo que necesitas ahora. Cada servicio opera con plazos definidos, cobertura nacional y filtros de cumplimiento desde el primer paso."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-5">
          <Reveal className="group relative overflow-hidden rounded-[32px] bg-navy p-8 text-white grain md:p-12 lg:col-span-3 lg:row-span-2">
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-royal/40 blur-3xl transition-transform duration-700 group-hover:scale-125" />
            <div className="pointer-events-none absolute -bottom-32 left-10 size-72 rounded-full bg-gold/25 blur-3xl" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                  <MainIcon className="size-6 text-gold-soft" strokeWidth={1.5} />
                </span>
                <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">01</span>
              </div>
              <p className="mt-12 text-[12px] font-medium uppercase tracking-[0.28em] text-gold-soft">{main.subtitle}</p>
              <h3 className="mt-4 text-[clamp(32px,3.6vw,52px)] font-medium leading-[1.05] tracking-[-0.04em]">{main.title}</h3>
              <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/70">{main.body}</p>
              <div className="mt-10 grid flex-1 gap-3 sm:auto-rows-fr sm:grid-cols-3">
                {STUDY_TYPES.map((type, i) => {
                  const TypeIcon = STUDY_ICONS[i] ?? Plus;
                  return (
                    <div
                      key={type}
                      className="group/tile relative flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] px-4 py-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold-soft/40 hover:from-white/[0.12] sm:min-h-[128px] sm:flex-col sm:items-start sm:justify-between sm:gap-4 sm:p-5"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-soft/10 ring-1 ring-gold-soft/25">
                        <TypeIcon className="size-[18px] text-gold-soft" strokeWidth={1.6} />
                      </span>
                      <span className="text-[15px] font-medium text-white/90">{type === "y más" ? "Y más" : type}</span>
                      <span className="absolute right-4 top-4 hidden font-serif text-[13px] text-white/30 sm:block">0{i + 1}</span>
                    </div>
                  );
                })}
              </div>
              <ul className="mt-8 grid gap-4 border-t border-white/10 pt-8 text-[13.5px] text-white/70 sm:grid-cols-3">
                {MAIN_FACTS.map(({ icon: FactIcon, label }) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <FactIcon className="size-4 shrink-0 text-gold-soft" strokeWidth={1.6} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {rest.map((service, i) => {
            const Icon = ICONS[service.id as keyof typeof ICONS];
            return (
              <Reveal
                key={service.id}
                delay={120 + i * 100}
                className={cn(
                  "group relative overflow-hidden rounded-[32px] border border-line bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgb(15_42_74/0.45)] md:p-10 lg:col-span-2",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-mist ring-1 ring-line">
                    <Icon className="size-5 text-navy" strokeWidth={1.5} />
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-muted">0{i + 2}</span>
                </div>
                <p className="mt-10 text-[12px] font-medium uppercase tracking-[0.26em] text-gold">{service.subtitle}</p>
                <h3 className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.035em] text-ink">{service.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{service.body}</p>
                {"newCourse" in service && service.newCourse && (
                  <a
                    href="#contacto"
                    className="mt-6 block rounded-2xl border border-[#16b1e6]/30 bg-gradient-to-br from-[#16b1e6]/[0.08] to-[#1b8fd0]/[0.05] p-5 transition hover:border-[#16b1e6]/60"
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#16b1e6] to-[#1b8fd0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                      <Sparkles className="size-3" />
                      Nuevo curso
                    </span>
                    <span className="mt-3 flex items-start gap-3">
                      <BrainCircuit className="mt-0.5 size-5 shrink-0 text-[#1b8fd0]" strokeWidth={1.6} />
                      <span>
                        <span className="block text-[16px] font-medium leading-snug text-ink">{service.newCourse.title}</span>
                        <span className="mt-1 block text-[13.5px] leading-relaxed text-muted">{service.newCourse.body}</span>
                      </span>
                    </span>
                  </a>
                )}
                <a href="#contacto" className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-navy">
                  Solicitar información
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Reveal>
            );
          })}

          <Reveal
            delay={200}
            className="group relative overflow-hidden rounded-[32px] border border-white bg-gradient-to-br from-white via-[#f2f5f9] to-[#e4eaf2] p-8 shadow-[0_30px_80px_-45px_rgb(15_42_74/0.45)] md:p-10 lg:col-span-5"
          >
            {/* brushed-metal sheen + cyan arc echoing the Verifica logo */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.7)_48%,transparent_60%)] opacity-60 transition-transform duration-[1.4s] group-hover:translate-x-24" />
            <div className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full border-[14px] border-[#16b1e6]/15" />
            <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-[#16b1e6]/20 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10">
              <img
                src="/logo-verifica.webp"
                alt="Verifica"
                width="900"
                height="900"
                loading="lazy"
                className="size-28 rounded-[26px] shadow-[0_18px_40px_-18px_rgb(15_42_74/0.5)] ring-4 ring-white md:size-32"
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#16b1e6] to-[#1b8fd0] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_6px_16px_-6px_#16b1e6]">
                    <Sparkles className="size-3" />
                    Nuevo servicio
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-muted">04 · Evaluación de confiabilidad laboral</span>
                </div>
                <h3 className="mt-4 text-[clamp(26px,2.8vw,38px)] font-medium leading-tight tracking-[-0.035em] text-ink">
                  Verifica <span className="font-serif font-normal italic text-[#1b8fd0]">· test de confianza</span>
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                  35 situaciones laborales reales que tu candidato responde en 10 minutos desde un enlace. Recibes un índice de 1 a 10, seis áreas de análisis y señales concretas para profundizar en la entrevista.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-baseline gap-1.5 rounded-full border border-[#16b1e6]/30 bg-white/80 px-4 py-2 text-[13px] text-muted">
                    Test desde <strong className="text-[17px] font-semibold text-ink">$400</strong>
                  </span>
                  <span className="inline-flex items-baseline gap-1.5 rounded-full border border-[#16b1e6]/30 bg-white/80 px-4 py-2 text-[13px] text-muted">
                    Paquetes mensuales desde <strong className="text-[17px] font-semibold text-ink">$750</strong> MXN
                  </span>
                </div>
              </div>
              <a
                href="#verifica"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-4 text-[15px] font-medium text-white shadow-[0_18px_40px_-18px_rgb(15_42_74/0.8)] transition hover:bg-[#1b8fd0]"
              >
                Conocer Verifica
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}