# Pragassi · Sitio web

Nuevo sitio de [Pragassi](https://pragassi.com): estudios socioeconómicos, estudios de antecedentes, capacitación empresarial, reclutamiento y **Verifica** (test de confianza).

Hecho con Vite, React, TypeScript, Tailwind CSS y Three.js (@react-three/fiber) para la portada 3D.

## Desarrollo

```bash
npm install
npm run dev
```

## Publicar

```bash
npm run build
```

El sitio estático queda en `dist/`, listo para subirse a cualquier hosting (por ejemplo Hostinger).

## Estructura

- `src/components/ui/orbit-delivery-hero.tsx`: portada 3D interactiva (planeta, verificador, atmósfera y tarjetas flotantes).
- `src/components/sections/`: secciones de la página (precios, Verifica, servicios, proceso, nosotros, contacto…).
- `src/data/content.ts`: textos, precios y datos de contacto en un solo lugar.
- `public/models/`: modelos 3D comprimidos (meshopt) y mapa de relieve del planeta.
