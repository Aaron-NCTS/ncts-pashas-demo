# PASHA'S — Demo comercial de plataforma de distribución mayorista

Demo comercial desarrollada por **NovaCore Tech Solutions (NCTS)** para **PASHA GROUP S.A.S & C.V.**,
mostrando cómo la marca podría operar su distribución mayorista de herramientas profesionales
para barbería y belleza en México a través de un ecosistema digital completo.

> ⚠️ Esta es una **demo comercial**. Todos los datos (pedidos, clientes, cotizaciones, etc.) son
> ficticios y se generan/persisten en el `localStorage` del navegador. No hay backend, pagos ni
> autenticación reales.

## Cómo instalar

```bash
npm install
```

## Cómo ejecutar en desarrollo

```bash
npm run dev
```

Abre la URL que indique la terminal (por defecto `http://localhost:5173`).

## Cómo compilar para producción

```bash
npm run build
```

Los archivos optimizados se generan en `dist/`. Puedes previsualizarlos con:

```bash
npm run preview
```

## Arquitectura

```
src/
  config/brand.ts     → Configuración central de marca (nombre, colores, contacto, moneda...)
  types/               → Tipos TypeScript de todo el dominio
  data/seed.ts         → Generador determinista de datos demo
  services/
    db.ts              → Capa de persistencia en localStorage ("base de datos" de la demo)
    api.ts             → Lógica de negocio / "mock API" (reemplazable por backend real)
  store/AppContext.tsx → Estado global: sesión, carrito, favoritos, toasts
  components/
    ui/                → Componentes base (Button, Card, Modal, Badge, KpiCard...)
    public/            → Componentes del sitio público (logo, etc.)
    shared/            → Componentes compartidos entre portales (timeline de pedido)
  layouts/             → PublicLayout, ClientLayout, AdminLayout
  pages/
    public/            → Sitio público (home, catálogo, producto, distribuidores, checkout...)
    client/            → Portal de cliente/distribuidor
    admin/             → Panel administrativo (ERP)
  utils/analytics.ts   → Cálculos para dashboard y reportes
```

La app **no tiene lógica de PASHA'S hardcodeada** fuera de `config/brand.ts` — todo el texto de marca,
colores, contacto y prefijos de folio se leen desde ahí, para poder reutilizar esta plantilla con
otro distribuidor/mayorista sin reconstruir la aplicación.

## Usuarios demo

Desde `/login` puedes entrar con tres accesos rápidos (sin contraseña real):

- **Admin** → panel administrativo completo (`/admin`)
- **Cliente** → portal de cliente (`/portal`), simulando a "Barbería Imperial"
- **Distribuidor** → portal con precio mayorista (`/portal`), simulando a "Beauty Supply MX"

## Datos demo

Al abrir la app por primera vez se generan automáticamente:

- ~30 productos en 8 categorías
- 25 clientes (10 de ellos distribuidores activos)
- 50 pedidos con distintos estados y timelines
- 15 cotizaciones mayoristas
- 12 leads en el pipeline CRM
- 9 tickets de soporte
- movimientos de inventario, notificaciones y promociones

Todo se persiste en `localStorage` bajo el prefijo `pasha-demo:v1:`. Puedes restablecerlo desde
**Panel admin → Configuración → Restablecer datos de demostración**.

## Cómo cambiar el branding (reutilizar como plantilla)

1. Edita `src/config/brand.ts` y crea un nuevo objeto `BrandConfig` (o modifica `pashaBrand`).
2. Cambia el `export const brand = pashaBrand` para apuntar al nuevo objeto.
3. Sustituye el emblema en `src/components/public/LionMark.tsx` por el logo real del nuevo cliente
   (o por un `<img>` apuntando a `/public/brand/...`).
4. Ajusta la paleta en `tailwind.config.js` (`colors.ink`, `colors.gold`, etc.) si el nuevo cliente
   usa otra identidad visual.

## Cómo conectar un backend real

Toda mutación de datos pasa por `src/services/api.ts`, que a su vez llama a `src/services/db.ts`
(localStorage). Para pasar a producción:

1. Sustituye las funciones de `db.ts` por llamadas HTTP/fetch a tu API real.
2. Mantén la misma firma de funciones en `api.ts` (nombres y tipos de retorno) para no tener que
   tocar ninguna página.
3. Sustituye `seedIfNeeded()` en `main.tsx` por tu flujo real de autenticación/carga inicial.

## Logos oficiales

Los logos reales de PASHA'S y PASHA GROUP (proporcionados por el cliente) están en
`public/brand/` (`pasha-logo-main.png` y `pasha-logo-badge.png`, con fondo transparente).
El componente `src/components/public/PashaLogo.tsx` los usa directamente; el `LionMark.tsx`
vectorial queda únicamente como *fallback* silencioso si alguna vez el archivo de imagen no
carga — no se usa como diseño.

## Flujo de distribuidor de punta a punta (demostrable)

1. Sitio público → **Ser distribuidor** → formulario → la solicitud aparece en
   **Panel admin → Distribuidores**.
2. El admin la aprueba con **Aprobar**: esto crea/activa automáticamente al cliente como
   distribuidor y lo fija como la empresa que usará el acceso rápido **"Entrar como
   Distribuidor"** del login (se ve reflejado ahí mismo).
3. Cerrando sesión y entrando de nuevo como Distribuidor, el usuario puede **solicitar una
   cotización** desde el portal.
4. El admin la responde desde **Panel admin → Cotizaciones** (precio y nota).
5. De vuelta en el portal, el distribuidor **acepta la cotización y genera el pedido**
   (se agrega al carrito al precio cotizado y pasa a checkout).
6. El pedido aparece en **Panel admin → Pedidos**, descuenta inventario en
   **Inventario**, se puede preparar y despachar en **Logística**, y el cliente le da
   seguimiento en **Portal → Seguimiento**.

## Stack

- React 19 + TypeScript + Vite
- React Router 7
- Tailwind CSS 3
- Recharts (gráficas)
- Lucide React (iconos)
