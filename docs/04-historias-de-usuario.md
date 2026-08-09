# 04 — Historias de Usuario

## Convención

Formato: **Como** [rol] **quiero** [acción] **para** [valor/beneficio]

Prioridad: 🔴 Must | 🟡 Should | 🟢 Could

---

## Epic 1: Autenticación

### US-01: Registro con email
**Como** visitante **quiero** registrarme con mi email y contraseña **para** crear una cuenta en la plataforma.
- Prioridad: 🔴
- Criterios: email válido, contraseña mínima 8 caracteres, confirmación por email

### US-02: Registro con Google
**Como** visitante **quiero** registrarme con mi cuenta de Google **para** no tener que recordar otra contraseña.
- Prioridad: 🔴
- Criterios: OAuth Google, datos básicos importados (nombre, email, avatar)

### US-03: Login con email
**Como** usuario **quiero** iniciar sesión con email y contraseña **para** acceder a mi cuenta.
- Prioridad: 🔴
- Criterios: validación de credenciales, redirect post-login, mensaje de error claro

### US-04: Login con Google
**Como** usuario **quiero** iniciar sesión con Google **para** acceso rápido.
- Prioridad: 🔴
- Criterios: OAuth Google, redirect post-login

### US-05: Recuperar contraseña
**Como** usuario **quiero** recuperar mi contraseña si la olvido **para** poder acceder nuevamente.
- Prioridad: 🔴
- Criterios: email con link de reset, link expira en 1 hora, nueva contraseña válida

### US-06: Ver y editar perfil
**Como** usuario **quiero** ver y editar mi perfil **para** mantener mis datos actualizados.
- Prioridad: 🟡
- Criterios: editar nombre, avatar, teléfono; validación de campos

### US-07: Cerrar sesión
**Como** usuario **quiero** cerrar sesión **para** proteger mi cuenta en dispositivos compartidos.
- Prioridad: 🔴
- Criterios: botón visible, confirmación opcional, redirect a home

---

## Epic 2: Perfil del Negocio

### US-08: Crear negocio
**Como** comprador **quiero** crear mi negocio **para** empezar a vender en la plataforma.
- Prioridad: 🔴
- Criterios: formulario completo (logo, nombre, descripción, categoría, dirección, ciudad, comuna, WhatsApp, redes, horario), validación Zod, estado activo por defecto

### US-09: Editar negocio
**Como** vendedor **quiero** editar los datos de mi negocio **para** mantener información actualizada.
- Prioridad: 🔴
- Criterios: todos los campos editables, validación, cambios reflejados inmediatamente

### US-10: Pausar negocio
**Como** vendedor **quiero** pausar mi negocio **para** que mis productos no aparezcan temporalmente.
- Prioridad: 🟡
- Criterios: toggle activo/inactivo, productos ocultos de búsqueda cuando inactivo

### US-11: Ver página pública del negocio
**Como** visitante **quiero** ver la página de un negocio **para** conocer más sobre el vendedor.
- Prioridad: 🔴
- Criterios: info del negocio, catálogo de productos, botón WhatsApp, visita registrada

---

## Epic 3: Productos

### US-12: Crear producto
**Como** vendedor **quiero** crear un producto **para** mostrarlo en el catálogo.
- Prioridad: 🔴
- Criterios: nombre, descripción, precio, categoría, subcategoría, stock, disponibilidad, hasta 5 fotos, estado publicado/borrador

### US-13: Editar producto
**Como** vendedor **quiero** editar un producto **para** actualizar información o precio.
- Prioridad: 🔴
- Criterios: todos los campos editables, validación, cambios inmediatos

### US-14: Eliminar producto
**Como** vendedor **quiero** eliminar un producto **para** removerlo del catálogo.
- Prioridad: 🔴
- Criterios: confirmación antes de eliminar, soft delete, imágenes removidas de Storage

