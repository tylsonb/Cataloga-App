# 14 — Criterios de Aceptación

## M-01: Registro con email (US-01)

- [ ] El formulario muestra campos: nombre completo, email, contraseña
- [ ] Validación en tiempo real: email válido, contraseña ≥ 8 caracteres
- [ ] Mensaje de error claro por cada validación fallida
- [ ] Al submitir, se crea cuenta en Supabase Auth
- [ ] Se envía email de confirmación
- [ ] Se crea registro en `profiles` con rol `buyer`
- [ ] Tras confirmar email, usuario puede iniciar sesión
- [ ] Si email ya existe, mostrar mensaje "Email ya registrado"
- [ ] Botón de mostrar/ocultar contraseña
- [ ] Link a "Iniciar sesión" si ya tiene cuenta
- [ ] Responsive en mobile, tablet y desktop

## M-02: Registro con Google (US-02)

- [ ] Botón "Continuar con Google" visible
- [ ] Al clickar, inicia OAuth flow de Google
- [ ] Tras autorizar, se crea cuenta en Supabase Auth
- [ ] Se crea registro en `profiles` con datos de Google (nombre, email, avatar)
- [ ] Se asigna rol `buyer`
- [ ] Usuario queda autenticado y redirigido a home
- [ ] Si email ya existe, vincular cuenta y autenticar
- [ ] Funciona en mobile y desktop

## M-03: Login con email (US-03)

- [ ] Formulario con email y contraseña
- [ ] Validación de campos antes de submit
- [ ] Si credenciales correctas: redirect a home o página anterior
- [ ] Si credenciales incorrectas: mensaje "Credenciales inválidas"
- [ ] Si email no confirmado: mensaje "Confirma tu email"
- [ ] Botón mostrar/ocultar contraseña
- [ ] Link "¿Olvidaste tu contraseña?"
- [ ] Link "¿No tienes cuenta? Regístrate"
- [ ] Responsive

## M-04: Login con Google (US-04)

- [ ] Botón "Continuar con Google" visible
- [ ] OAuth flow funcional
- [ ] Tras autenticar, redirect a home o página anterior
- [ ] Sesión persistente (cookie httpOnly)
- [ ] Funciona en mobile y desktop

## M-05: Recuperar contraseña (US-05)

- [ ] Formulario con solo campo email
- [ ] Al submitir, Supabase envía email con link de reset
- [ ] Link expira en 1 hora
- [ ] Página de reset con campos: nueva contraseña, confirmar
- [ ] Validación: contraseña ≥ 8 caracteres, coinciden
- [ ] Tras reset, usuario puede iniciar sesión
- [ ] Mensaje "Te enviamos un email" tras solicitar reset
- [ ] Si email no existe, no revelar (mostrar mismo mensaje)

## M-06: Cerrar sesión (US-07)

- [ ] Botón "Cerrar sesión" en menú de usuario
- [ ] Al clickar, se cierra sesión en Supabase
- [ ] Cookie eliminada
- [ ] Redirect a home
- [ ] UI actualizada (sin opciones de usuario autenticado)

## M-07: Crear negocio (US-08)

- [ ] Formulario con todos los campos: logo, nombre, descripción, categoría, dirección, ciudad, comuna, WhatsApp, Instagram, Facebook, horario
- [ ] Logo: upload de imagen, preview, compresión client-side
- [ ] Categoría: select desde categorías de la BD
- [ ] WhatsApp: validación de formato (+56912345678)
- [ ] Instagram/Facebook: validación de URL opcional
- [ ] Horario: selector por día con horario open/close
- [ ] Validación Zod en cliente y servidor
- [ ] Tras crear, redirect a dashboard
- [ ] Rol actualizado a `seller`
- [ ] Slug generado automáticamente
- [ ] Logo subido a Storage bucket `business-logos`
- [ ] Responsive

## M-08: Editar negocio (US-09)

- [ ] Formulario precargado con datos actuales
- [ ] Todos los campos editables
- [ ] Cambio de logo: upload nuevo, eliminar anterior de Storage
- [ ] Validación Zod
- [ ] Tras guardar, cambios reflejados inmediatamente (revalidate)
- [ ] Solo el owner puede editar (RLS)

