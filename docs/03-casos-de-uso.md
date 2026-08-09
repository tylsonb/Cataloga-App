# 03 — Casos de Uso

## 1. Diagrama de Actores

```
         ┌──────────┐
         │   Admin   │
         └─────┬─────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
 Gestionar   Moderar   Ver reportes
 usuarios    contenido  y analíticas

         ┌──────────┐
         │ Vendedor  │
         └─────┬─────┘
               │
  ┌────────┬───┴───┬─────────┬──────────┐
  │        │       │         │          │
  ▼        ▼       ▼         ▼          ▼
 Gestionar Gestionar Ver      Gestionar  Ver
 negocio   productos dashboard perfil     analíticas

         ┌──────────┐
         │Comprador  │
         └─────┬─────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
 Buscar      Ver        Gestionar   Contactar
 productos   producto   favoritos   por WhatsApp

         ┌──────────┐
         │ Visitante │
         └─────┬─────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
 Buscar      Ver        Compartir
 productos   producto   producto
```

---

## 2. Casos de Uso Detallados

### CU-01: Registro de Usuario

| Campo | Valor |
|---|---|
| **ID** | CU-01 |
| **Actor** | Visitante |
| **Descripción** | Un visitante se registra en la plataforma con email o Google |
| **Precondición** | No tener cuenta activa |
| **Flujo principal** | 1. Visitante hace clic en "Registrarse" → 2. Selecciona método (email/Google) → 3. Si email: ingresa email, contraseña, nombre → 4. Sistema envía email de confirmación → 5. Usuario confirma email → 6. Cuenta creada con rol "comprador" |
| **Flujo alternativo** | Si Google: 1. Click "Continuar con Google" → 2. OAuth flow → 3. Cuenta creada con datos de Google |
| **Postcondición** | Usuario autenticado con perfil creado |

### CU-02: Login de Usuario

| Campo | Valor |
|---|---|
| **ID** | CU-02 |
| **Actor** | Comprador, Vendedor, Admin |
| **Descripción** | Usuario inicia sesión |
| **Precondición** | Tener cuenta activa |
| **Flujo principal** | 1. Usuario hace clic en "Iniciar sesión" → 2. Ingresa email y contraseña → 3. Sistema valida credenciales → 4. JWT emitido → 5. Redirect a home o dashboard |
| **Flujo alternativo** | Login con Google OAuth |
| **Postcondición** | Sesión activa |

### CU-03: Recuperar Contraseña

| Campo | Valor |
|---|---|
| **ID** | CU-03 |
| **Actor** | Cualquier usuario |
| **Descripción** | Usuario solicita reset de contraseña |
| **Flujo principal** | 1. Click "¿Olvidaste tu contraseña?" → 2. Ingresa email → 3. Sistema envía link de reset → 4. Usuario click en link → 5. Ingresa nueva contraseña → 6. Contraseña actualizada |
| **Postcondición** | Usuario puede iniciar sesión con nueva contraseña |

### CU-04: Crear/Editar Perfil de Usuario

| Campo | Valor |
|---|---|
| **ID** | CU-04 |
| **Actor** | Comprador, Vendedor |
| **Descripción** | Usuario actualiza su perfil personal |
| **Flujo principal** | 1. Ir a "Mi perfil" → 2. Editar nombre, avatar, teléfono → 3. Guardar cambios |
| **Postcondición** | Perfil actualizado |

### CU-05: Crear Negocio

| Campo | Valor |
|---|---|
| **ID** | CU-05 |
| **Actor** | Vendedor |
| **Descripción** | Vendedor registra su negocio en la plataforma |
| **Precondición** | Estar autenticado |
| **Flujo principal** | 1. Click "Vender" o "Crear negocio" → 2. Completa formulario (logo, nombre, descripción, categoría, dirección, ciudad, comuna, WhatsApp, redes, horario) → 3. Sistema valida con Zod → 4. Negocio creado con estado "activo" → 5. Redirect a dashboard del vendedor |
| **Postcondición** | Negocio creado, usuario ahora es vendedor |

### CU-06: Editar Negocio

| Campo | Valor |
|---|---|
| **ID** | CU-06 |
| **Actor** | Vendedor (owner) |
| **Descripción** | Vendedor actualiza datos de su negocio |
| **Precondición** | Tener negocio creado |
| **Flujo principal** | 1. Ir a "Mi negocio" → 2. Editar campos → 3. Guardar → 4. Sistema valida → 5. Negocio actualizado |
| **Postcondición** | Datos del negocio actualizados |

### CU-07: Activar/Desactivar Negocio

| Campo | Valor |
|---|---|
| **ID** | CU-07 |
| **Actor** | Vendedor |
| **Descripción** | Vendedor pausa o reactiva su negocio |
| **Flujo principal** | 1. Ir a configuración del negocio → 2. Toggle estado Activo/Inactivo → 3. Confirmar → 4. Si inactivo, productos no aparecen en búsqueda |
| **Postcondición** | Visibilidad del negocio actualizada |

