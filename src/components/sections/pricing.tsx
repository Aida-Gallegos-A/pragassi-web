import { ArrowRight, BadgeCheck, Check, ShieldCheck, Sparkles, Timer, UserRoundCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { GUARANTEES, PLANS, whatsappLink } from "@/data/content";
import { cn } from "@/lib/utils";

const GUARANTEE_ICONS = [ShieldCheck, Timer, UserRoundCheck, BadgeCheck];

export function Pricing() {
  return (
    <section id="precios" className="relative overflow-hidden bg-navy-deep px-5 py-28 text-white grain sm:px-[6.5%] md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-royal/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[520px] rounded-full bg-gold/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          dark
          align="center"
          eyebrow="Estudios socioeconómicos"
          title={
            <>
              A la medida de <em className="font-serif font-normal text-gold-soft">tus necesidades.</em>
            </>
          }
          intro="Brindamos información confiable y objetiva para que tomes decisiones seguras. Contamos con diferentes tipos de estudios adaptados a cada requerimiento."
        />

        <div className="mt-20 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan, i) => (
            <Reveal
              key={plan.name}
              delay={i * 110}
              className={cn(
                "hairline relative flex flex-col rounded-[32px] p-8 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1.5 md:p-10",
                plan.featured ? "bg-gradient-to-b from-white/[0.14] to-white/[0.04] lg:-my-4 lg:py-14" : "bg-white/[0.05]",
              )}
            >
              {plan.tag && (
                <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-deep">
                  <Sparkles className="size-3.5" />
                  {plan.tag}
                </span>
              )}
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/45">{plan.kicker}</p>
              <h3 className="mt-3 text-[30px] font-medium tracking-[-0.035em]">{plan.name}</h3>
              <p className="mt-3 min-h-[3.2em] text-[15px] leading-relaxed text-white/60">{plan.description}</p>

              <div className="mt-8 border-t border-white/10 pt-8">
                {plan.price ? (
                  <>
                    <p className="text-[12px] uppercase tracking-[0.24em] text-white/45">Desde</p>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span className="text-[64px] font-medium leading-none tracking-[-0.05em]">{plan.price}</span>
                      <span className="text-[14px] text-white/55">MXN</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[12px] uppercase tracking-[0.24em] text-white/45">Precio</p>
                    <p className="mt-2 font-serif text-[52px] italic leading-none tracking-[-0.02em] text-gold-soft">A cotizar</p>
                  </>
                )}
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[15px] text-white/80">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-soft/15 ring-1 ring-gold-soft/40">
                      <Check className="size-3 text-gold-soft" strokeWidth={2.5} />
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
                  "group mt-10 inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-[15px] font-medium transition-all duration-300 lg:mt-auto lg:translate-y-0",
                  plan.featured
                    ? "bg-gold-soft text-navy-deep hover:bg-white"
                    : "border border-white/20 text-white hover:border-gold-soft hover:bg-white/5",
                )}
              >
                {plan.cta}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-20 grid gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((item, i) => {
            const Icon = GUARANTEE_ICONS[i];
            return (
              <div key={item} className="flex items-center gap-4 bg-navy-deep/90 px-6 py-6">
                <Icon className="size-5 shrink-0 text-gold-soft" strokeWidth={1.5} />
                <span className="text-[14px] text-white/80">{item}</span>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
