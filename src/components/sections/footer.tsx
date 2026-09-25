import { CONTACT, whatsappLink } from "@/data/content";

const PAGES = [
  ["Inicio", "#inicio"],
  ["Precios", "#precios"],
  ["Verifica · Test de confianza", "#verifica"],
  ["Servicios", "#servicios"],
  ["¿Por qué nosotros?", "#por-que"],
  ["Proceso", "#proceso"],
  ["Nosotros", "#nosotros"],
  ["Contacto", "#contacto"],
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep px-5 pb-10 pt-24 text-white grain sm:px-[6.5%]">
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[500px] rounded-full bg-royal/25 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src="/logo-pragassi-white.png" alt="Pragassi Consultoría RH" width="1200" height="518" className="h-16 w-auto opacity-95" />
            <p className="mt-6 max-w-sm font-serif text-[24px] leading-snug text-white/85">
              Estudios rigurosos. Decisiones de contratación <em className="text-gold-soft">sin fisuras.</em>
            </p>
            <div className="mt-8 flex gap-3">
              <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid size-11 place-items-center rounded-full border border-white/15 text-white/75 transition hover:border-gold-soft hover:text-gold-soft">
                <FacebookIcon />
              </a>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-11 place-items-center rounded-full border border-white/15 text-white/75 transition hover:border-gold-soft hover:text-gold-soft">
                <InstagramIcon />
              </a>
            </div>
          </div>

          <nav aria-label="Páginas">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold-soft">Páginas</p>
            <ul className="mt-6 space-y-3">
              {PAGES.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-[15px] text-white/70 transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={CONTACT.privacy} target="_blank" rel="noopener noreferrer" className="text-[15px] text-white/70 transition hover:text-white">
                  Política de privacidad
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold-soft">Contáctanos</p>
            <ul className="mt-6 space-y-3 text-[15px] text-white/70">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="break-all transition hover:text-white">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="transition hover:text-white">
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={whatsappLink("Hola Pragassi, requiero información.")} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  WhatsApp disponible
                </a>
              </li>
              <li>Cobertura nacional · México</li>
            </ul>
          </div>
        </div>

        <div aria-hidden="true" className="mt-20 select-none bg-gradient-to-b from-white/15 to-white/0 bg-clip-text text-center text-[clamp(72px,19vw,300px)] font-semibold leading-[0.8] tracking-[-0.07em] text-transparent">
          pragassi
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-8 text-[11px] uppercase tracking-[0.2em] text-white/45 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Pragassi · 15 años cerrando brechas en la contratación del sector seguridad.</p>
          <p>Sin atajos en la verificación</p>
        </div>
      </div>
    </footer>
  );
}