### CU-08: Crear Producto

| Campo | Valor |
|---|---|
| **ID** | CU-08 |
| **Actor** | Vendedor |
| **Descripción** | Vendedor publica un nuevo producto |
| **Precondición** | Tener negocio activo |
| **Flujo principal** | 1. Click "Nuevo producto" → 2. Completa formulario (nombre, descripción, precio, categoría, subcategoría, stock, disponibilidad, fotos) → 3. Sube imágenes a Storage → 4. Sistema valida → 5. Producto creado con estado "publicado" o "borrador" → 6. Redirect a lista de productos |
| **Postcondición** | Producto visible en catálogo (si publicado) |

### CU-09: Editar Producto

| Campo | Valor |
|---|---|
| **ID** | CU-09 |
| **Actor** | Vendedor (owner) |
| **Descripción** | Vendedor actualiza un producto existente |
| **Flujo principal** | 1. Seleccionar producto de su lista → 2. Editar campos → 3. Guardar → 4. Sistema valida → 5. Producto actualizado |
| **Postcondición** | Producto actualizado |

### CU-10: Eliminar Producto

| Campo | Valor |
|---|---|
| **ID** | CU-10 |
| **Actor** | Vendedor (owner) |
| **Descripción** | Vendedor elimina un producto |
| **Flujo principal** | 1. Seleccionar producto → 2. Click "Eliminar" → 3. Confirmar → 4. Producto eliminado (soft delete) → 5. Imágenes eliminadas de Storage |
| **Postcondición** | Producto no visible |

### CU-11: Marcar Producto como Destacado

| Campo | Valor |
|---|---|
| **ID** | CU-11 |
| **Actor** | Vendedor |
| **Descripción** | Vendedor destaca un producto |
| **Flujo principal** | 1. En lista de productos → 2. Toggle "Destacado" → 3. Producto destacado aparece primero en su negocio |
| **Postcondición** | Producto marcado como destacado |

### CU-12: Buscar Productos

| Campo | Valor |
|---|---|
| **ID** | CU-12 |
| **Actor** | Visitante, Comprador |
| **Descripción** | Usuario busca productos por texto y/o filtros |
| **Flujo principal** | 1. Ingresa texto en buscador → 2. Opcional: selecciona categoría, subcategoría, ciudad, comuna, rango de precio → 3. Selecciona ordenamiento → 4. Sistema retorna resultados paginados → 5. Usuario navega resultados |
| **Postcondición** | Búsqueda registrada en analíticas |

### CU-13: Ver Detalle de Producto

| Campo | Valor |
|---|---|
| **ID** | CU-13 |
| **Actor** | Cualquier usuario |
| **Descripción** | Usuario ve la página de detalle de un producto |
| **Flujo principal** | 1. Click en tarjeta de producto → 2. Sistema carga página de detalle → 3. Muestra galería, descripción, info del negocio, productos relacionados → 4. Visita registrada en analíticas |
| **Postcondición** | Visita registrada |

### CU-14: Contactar por WhatsApp

| Campo | Valor |
|---|---|
| **ID** | CU-14 |
| **Actor** | Cualquier usuario |
| **Descripción** | Usuario contacta al vendedor vía WhatsApp |
| **Flujo principal** | 1. Click "Contactar por WhatsApp" → 2. Click registrado en analíticas → 3. Redirección a `wa.me/{numero}?text={mensaje_pre_escrito}` → 4. WhatsApp se abre con mensaje pre-cargado |
| **Postcondición** | Click registrado en analíticas |

### CU-15: Compartir Producto

| Campo | Valor |
|---|---|
| **ID** | CU-15 |
| **Actor** | Cualquier usuario |
| **Descripción** | Usuario comparte un producto |
| **Flujo principal** | 1. Click "Compartir" → 2. Si Web Share API disponible: abrir dialog nativo → 3. Si no: copiar link al portapapeles + mostrar toast |
| **Postcondición** | Link compartido |

### CU-16: Agregar a Favoritos

| Campo | Valor |
|---|---|
| **ID** | CU-16 |
| **Actor** | Comprador |
| **Descripción** | Comprador guarda un producto como favorito |
| **Precondición** | Estar autenticado |
| **Flujo principal** | 1. Click en ícono de corazón en producto → 2. Sistema guarda favorito → 3. Ícono cambia a estado "favorito" |
| **Flujo alternativo** | Si no autenticado: mostrar prompt "Inicia sesión para guardar favoritos" |
| **Postcondición** | Producto en lista de favoritos del usuario |

### CU-17: Eliminar de Favoritos

| Campo | Valor |
|---|---|
| **ID** | CU-17 |
| **Actor** | Comprador |
| **Descripción** | Comprador elimina un producto de favoritos |
| **Flujo principal** | 1. Click en ícono de corazón (estado favorito) → 2. Sistema elimina favorito → 3. Ícono cambia a estado "no favorito" |
| **Postcondición** | Producto removido de favoritos |

### CU-18: Ver Lista de Favoritos

