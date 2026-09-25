import { AlertTriangle, ArrowRight, ArrowUpRight, Check, EyeOff, FileCheck2, Gauge, Handshake, LayoutGrid, Lock, Printer, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { VERIFICA, whatsappLink } from "@/data/content";
import { cn } from "@/lib/utils";

const FEATURE_ICONS = [Gauge, LayoutGrid, AlertTriangle, Printer];
const TRUST_ICONS = [FileCheck2, Lock, Handshake, EyeOff];

function ReportMock() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[48px] bg-gradient-to-br from-[#16b1e6]/25 via-transparent to-[#1b8fd0]/25 blur-2xl" />
      <div className="relative rounded-[32px] border border-white bg-white/85 p-6 shadow-[0_40px_120px_-50px_rgb(20_40_120/0.55)] backdrop-blur-xl md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-verifica-sm.webp" alt="" width="200" height="200" className="size-10 rounded-xl" />
            <div>
              <p className="text-[13px] font-medium text-ink">Reporte de confiabilidad</p>
              <p className="text-[11px] text-muted">Ejemplo de reporte</p>
            </div>
          </div>
          <span className="rounded-full bg-mist px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Datos ilustrativos</span>
        </div>

        <div className="mt-8 flex items-end gap-5">
          <div className="relative grid size-28 shrink-0 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#e7edf6" strokeWidth="8" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="url(#vgrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * (1 - 0.82)} />
              <defs>
                <linearGradient id="vgrad" x1="0" x2="1">
                  <stop stopColor="#16b1e6" />
                  <stop offset="1" stopColor="#0f2a4a" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <span className="block text-[30px] font-semibold leading-none tracking-[-0.04em] text-ink">8.2</span>
              <span className="text-[11px] text-muted">/ 10</span>
            </div>
          </div>
          <div className="pb-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Índice general</p>
            <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[14px] font-medium text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500" />
              Favorable
            </p>
          </div>
        </div>

        <ul className="mt-8 grid gap-3.5 sm:grid-cols-2 sm:gap-x-6">
          {VERIFICA.areas.map((area) => (
            <li key={area.name}>
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="text-ink/80">{area.name}</span>
                <span className="font-semibold tabular-nums text-ink">{area.score}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e7edf6]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#16b1e6] to-[#1b8fd0]" style={{ width: `${area.score * 10}%` }} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-[13px] text-amber-900">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
          <span>Señal a validar: profundizar en “criterio bajo presión” durante la entrevista.</span>
        </div>
      </div>
    </div>
  );
}

export function Verifica() {
  return (
    <section id="verifica" className="relative overflow-hidden bg-gradient-to-b from-white via-[#f1f6fc] to-paper px-5 py-28 sm:px-[6.5%] md:py-36">
      <div className="pointer-events-none absolute -right-40 top-10 size-[560px] rounded-full bg-[#16b1e6]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-40 size-[480px] rounded-full bg-navy/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <Reveal>
            <div className="flex items-center gap-4">
              <img src="/logo-verifica.webp" alt="Verifica" width="900" height="900" className="size-24 rounded-[24px] shadow-[0_20px_50px_-20px_rgb(20_40_120/0.45)] ring-1 ring-white md:size-28" />
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16b1e6]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0c7fae]">
                  <Sparkles className="size-3.5" />
                  Nuevo servicio
                </span>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.3em] text-muted">Evaluación de confiabilidad laboral</p>
              </div>
            </div>
            <h2 className="mt-8 text-[clamp(36px,4.8vw,66px)] font-medium leading-[1.03] tracking-[-0.045em] text-ink text-balance">
              Llega a la entrevista sabiendo <em className="font-serif font-normal text-[#1b8fd0]">qué preguntar.</em>
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
              Verifica es nuestro test de confianza: un cuestionario de situaciones laborales reales que tu candidato responde en 10 minutos desde un enlace. Tú recibes un reporte claro, con señales concretas para profundizar en la entrevista y en las referencias.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {VERIFICA.idealFor.map((item) => (
                <span key={item} className="rounded-full border border-line bg-white/80 px-4 py-2 text-[13px] text-ink/80">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#verifica-precios" className="group inline-flex items-center gap-3 rounded-full bg-navy px-7 py-4 text-[15px] font-medium text-white shadow-[0_18px_40px_-18px_rgb(15_42_74/0.8)] transition hover:bg-[#1b8fd0]">
                Ver precios de Verifica
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href={VERIFICA.appUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-6 py-4 text-[15px] text-ink transition hover:border-[#16b1e6]">
                Acceder a la plataforma
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <ReportMock />
          </Reveal>
        </div>

        {/* How it works */}
        <ol className="mt-28 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VERIFICA.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 100} className="relative rounded-[28px] border border-line bg-white/80 p-7 backdrop-blur">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#16b1e6] to-[#1b8fd0] text-[14px] font-semibold text-white">{i + 1}</span>
              <h3 className="mt-6 text-[20px] font-medium tracking-[-0.03em] text-ink">{step.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          ))}
        </ol>

        {/* What you get + trust */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-[28px] border border-line bg-white p-8 md:p-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#0c7fae]">Qué recibes</p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {VERIFICA.features.map((f, i) => {
                const Icon = FEATURE_ICONS[i];
                return (
                  <li key={f.title}>
                    <Icon className="size-5 text-[#1b8fd0]" strokeWidth={1.6} />
                    <h4 className="mt-3 text-[16px] font-medium text-ink">{f.title}</h4>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{f.body}</p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={120} className="relative overflow-hidden rounded-[28px] bg-navy-deep p-8 text-white grain md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#16b1e6]/30 blur-3xl" />
            <p className="relative flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7fd6f5]">
              <ShieldCheck className="size-4" />
              Uso responsable
            </p>
            <ul className="relative mt-6 grid gap-6 sm:grid-cols-2">
              {VERIFICA.trust.map((t, i) => {
                const Icon = TRUST_ICONS[i];
                return (
                  <li key={t.title}>
                    <Icon className="size-5 text-[#7fd6f5]" strokeWidth={1.6} />
                    <h4 className="mt-3 text-[16px] font-medium">{t.title}</h4>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{t.body}</p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        {/* Pricing */}
        <div id="verifica-precios" className="mt-28 scroll-mt-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.34em] text-[#0c7fae]">
              <span className="h-px w-7 bg-current" />
              Precios Verifica
            </p>
            <h3 className="mt-5 text-[clamp(30px,3.6vw,48px)] font-medium leading-tight tracking-[-0.04em] text-ink">
              Un test o un paquete para <em className="font-serif font-normal text-[#1b8fd0]">cada puesto.</em>
            </h3>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
            {VERIFICA.plans.map((plan, i) => (
              <Reveal
                key={plan.name}
                delay={i * 110}
                className={cn(
                  "relative flex flex-col rounded-[32px] p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-10",
                  plan.featured ? "bg-gradient-to-br from-navy to-navy-deep text-white shadow-[0_40px_100px_-40px_rgb(15_42_74/0.8)] ring-1 ring-[#16b1e6]/30" : "border border-line bg-white",
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-[#16b1e6] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                    Para diferentes puestos
                  </span>
                )}
                <h4 className="text-[26px] font-medium tracking-[-0.035em]">{plan.name}</h4>
                <p className={cn("mt-3 text-[15px] leading-relaxed md:min-h-[4.9em]", plan.featured ? "text-white/70" : "text-muted")}>{plan.description}</p>
                <div className={cn("mt-8 border-t pt-8", plan.featured ? "border-white/15" : "border-line")}>
                  <p className={cn("text-[12px] uppercase tracking-[0.24em]", plan.featured ? "text-white/55" : "text-muted")}>Desde</p>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="text-[60px] font-medium leading-none tracking-[-0.05em]">{plan.price}</span>
                    <span className={cn("text-[14px]", plan.featured ? "text-white/60" : "text-muted")}>MXN {plan.unit}</span>
                  </p>
                </div>
                <ul className="mt-8 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className={cn("flex items-start gap-3 text-[15px]", plan.featured ? "text-white/85" : "text-ink/80")}>
                      <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", plan.featured ? "bg-white/15" : "bg-[#16b1e6]/12")}>
                        <Check className={cn("size-3", plan.featured ? "text-white" : "text-[#0c7fae]")} strokeWidth={2.5} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappLink(plan.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group mt-10 inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-[15px] font-medium transition md:mt-auto",
                    plan.featured ? "bg-white text-navy hover:bg-[#e6f6fd]" : "bg-navy text-white hover:bg-[#1b8fd0]",
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150} className="mx-auto mt-5 flex max-w-5xl flex-col items-start justify-between gap-5 rounded-[28px] border border-[#16b1e6]/30 bg-[#16b1e6]/[0.06] p-7 md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-[18px] font-medium tracking-[-0.02em] text-ink">Pruébalo con tus próximos candidatos</p>
              <p className="mt-1 text-[14.5px] text-muted">Piloto sin costo: evalúa a tus primeros 5 candidatos y decide después.</p>
            </div>
            <a
              href={whatsappLink("Hola Pragassi, quiero el piloto sin costo de Verifica para mis primeros 5 candidatos.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-white transition hover:bg-[#1b8fd0]"
            >
              Solicitar piloto
              <ArrowRight className="size-4" />
            </a>
          </Reveal>

          <p className="mx-auto mt-8 max-w-3xl text-center text-[12px] leading-relaxed text-muted">
            Verifica es una herramienta de apoyo a la decisión. Sus resultados no sustituyen la entrevista, la verificación de referencias ni el criterio de quien contrata, y no deben usarse como único criterio para una decisión laboral.
          </p>
        </div>
      </div>
    </section>
  );
}