## M-09: Crear producto (US-12)

- [ ] Formulario con: nombre, descripción, precio, moneda, categoría, subcategoría, stock, disponibilidad, destacado, estado, imágenes
- [ ] Imágenes: hasta 5, drag & drop, preview, reordenar, compresión
- [ ] Categoría: select; Subcategoría: select dependiente de categoría
- [ ] Stock: numérico o checkbox "ilimitado"
- [ ] Estado: radio "publicado" o "borrador"
- [ ] Validación Zod en cliente y servidor
- [ ] Imágenes subidas a Storage bucket `product-images`
- [ ] Tras crear, redirect a lista de productos
- [ ] Slug generado automáticamente
- [ ] Solo vendedor con negocio puede crear (RLS)
- [ ] Responsive

## M-10: Editar producto (US-13)

- [ ] Formulario precargado
- [ ] Imágenes existentes mostradas con opción de eliminar/reordenar
- [ ] Nuevas imágenes pueden agregarse (respetando máximo 5)
- [ ] Validación Zod
- [ ] Tras guardar, cambios reflejados (revalidate)
- [ ] Solo el owner del negocio puede editar (RLS)

## M-11: Eliminar producto (US-14)

- [ ] Botón eliminar con confirmación (dialog)
- [ ] Soft delete (set deleted_at)
- [ ] Imágenes eliminadas de Storage
- [ ] Producto no aparece en búsquedas ni catálogo público
- [ ] Solo el owner puede eliminar (RLS)

## M-12: Ver lista de mis productos (US-17)

- [ ] Tabla/grid con: imagen, nombre, precio, estado, acciones
- [ ] Filtros: todos, publicados, borradores, destacados
- [ ] Acciones por producto: editar, eliminar, destacar
- [ ] Paginación si > 20 productos
- [ ] Estado vacío: "No tienes productos. Crea tu primer producto."
- [ ] Solo muestra productos del negocio del usuario autenticado

## M-13: Búsqueda por texto (US-18)

- [ ] Input de búsqueda en header y página de búsqueda
- [ ] Busca en nombre, descripción y nombre de negocio
- [ ] Debounce 300ms
- [ ] Resultados paginados (24 por página)
- [ ] URL actualizada con query param (ej: /buscar?q=zapatos)
- [ ] Estado vacío: "No se encontraron productos"
- [ ] Estado de carga: skeleton loaders
- [ ] Búsqueda registrada en `search_logs`

## M-14: Filtrar por categoría (US-19)

- [ ] Sidebar (desktop) o collapsible (mobile) con categorías
- [ ] Al seleccionar categoría, filtra productos
- [ ] Subcategorías aparecen en cascada
- [ ] URL actualizada con filtros (ej: /buscar?categoria=moda)
- [ ] Contador de resultados por categoría
- [ ] Filtros combinables con búsqueda de texto

## M-15: Ordenar resultados (US-22)

- [ ] Dropdown con opciones: más recientes, más vistos, precio asc, precio desc
- [ ] Cambio de orden no recarga página (client-side o server action)
- [ ] URL actualizada con sort param
- [ ] Opción seleccionada visible

## M-16: Ver galería de imágenes (US-24)

- [ ] Imagen principal grande
- [ ] Thumbnails debajo para múltiples imágenes
- [ ] Click en thumbnail cambia imagen principal
- [ ] Swipe horizontal en mobile para navegar
- [ ] Lazy loading de imágenes
- [ ] Optimización con next/image
- [ ] Placeholder mientras carga

## M-17: Ver información del negocio (US-25)

- [ ] Sección en página de producto con: logo, nombre, categoría, ubicación
- [ ] Link a página pública del negocio
- [ ] Horario de atención si está disponible
- [ ] Redes sociales si están disponibles

## M-18: Contactar por WhatsApp (US-27)

- [ ] Botón "Contactar por WhatsApp" visible y destacado
- [ ] Al clickar: registra evento en `whatsapp_clicks`
- [ ] Redirige a `https://wa.me/{numero}?text={mensaje}`
- [ ] Mensaje pre-escrito incluye nombre del producto
- [ ] Abre en nueva pestaña
- [ ] Funciona en mobile (abre app de WhatsApp) y desktop (abre WhatsApp Web)