| Campo | Valor |
|---|---|
| **ID** | CU-18 |
| **Actor** | Comprador |
| **Descripción** | Comprador ve todos sus productos favoritos |
| **Flujo principal** | 1. Click "Mis favoritos" → 2. Sistema carga lista de productos favoritos → 3. Render en grid de tarjetas |
| **Postcondición** | — |

### CU-19: Ver Dashboard del Vendedor

| Campo | Valor |
|---|---|
| **ID** | CU-19 |
| **Actor** | Vendedor |
| **Descripción** | Vendedor ve métricas de su negocio |
| **Flujo principal** | 1. Ir a "Dashboard" → 2. Sistema carga métricas: visitas totales, productos publicados, top 5 más vistos, clicks WhatsApp, favoritos → 3. Render con gráficos y tarjetas |
| **Postcondición** | — |

### CU-20: Gestionar Categorías (Admin)

| Campo | Valor |
|---|---|
| **ID** | CU-20 |
| **Actor** | Admin |
| **Descripción** | Admin crea, edita o elimina categorías y subcategorías |
| **Flujo principal** | 1. Ir a Panel Admin → Categorías → 2. Crear/editar/eliminar categoría → 3. Sistema valida → 4. Cambios reflejados |
| **Postcondición** | Categorías actualizadas |

### CU-21: Gestionar Usuarios (Admin)

| Campo | Valor |
|---|---|
| **ID** | CU-21 |
| **Actor** | Admin |
| **Descripción** | Admin ve y suspende usuarios |
| **Flujo principal** | 1. Panel Admin → Usuarios → 2. Ver lista paginada → 3. Buscar usuario → 4. Suspender/Reactivar usuario |
| **Postcondición** | Estado del usuario actualizado |

### CU-22: Moderar Productos (Admin)

| Campo | Valor |
|---|---|
| **ID** | CU-22 |
| **Actor** | Admin |
| **Descripción** | Admin revisa y modera productos reportados |
| **Flujo principal** | 1. Panel Admin → Moderación → 2. Ver productos reportados → 3. Aprobar o eliminar producto → 4. Estado actualizado |
| **Postcondición** | Producto moderado |

### CU-23: Ver Dashboard Admin

| Campo | Valor |
|---|---|
| **ID** | CU-23 |
| **Actor** | Admin |
| **Descripción** | Admin ve métricas globales de la plataforma |
| **Flujo principal** | 1. Panel Admin → Dashboard → 2. Ver totales: usuarios, negocios, productos, visitas, clicks WhatsApp → 3. Exportar CSV |
| **Postcondición** | — |

### CU-24: Ver Negocio del Vendedor

| Campo | Valor |
|---|---|
| **ID** | CU-24 |
| **Actor** | Cualquier usuario |
| **Descripción** | Usuario ve la página pública de un negocio |
| **Flujo principal** | 1. Click en nombre/logo del negocio desde producto → 2. Sistema carga página del negocio → 3. Muestra info del negocio + catálogo de productos → 4. Visita al negocio registrada |
| **Postcondición** | Visita registrada en analíticas |

---

## 3. Matriz de Casos de Uso por Actor

| CU | Visitante | Comprador | Vendedor | Admin |
|---|---|---|---|---|
| CU-01 Registro | ✓ | — | — | — |
| CU-02 Login | — | ✓ | ✓ | ✓ |
| CU-03 Recuperar contraseña | ✓ | ✓ | ✓ | ✓ |
| CU-04 Editar perfil | — | ✓ | ✓ | ✓ |
| CU-05 Crear negocio | — | ✓→Vendedor | — | — |
| CU-06 Editar negocio | — | — | ✓ | — |
| CU-07 Activar/Desactivar negocio | — | — | ✓ | — |
| CU-08 Crear producto | — | — | ✓ | — |
| CU-09 Editar producto | — | — | ✓ | — |
| CU-10 Eliminar producto | — | — | ✓ | — |
| CU-11 Destacar producto | — | — | ✓ | — |
| CU-12 Buscar productos | ✓ | ✓ | ✓ | ✓ |
| CU-13 Ver producto | ✓ | ✓ | ✓ | ✓ |
| CU-14 Contactar WhatsApp | ✓ | ✓ | ✓ | ✓ |
| CU-15 Compartir | ✓ | ✓ | ✓ | ✓ |
| CU-16 Agregar favorito | — | ✓ | ✓ | ✓ |
| CU-17 Eliminar favorito | — | ✓ | ✓ | ✓ |
| CU-18 Ver favoritos | — | ✓ | ✓ | ✓ |
| CU-19 Dashboard vendedor | — | — | ✓ | — |
| CU-20 Gestionar categorías | — | — | — | ✓ |
| CU-21 Gestionar usuarios | — | — | — | ✓ |
| CU-22 Moderar productos | — | — | — | ✓ |
| CU-23 Dashboard admin | — | — | — | ✓ |
| CU-24 Ver negocio | ✓ | ✓ | ✓ | ✓ |
