import { useEffect, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, CreditCard, FileText, Loader2, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { CONTACT, ONLINE_STUDIES, payLink, whatsappLink } from "@/data/content";
import { cn } from "@/lib/utils";

type Pago = {
  estado: string;
  estudio: string;
  estudio_clave: string;
  requiere_domicilio: boolean;
  monto: number;
  referencia: string;
  correo_pagador: string;
  datos_enviados: boolean;
};

type Vista =
  | { tipo: "elegir"; aviso?: string }
  | { tipo: "cargando" }
  | { tipo: "formulario"; pago: Pago; pagoId: string }
  | { tipo: "listo"; pago?: Pago }
  | { tipo: "pendiente"; pago: Pago }
  | { tipo: "rechazado"; pago?: Pago }
  | { tipo: "error"; mensaje: string };

const ESTADOS_PENDIENTES = ["pending", "in_process", "authorized", "in_mediation"];

const pesos = (n: number) => `$${n.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;

const inputClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] text-ink outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/15";

export function Solicitud() {
  const [vista, setVista] = useState<Vista>({ tipo: "cargando" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pagoId = params.get("payment_id") || params.get("collection_id");
    const error = params.get("error");

    if (!pagoId || pagoId === "null") {
      const status = params.get("status") || params.get("collection_status");
      setVista({
        tipo: "elegir",
        aviso:
          error === "config" || error === "pago"
            ? "No pudimos abrir el pago en este momento. Intenta de nuevo en unos minutos o escríbenos por WhatsApp."
            : status && status !== "null"
              ? "El pago no se completó. Puedes intentarlo de nuevo."
              : undefined,
      });
      return;
    }

    fetch(`/api/verificar.php?payment_id=${encodeURIComponent(pagoId)}`, { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok || !data?.ok) throw new Error(data?.error || "red");
        return data as Pago;
      })
      .then((pago) => {
        if (pago.datos_enviados) setVista({ tipo: "listo", pago });
        else if (pago.estado === "approved") setVista({ tipo: "formulario", pago, pagoId });
        else if (ESTADOS_PENDIENTES.includes(pago.estado)) setVista({ tipo: "pendiente", pago });
        else setVista({ tipo: "rechazado", pago });
      })
      .catch((e: Error) =>
        setVista({
          tipo: "error",
          mensaje:
            e.message === "no_encontrado"
              ? "No encontramos este pago. Revisa que el enlace esté completo o escríbenos con tu número de operación."
              : "No pudimos confirmar tu pago en este momento. Recarga la página en unos minutos.",
        }),
      );
  }, []);

  useEffect(() => {
    if (vista.tipo !== "elegir") window.scrollTo({ top: 0 });
  }, [vista.tipo]);

  return (
    <div className="min-h-dvh bg-paper">
      <header className="relative overflow-hidden bg-navy-deep px-5 pb-28 pt-6 text-white grain sm:px-[6.5%]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-royal/30 blur-[120px]" />
        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href="/" aria-label="Pragassi · Inicio">
            <img src="/logo-pragassi-white.png" alt="Pragassi Consultoría RH" width="1200" height="518" className="h-11 w-auto" />
          </a>
          <a href="/" className="inline-flex items-center gap-2 text-[13px] text-white/70 transition hover:text-white">
            <ArrowLeft className="size-4" />
            Volver al sitio
          </a>
        </div>
        <div className="relative mx-auto mt-14 max-w-5xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.34em] text-gold-soft">
            <span className="h-px w-7 bg-current" />
            Solicitud en línea
          </p>
          <h1 className="max-w-3xl text-[clamp(32px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-0.045em] text-balance">
            {vista.tipo === "formulario" ? (
              <>
                Pago recibido. <em className="font-serif font-normal text-gold-soft">Ahora, los datos.</em>
              </>
            ) : (
              <>
                Tu estudio, <em className="font-serif font-normal text-gold-soft">sin contrato y en minutos.</em>
              </>
            )}
          </h1>
          <Pasos activo={vista.tipo === "formulario" ? 2 : vista.tipo === "listo" ? 3 : 1} />
        </div>
      </header>

      <main className="relative mx-auto -mt-16 max-w-5xl px-5 pb-24 sm:px-0">
        {vista.tipo === "cargando" && (
          <Tarjeta>
            <div className="flex items-center gap-3 text-muted">
              <Loader2 className="size-5 animate-spin text-gold" />
              Confirmando tu pago con Mercado Pago…
            </div>
          </Tarjeta>
        )}
        {vista.tipo === "elegir" && <Elegir aviso={vista.aviso} />}
        {vista.tipo === "formulario" && <Formulario pago={vista.pago} pagoId={vista.pagoId} onListo={() => setVista({ tipo: "listo", pago: vista.pago })} />}
        {vista.tipo === "listo" && (
          <Mensaje icono={<CheckCircle2 className="size-7 text-emerald-600" />} titulo="¡Listo! Recibimos tu solicitud">
            <p>
              Ya tenemos los datos{vista.pago ? ` para tu ${vista.pago.estudio.toLowerCase()}` : ""}. Te enviamos una confirmación por correo y en breve te contactaremos para
              iniciar el estudio.
            </p>
            <BotonWhatsapp texto="¿Dudas? Escríbenos" mensaje="Hola Pragassi, ya pagué y envié los datos de mi estudio en línea." />
          </Mensaje>
        )}
        {vista.tipo === "pendiente" && (
          <Mensaje icono={<Clock className="size-7 text-gold" />} titulo="Tu pago está en proceso">
            <p>
              Mercado Pago aún no confirma tu pago de {pesos(vista.pago.monto)} ({vista.pago.estudio.toLowerCase()}). Si pagaste en OXXO o por transferencia, puede tardar
              desde unos minutos hasta 2 días hábiles.
            </p>
            <p>
              Cuando se acredite, te enviaremos por correo el enlace para capturar los datos. También puedes <strong>guardar esta página</strong> y volver a abrirla más tarde.
            </p>
            <BotonWhatsapp texto="Avisar por WhatsApp" mensaje={`Hola Pragassi, hice un pago en línea (referencia ${vista.pago.referencia}) y está en proceso.`} />
          </Mensaje>
        )}
        {vista.tipo === "rechazado" && (
          <Mensaje icono={<AlertTriangle className="size-7 text-red-600" />} titulo="El pago no se completó">
            <p>Mercado Pago no aprobó el pago, así que no se hizo ningún cargo. Puedes intentarlo con otra tarjeta o método de pago.</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={vista.pago ? payLink(vista.pago.estudio_clave) : "/solicitud/"}
                className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-[14px] font-medium text-white transition hover:bg-royal"
              >
                Intentar de nuevo
                <ArrowRight className="size-4" />
              </a>
              <BotonWhatsapp texto="Pedir ayuda" mensaje="Hola Pragassi, intenté pagar un estudio en línea y no pasó el pago." />
            </div>
          </Mensaje>
        )}
        {vista.tipo === "error" && (
          <Mensaje icono={<AlertTriangle className="size-7 text-gold" />} titulo="No pudimos confirmar el pago">
            <p>{vista.mensaje}</p>
            <BotonWhatsapp texto="Escríbenos por WhatsApp" mensaje="Hola Pragassi, pagué un estudio en línea pero no pude enviar los datos." />
          </Mensaje>
        )}
      </main>
    </div>
  );
}

function Pasos({ activo }: { activo: number }) {
  const pasos = [
    { n: 1, label: "Elige y paga" },
    { n: 2, label: "Envía los datos" },
    { n: 3, label: "Iniciamos el estudio" },
  ];
  return (
    <ol className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
      {pasos.map((p) => (
        <li key={p.n} className={cn("flex items-center gap-2.5", p.n <= activo ? "text-white" : "text-white/40")}>
          <span
            className={cn(
              "grid size-7 place-items-center rounded-full text-[12px] font-semibold",
              p.n < activo ? "bg-gold-soft text-navy-deep" : p.n === activo ? "bg-white text-navy-deep" : "border border-white/25",
            )}
          >
            {p.n < activo ? "✓" : p.n}
          </span>
          {p.label}
        </li>
      ))}
    </ol>
  );
}

function Tarjeta({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-[28px] border border-white bg-white/90 p-6 shadow-[0_40px_120px_-60px_rgb(15_42_74/0.55)] backdrop-blur md:p-10", className)}>{children}</section>;
}

function Mensaje({ icono, titulo, children }: { icono: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <Tarjeta className="max-w-2xl">
      {icono}
      <h2 className="mt-5 text-[26px] font-medium tracking-[-0.035em] text-ink">{titulo}</h2>
      <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-muted [&_strong]:text-ink">{children}</div>
    </Tarjeta>
  );
}

function BotonWhatsapp({ texto, mensaje }: { texto: string; mensaje: string }) {
  return (
    <a
      href={whatsappLink(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition hover:border-gold"
    >
      <MessageCircle className="size-4 text-[#25d366]" />
      {texto}
    </a>
  );
}

function Elegir({ aviso }: { aviso?: string }) {
  const [elegido] = useState(() => {
    const hash = window.location.hash.slice(1);
    return ONLINE_STUDIES.some((s) => s.id === hash) ? hash : null;
  });

  useEffect(() => {
    if (elegido && window.innerWidth < 768) document.getElementById(elegido)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [elegido]);

  return (
    <>
      {aviso && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-gold/30 bg-[#fff8e8] px-5 py-4 text-[14.5px] text-ink">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" />
          {aviso}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-3">
        {ONLINE_STUDIES.map((s) => (
          <div
            key={s.id}
            id={s.id}
            className={cn(
              "flex flex-col rounded-[28px] border bg-white p-7 shadow-[0_30px_90px_-60px_rgb(15_42_74/0.6)]",
              (elegido ? elegido === s.id : "featured" in s && s.featured) ? "border-gold/60 ring-2 ring-gold/35" : "border-white",
            )}
          >
            <h2 className="text-[21px] font-medium tracking-[-0.03em] text-ink">{s.name}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.description}</p>
            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="text-[44px] font-medium leading-none tracking-[-0.05em] text-ink">${s.price}</span>
              <span className="text-[13px] text-muted">MXN · 1 persona</span>
            </p>
            <p className="mt-4 flex items-start gap-2 text-[13px] text-muted">
              <FileText className="mt-0.5 size-4 shrink-0 text-gold" />
              Después del pago te pediremos: {s.needs.toLowerCase()}
            </p>
            <a
              href={payLink(s.id)}
              className="group mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-navy px-6 py-4 text-[15px] font-medium text-white transition hover:bg-royal md:mt-auto"
            >
              <CreditCard className="size-4" />
              Pagar ${s.price}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 text-[14px] text-muted md:grid-cols-3">
        <p className="flex items-start gap-3">
          <Lock className="mt-0.5 size-5 shrink-0 text-gold" />
          Pago seguro con Mercado Pago: tarjeta de crédito o débito, OXXO, transferencia o saldo Mercado Pago.
        </p>
        <p className="flex items-start gap-3">
          <FileText className="mt-0.5 size-5 shrink-0 text-gold" />
          Al terminar el pago vuelves aquí para capturar los datos de la persona del estudio.
        </p>
        <p className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold" />
          ¿Varios estudios, empresa con volumen o un estudio especializado?{" "}
          <a href={whatsappLink("Hola Pragassi, quiero cotizar varios estudios.")} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline decoration-gold/50 underline-offset-4">
            Cotiza por WhatsApp
          </a>
        </p>
      </div>
    </>
  );
}

function Campo({ label, nombre, requerido, className, ...rest }: { label: string; nombre: string; requerido?: boolean; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-[13px] font-medium text-ink">
        {label}
        {requerido && <span className="text-gold">*</span>}
      </span>
      <input name={nombre} required={requerido} className={inputClass} {...rest} />
    </label>
  );
}

function Grupo({ titulo, nota, children }: { titulo: string; nota?: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 border-t border-line pt-8 first:border-0 first:pt-0">
      <legend className="contents">
        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">{titulo}</span>
      </legend>
      {nota && <p className="-mt-2 text-[13.5px] text-muted">{nota}</p>}
      {children}
    </fieldset>
  );
}

const ERRORES: Record<string, string> = {
  faltan_datos: "Faltan algunos datos obligatorios. Revisa los campos marcados.",
  ya_enviado: "Los datos de este pago ya se habían enviado. Si necesitas corregir algo, escríbenos por WhatsApp.",
  pago_no_aprobado: "El pago todavía no está aprobado. Recarga la página en unos minutos.",
  correo: "No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.",
};

function Formulario({ pago, pagoId, onListo }: { pago: Pago; pagoId: string; onListo: () => void }) {
  const [factura, setFactura] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEnviando(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const datos: Record<string, unknown> = { payment_id: pagoId, factura, acepto: form.get("acepto") === "on" };
    form.forEach((valor, clave) => {
      if (clave !== "acepto") datos[clave] = String(valor);
    });
    try {
      const r = await fetch("/api/enviar.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const res = await r.json().catch(() => null);
      if (r.ok && res?.ok) onListo();
      else setError(ERRORES[res?.error] ?? ERRORES.correo);
    } catch {
      setError(ERRORES.correo);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Tarjeta>
      <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-mist px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2.5 text-[14.5px] text-ink">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <span>
            <strong className="font-semibold">Pago aprobado:</strong> {pago.estudio} · {pesos(pago.monto)}
          </span>
        </p>
        <p className="text-[12.5px] text-muted">Folio {pagoId}</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-8">
        <Grupo titulo="Quién solicita el estudio" nota="Aquí te enviaremos los resultados.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Empresa o negocio" nombre="empresa" requerido placeholder="Nombre de la empresa o negocio" autoComplete="organization" />
            <Campo label="Tu nombre" nombre="contacto" requerido placeholder="Nombre de quien solicita" autoComplete="name" />
            <Campo label="Correo" nombre="correo" type="email" requerido defaultValue={pago.correo_pagador} placeholder="nombre@empresa.com" autoComplete="email" />
            <Campo label="Teléfono o WhatsApp" nombre="telefono" type="tel" requerido placeholder="55 0000 0000" autoComplete="tel" />
          </div>
        </Grupo>

        <Grupo titulo="Persona del estudio">
          <Campo label="Nombre completo" nombre="persona" requerido placeholder="Nombre(s) y apellidos" autoComplete="off" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Teléfono celular" nombre="persona_tel" type="tel" requerido placeholder="55 0000 0000" autoComplete="off" />
            <Campo label="Teléfono alterno o de recados" nombre="persona_tel2" type="tel" placeholder="Opcional" autoComplete="off" />
            <Campo
              label="Correo de la persona"
              nombre="persona_correo"
              type="email"
              requerido={!pago.requiere_domicilio}
              placeholder={pago.requiere_domicilio ? "Opcional" : "Para enviarle el enlace del test"}
              autoComplete="off"
            />
            <Campo label="Puesto al que aplica" nombre="puesto" placeholder="Opcional" autoComplete="off" />
          </div>
        </Grupo>

        {pago.requiere_domicilio && (
          <Grupo titulo="Domicilio de la persona">
            <Campo label="Calle, número exterior e interior" nombre="calle" requerido placeholder="Av. Ejemplo 123, int. 4" autoComplete="off" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Colonia" nombre="colonia" requerido autoComplete="off" />
              <Campo label="Municipio o alcaldía" nombre="municipio" requerido autoComplete="off" />
              <Campo label="Estado" nombre="estado" requerido autoComplete="off" />
              <Campo label="Código postal" nombre="cp" requerido inputMode="numeric" pattern="\d{5}" maxLength={5} title="5 dígitos" autoComplete="off" />
            </div>
            <Campo label="Referencias para llegar" nombre="referencias_domicilio" placeholder="Entre calles, color de fachada… (opcional)" autoComplete="off" />
          </Grupo>
        )}

        <Grupo titulo="Factura">
          <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
            <input type="checkbox" checked={factura} onChange={(e) => setFactura(e.target.checked)} className="size-5 accent-navy" />
            Requiero factura
          </label>
          {factura && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="RFC" nombre="rfc" requerido maxLength={13} className="uppercase" autoComplete="off" />
              <Campo label="Razón social" nombre="razon_social" requerido autoComplete="off" />
              <Campo label="Régimen fiscal" nombre="regimen" requerido placeholder="Ej. 601 General de Ley Personas Morales" autoComplete="off" />
              <Campo label="C.P. fiscal" nombre="cp_fiscal" requerido inputMode="numeric" pattern="\d{5}" maxLength={5} title="5 dígitos" autoComplete="off" />
              <Campo label="Uso de CFDI" nombre="uso_cfdi" placeholder="Ej. G03 Gastos en general" className="sm:col-span-2" autoComplete="off" />
            </div>
          )}
        </Grupo>

        <Grupo titulo="Comentarios">
          <textarea name="comentarios" rows={3} maxLength={1500} className={cn(inputClass, "resize-none")} placeholder="Horario para localizar a la persona, urgencia u otro detalle (opcional)" />
        </Grupo>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-paper px-5 py-4 text-[14px] leading-relaxed text-ink">
          <input type="checkbox" name="acepto" required className="mt-1 size-5 shrink-0 accent-navy" />
          <span>
            Confirmo que la persona del estudio está enterada y autoriza que Pragassi verifique su información, y acepto el{" "}
            <a href={CONTACT.privacy} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-gold/60 underline-offset-4">
              aviso de privacidad
            </a>
            .
          </span>
        </label>

        {error && (
          <p role="alert" className="flex items-start gap-2.5 rounded-2xl bg-red-50 px-5 py-4 text-[14px] text-red-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-navy px-7 py-4.5 text-[15px] font-medium text-white shadow-[0_18px_40px_-18px_rgb(15_42_74/0.8)] transition hover:bg-royal disabled:opacity-60"
        >
          {enviando ? <Loader2 className="size-4 animate-spin" /> : null}
          {enviando ? "Enviando…" : "Enviar datos e iniciar estudio"}
          {!enviando && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
        </button>
      </form>
    </Tarjeta>
  );
}
