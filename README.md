# Carrito de Compras - Frontend

Frontend Angular 20 con Angular Material para la API REST de Carrito de Compras.

## Requisitos
- Node.js v20.19+ o v22.12+
- npm (viene con Node.js)

> No es necesario instalar Angular CLI globalmente. El proyecto usa `npx` que ejecuta el CLI local incluido en las dependencias.

### Instalación de requisitos

**macOS (Homebrew):**
```bash
brew install node
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

**Windows:**
1. Descargar e instalar [Node.js LTS](https://nodejs.org/) (incluye npm)

**Verificar instalación:**
```bash
node -v    # debe ser v20.19+ o v22.12+
npm -v     # debe ser 10+
```

## Cómo levantar

```bash
cd carrito-frontend
npm install
npx ng serve
```

La app arranca en `http://localhost:4200`

> El backend debe estar corriendo en `http://localhost:8080` (configurable en `src/environments/environment.ts`).

---

## Funcionalidades

### Autenticación
- Login con DNI y contraseña (Material form fields)
- Toggle de "Fecha Especial" en el login para simular fecha promocional
- JWT almacenado en localStorage, enviado automáticamente via interceptor
- Detección automática de token expirado (decodifica `exp` del JWT)
- Interceptor captura respuestas 401/403 y redirige al login
- Al hacer login se recupera el carrito activo del usuario (si existe)
- Popover de usuario (hover) con info (nombre, DNI, si es VIP) y logout

### Tienda (Store)
- Lista de productos en Material Cards con precio y stock
- Paginado con Material Paginator (default 10 productos, opciones 5/10/25)
- Agregar productos al carrito (crea el carrito automáticamente si no existe)
- Controles +/- (Material mini-fab buttons) para ajustar la cantidad
- Botón deshabilitado cuando el producto no tiene stock disponible
- Indicador visual de "Sin stock" / "Agotado"
- Spinner de carga al iniciar

### Carrito
- Vista del carrito con items, precio unitario, cantidad, subtotal por item
- Controles +/- (Material icon buttons) para ajustar cantidad
- Eliminar items individuales o el carrito completo
- Resumen con subtotal, descuento aplicado (con descripción) y total a pagar
- Badge con tipo de carrito (Común, Fecha Especial, VIP)
- Botón "Confirmar Compra" con spinner de procesamiento
- Pantalla de compra exitosa con ícono y redirección a la tienda

### Reporte
- Top 4 productos más caros del historial de compras del usuario logueado
- Spinner de carga

### Control de stock
- El stock se actualiza en tiempo real al agregar, quitar o modificar cantidades
- Los botones de agregar se deshabilitan cuando no hay stock disponible
- Al eliminar productos o el carrito, el stock se devuelve automáticamente

### Navbar
- Badge en el ícono de carrito con la cantidad total de productos
- El ícono de carrito solo aparece si hay items
- Indicador "Fecha Especial" cuando está activa la promoción
- Menú hamburguesa con Sidenav en mobile/tablet (≤768px)
- Vista responsive: desktop muestra nav-links + popover, mobile muestra sidenav

---

## Estructura del proyecto

```
src/app/
├── core/
│   ├── guards/          → authGuard, carritoGuard
│   ├── interceptors/    → JWT auth interceptor (401/403 handling)
│   ├── models/          → Interfaces TypeScript (CarritoResponse, ProductoResponse, etc.)
│   └── services/        → CarritoService, CarritoStateService (signals), AuthService
├── features/
│   ├── carrito/         → Vista, gestión del carrito y confirmación de compra
│   ├── login/           → Pantalla de login con Material form fields
│   ├── reporte/         → Top 4 productos más caros
│   └── store/           → Catálogo de productos con Material Cards y Paginator
├── app.ts               → Componente raíz con Material Toolbar
├── app.routes.ts        → Rutas con guards
└── app.config.ts        → Providers (HTTP, router, interceptors, animations)
```

## Tecnologías
- Angular 20 (standalone components, signals)
- Angular Material 20 (toolbar, sidenav, cards, buttons, badge, paginator, spinner, form fields, slide-toggle, tooltips)
- RxJS
- SCSS
- TypeScript strict mode