### US-15: Marcar producto como destacado
**Como** vendedor **quiero** destacar un producto **para** que aparezca primero en mi negocio.
- Prioridad: 🟡
- Criterios: toggle destacado, máximo 5 productos destacados por negocio

### US-16: Gestionar stock y disponibilidad
**Como** vendedor **quiero** actualizar stock y disponibilidad **para** reflejar lo que tengo disponible.
- Prioridad: 🟡
- Criterios: campo numérico o "ilimitado", toggle disponible/agotado

### US-17: Ver lista de mis productos
**Como** vendedor **quiero** ver todos mis productos **para** gestionarlos fácilmente.
- Prioridad: 🔴
- Criterios: lista paginada, filtros por estado, acciones rápidas (editar, eliminar, destacar)

---

## Epic 4: Buscador

### US-18: Búsqueda por texto
**Como** visitante **quiero** buscar productos por texto **para** encontrar lo que necesito rápido.
- Prioridad: 🔴
- Criterios: busca en nombre, descripción y nombre de negocio, resultados relevantes, debounce 300ms

### US-19: Filtrar por categoría
**Como** visitante **quiero** filtrar productos por categoría **para** navegar productos del rubro que me interesa.
- Prioridad: 🔴
- Criterios: dropdown o sidebar con categorías, subcategorías en cascada

### US-20: Filtrar por ubicación
**Como** visitante **quiero** filtrar por ciudad y comuna **para** encontrar vendedores cercanos.
- Prioridad: 🟡
- Criterios: select ciudad → select comuna dependiente

### US-21: Filtrar por precio
**Como** visitante **quiero** filtrar por rango de precio **para** encontrar productos en mi presupuesto.
- Prioridad: 🟡
- Criterios: input min y max, slider opcional

### US-22: Ordenar resultados
**Como** visitante **quiero** ordenar los resultados **para** ver los más relevantes primero.
- Prioridad: 🔴
- Criterios: más recientes, más vistos, precio asc, precio desc

### US-23: Paginación infinita
**Como** visitante **quiero** que los resultados carguen automáticamente **para** no hacer clic en "siguiente página".
- Prioridad: 🟡
- Criterios: lazy loading con Intersection Observer, skeleton loaders

---

## Epic 5: Página del Producto

### US-24: Ver galería de imágenes
**Como** visitante **quiero** ver todas las fotos del producto **para** evaluarlo visualmente.
- Prioridad: 🔴
- Criterios: carrusel con thumbnails, zoom en click, navegación por swipe en mobile

### US-25: Ver información del negocio
**Como** visitante **quiero** ver quién vende el producto **para** conocer al vendedor.
- Prioridad: 🔴
- Criterios: nombre, logo, categoría, ubicación, link a página del negocio

### US-26: Ver productos relacionados
**Como** visitante **quiero** ver productos relacionados **para** descubir opciones similares.
- Prioridad: 🟡
- Criterios: misma categoría/subcategoría, máximo 6, excluye producto actual

### US-27: Contactar por WhatsApp
**Como** visitante **quiero** contactar al vendedor por WhatsApp **para** hacer una consulta o compra.
- Prioridad: 🔴
- Criterios: botón visible, abre wa.me con mensaje pre-escrito incluyendo nombre del producto, click registrado

### US-28: Compartir producto
**Como** visitante **quiero** compartir un producto **para** enviárselo a alguien.
- Prioridad: 🟡
- Criterios: Web Share API si disponible, copiar link como fallback, toast de confirmación

---

## Epic 6: Favoritos

### US-29: Agregar a favoritos
**Como** comprador **quiero** guardar un producto como favorito **para** revisarlo después.
- Prioridad: 🔴
- Criterios: requiere login, feedback visual inmediato, persistente

### US-30: Eliminar de favoritos
**Como** comprador **quiero** quitar un producto de favoritos **para** limpiar mi lista.
- Prioridad: 🔴
- Criterios: toggle desde cualquier vista con ícono de corazón

