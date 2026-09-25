import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTACT, whatsappLink } from "@/data/content";

const SERVICE_OPTIONS = [
  "Estudio socioeconómico básico",
  "Estudio socioeconómico presencial",
  "Estudio especializado",
  "Test de confianza Verifica",
  "Estudios de antecedentes",
  "Capacitación empresarial",
  "Curso: Integración de la IA en el trabajo administrativo",
  "Reclutamiento y selección",
];

const inputClass =
  "w-full rounded-2xl border border-line bg-white/80 px-5 py-4 text-[15px] text-ink outline-none transition placeholder:text-muted/60 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hola Pragassi, solicito una consulta gratuita.",
      `Nombre: ${data.get("name")}`,
      `Correo: ${data.get("email")}`,
      data.get("phone") ? `Teléfono: ${data.get("phone")}` : "",
      `Servicio: ${data.get("service")}`,
      data.get("details") ? `Detalles: ${data.get("details")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const channels = [
    { icon: MessageCircle, label: "WhatsApp", value: "Respuesta el mismo día hábil", href: whatsappLink("Hola Pragassi, requiero información.") },
    { icon: Phone, label: "Teléfono", value: CONTACT.phone, href: CONTACT.phoneHref },
    { icon: Mail, label: "Correo", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: MapPin, label: "Cobertura", value: "Nacional · México" },
  ];

  return (
    <section id="contacto" className="relative overflow-hidden px-5 py-28 sm:px-[6.5%] md:py-36">
      <div className="pointer-events-none absolute right-[-10%] top-10 size-[620px] rounded-full bg-mist blur-[90px]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHeading
            eyebrow="Consulta inicial gratuita"
            title={
              <>
                El primer paso toma <em className="font-serif font-normal text-gold">dos minutos.</em>
              </>
            }
            intro="Respondemos el mismo día hábil. Sin rodeos: nos dices el tipo de estudio o servicio que requieres y nosotros definimos el alcance antes de cualquier cobro."
          />
          <Reveal delay={120} className="mt-12 grid gap-3 sm:grid-cols-2">
            {channels.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <Icon className="size-5 text-gold" strokeWidth={1.5} />
                  <span className="mt-5 block text-[11px] font-medium uppercase tracking-[0.26em] text-muted">{label}</span>
                  <span className="mt-1.5 block break-words text-[15px] font-medium text-ink">{value}</span>
                </>
              );
              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="rounded-3xl border border-line bg-white/70 p-6 backdrop-blur transition hover:border-gold/50 hover:bg-white"
                >
                  {body}
                </a>
              ) : (
                <div key={label} className="rounded-3xl border border-line bg-white/70 p-6 backdrop-blur">
                  {body}
                </div>
              );
            })}
          </Reveal>
        </div>

        <Reveal delay={180} className="rounded-[36px] border border-white bg-white/60 p-6 shadow-[0_40px_120px_-60px_rgb(15_42_74/0.55)] backdrop-blur-2xl md:p-10">
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <h3 className="text-[26px] font-medium tracking-[-0.035em] text-ink">Cuéntanos qué necesitas</h3>
              <p className="mt-2 text-[14px] text-muted">El diagnóstico inicial es gratuito. El alcance y el costo se acuerdan antes de iniciar cualquier estudio.</p>
            </div>
            <label className="mt-4 grid gap-2">
              <span className="text-[13px] font-medium text-ink">Nombre completo*</span>
              <input name="name" required autoComplete="name" className={inputClass} placeholder="Tu nombre" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[13px] font-medium text-ink">Correo electrónico*</span>
                <input name="email" type="email" required autoComplete="email" className={inputClass} placeholder="nombre@empresa.com" />
              </label>
              <label className="grid gap-2">
                <span className="text-[13px] font-medium text-ink">Teléfono o WhatsApp</span>
                <input name="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="55 0000 0000" />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-[13px] font-medium text-ink">¿Qué tipo de estudio o servicio necesitas?*</span>
              <select name="service" required defaultValue="" className={`${inputClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23a8822f%22%20stroke-width=%221.6%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:18px] bg-[right_18px_center] bg-no-repeat pr-12`}>
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-[13px] font-medium text-ink">Detalles (opcional)</span>
              <textarea name="details" rows={3} className={`${inputClass} resize-none`} placeholder="Volumen de candidatos, urgencia, ciudad…" />
            </label>
            <button
              type="submit"
              className="group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-navy px-7 py-4.5 text-[15px] font-medium text-white shadow-[0_18px_40px_-18px_rgb(15_42_74/0.8)] transition hover:bg-royal"
            >
              Enviar solicitud por WhatsApp
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-center text-[12px] text-muted" aria-live="polite">
              {sent ? "¡Listo! Abrimos WhatsApp con tu solicitud. Si no se abrió, escríbenos al " + CONTACT.phone + "." : "Al enviar se abrirá WhatsApp con tu mensaje prellenado."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