## M-19: Agregar a favoritos (US-29)

- [ ] Ícono de corazón en tarjeta de producto y página de detalle
- [ ] Si no autenticado: toast "Inicia sesión para guardar favoritos"
- [ ] Si autenticado: toggle favorito, feedback visual inmediato
- [ ] Persistente en base de datos
- [ ] Optimistic update

## M-20: Eliminar de favoritos (US-30)

- [ ] Click en corazón (estado favorito) lo elimina
- [ ] Feedback visual inmediato
- [ ] Optimistic update
- [ ] Eliminado de la base de datos

## M-21: Ver mis favoritos (US-21)

- [ ] Página `/favoritos` con grid de productos
- [ ] Cada tarjeta muestra: imagen, nombre, precio, negocio
- [ ] Botón eliminar favorito desde la tarjeta
- [ ] Estado vacío: "No tienes favoritos aún"
- [ ] Paginación si > 24 favoritos
- [ ] Solo visible para usuarios autenticados

## M-22: Ver total de visitas (US-32)

- [ ] Tarjeta con número total de visitas a productos del negocio
- [ ] Gráfico de línea con visitas de últimos 30 días
- [ ] Datos cargados desde `product_views`
- [ ] Solo visible para el owner del negocio

## M-23: Ver clicks de WhatsApp (US-34)

- [ ] Tarjeta con número total de clicks
- [ ] Gráfico de línea con clicks de últimos 30 días
- [ ] Datos cargados desde `whatsapp_clicks`

## M-24: Ver cantidad de productos (US-36)

- [ ] Tarjeta con número total de productos
- [ ] Desglose: publicados vs borradores

## M-25: Dashboard admin (US-37)

- [ ] Métricas: total usuarios, negocios, productos, visitas, clicks WhatsApp
- [ ] Solo accesible para rol `admin`
- [ ] Datos en tiempo real (o cache corto)
- [ ] Layout con sidebar de navegación admin

## M-26: Gestionar categorías (US-40)

- [ ] Lista de categorías con nombre, icono, estado
- [ ] Crear categoría: nombre, icono (emoji), orden
- [ ] Editar categoría
- [ ] Eliminar categoría (con confirmación, no permitir si tiene productos)
- [ ] Gestionar subcategorías por categoría
- [ ] Solo admin

## M-27: Instalar como app (US-43)

- [ ] manifest.json válido con iconos 192px y 512px
- [ ] Service Worker registrado
- [ ] Prompt de instalación aparece en Chrome/Edge
- [ ] App instalable en Android (Add to Home Screen)
- [ ] App instalable en iOS (Share → Add to Home Screen)
- [ ] Pantalla splash al abrir

## M-28: Experiencia responsive (US-46)

- [ ] Mobile (< 640px): 1-2 columnas, bottom nav, touch-friendly
- [ ] Tablet (640-1024px): 2-3 columnas, sidebar colapsable
- [ ] Desktop (> 1024px): 4+ columnas, sidebar fijo, hover states
- [ ] No hay scroll horizontal en ningún breakpoint
- [ ] Touch targets ≥ 44px en mobile
- [ ] Imágenes responsivas con next/image

## M-32: SEO (Meta tags, sitemap, robots)

- [ ] Meta tags dinámicos por página (title, description)
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags
- [ ] sitemap.xml generado dinámicamente con productos y negocios
- [ ] robots.txt con reglas apropiadas
- [ ] URLs amigables (/producto/[slug], /negocio/[slug])
- [ ] Canonical URLs
- [ ] noindex en páginas de auth y dashboard

## M-33: Tema claro/oscuro

- [ ] Toggle de tema en header
- [ ] Detección de preferencia del sistema (prefers-color-scheme)
- [ ] Persistencia en localStorage
- [ ] Sin flash de tema incorrecto (script inline en head)
- [ ] Todos los componentes funcionan en ambos temas
- [ ] CSS variables para colores en Tailwind