### US-31: Ver mis favoritos
**Como** comprador **quiero** ver mi lista de favoritos **para** revisar productos guardados.
- Prioridad: 🔴
- Criterios: página dedicada, grid de tarjetas, opción de eliminar desde la lista

---

## Epic 7: Dashboard del Vendedor

### US-32: Ver total de visitas
**Como** vendedor **quiero** ver cuántas visitas reciben mis productos **para** medir interés.
- Prioridad: 🔴
- Criterios: número total, gráfico de últimos 30 días

### US-33: Ver productos más vistos
**Como** vendedor **quiero** ver mis productos más vistos **para** saber qué genera más interés.
- Prioridad: 🟡
- Criterios: top 5 con número de vistas, link al producto

### US-34: Ver clicks de WhatsApp
**Como** vendedor **quiero** ver cuántos clicks recibe mi botón de WhatsApp **para** medir conversión.
- Prioridad: 🔴
- Criterios: número total, gráfico temporal

### US-35: Ver favoritos recibidos
**Como** vendedor **quiero** ver cuántos favoritos tienen mis productos **para** medir interés.
- Prioridad: 🟡
- Criterios: número total por producto

### US-36: Ver cantidad de productos publicados
**Como** vendedor **quiero** ver cuántos productos tengo publicados **para** gestionar mi catálogo.
- Prioridad: 🔴
- Criterios: contador, desglose por estado (publicado/borrador)

---

## Epic 8: Panel Administrador

### US-37: Dashboard admin
**Como** admin **quiero** ver métricas globales **para** entender el estado de la plataforma.
- Prioridad: 🔴
- Criterios: totales de usuarios, negocios, productos, visitas, clicks WhatsApp

### US-38: Gestionar usuarios
**Como** admin **quiero** ver y suspender usuarios **para** mantener la plataforma segura.
- Prioridad: 🟡
- Criterios: lista paginada, búsqueda, suspender/reactivar

### US-39: Gestionar negocios
**Como** admin **quiero** ver y desactivar negocios **para** controlar el catálogo.
- Prioridad: 🟡
- Criterios: lista paginada, activar/desactivar

### US-40: Gestionar categorías
**Como** admin **quiero** crear y editar categorías y subcategorías **para** organizar el catálogo.
- Prioridad: 🔴
- Criterios: CRUD categorías, CRUD subcategorías vinculadas

### US-41: Moderar productos
**Como** admin **quiero** revisar productos reportados **para** mantener calidad.
- Prioridad: 🟢
- Criterios: lista de reportados, aprobar/eliminar

### US-42: Exportar reportes
**Como** admin **quiero** exportar reportes en CSV **para** analizar datos externamente.
- Prioridad: 🟢
- Criterios: exportar usuarios, negocios, productos, eventos analíticos

---

## Epic 9: PWA y Experiencia

### US-43: Instalar como app
**Como** usuario **quiero** instalar la plataforma como app **para** acceso rápido desde mi pantalla.
- Prioridad: 🔴
- Criterios: prompt de instalación, manifest válido, iconos en home screen

### US-44: Navegación offline básica
**Como** usuario **quiero** navegar páginas ya visitadas sin internet **para** consultar productos sin conexión.
- Prioridad: 🟡
- Criterios: Service Worker cachea páginas visitadas, mensaje offline para nuevas páginas

### US-45: Tema oscuro
**Como** usuario **quiero** cambiar entre tema claro y oscuro **para** usar la app cómodamente en cualquier condición de luz.
- Prioridad: 🟡
- Criterios: toggle persistente, detección de preferencia del sistema, sin flash

### US-46: Experiencia responsive
**Como** usuario **quiero** que la app funcione bien en mi dispositivo **para** usarla cómodamente.
- Prioridad: 🔴
- Criterios: mobile-first, breakpoints tablet y desktop, touch-friendly

---

## Resumen de Prioridades

| Prioridad | Cantidad |
|---|---|
| 🔴 Must | 26 |
| 🟡 Should | 16 |
| 🟢 Could | 4 |
| **Total** | **46** |
