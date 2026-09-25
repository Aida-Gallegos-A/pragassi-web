import { whatsappLink } from "@/data/content";

export function WhatsappFab() {
  return (
    <a
      href={whatsappLink("Hola Pragassi, me interesa cotizar un estudio.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-navy py-3 pl-3 pr-3 text-white shadow-[0_20px_50px_-15px_rgb(15_42_74/0.7)] ring-1 ring-white/10 transition-all duration-300 hover:bg-royal md:bottom-8 md:right-8 md:pr-5"
    >
      <span className="grid size-10 place-items-center rounded-full bg-[#25d366]">
        <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
        </svg>
      </span>
      <span className="hidden text-[14px] font-medium md:inline">Cotiza por WhatsApp</span>
    </a>
  );
}
