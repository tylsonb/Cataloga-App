# 05 — Wireframes

Los wireframes se describen en formato ASCII art para representar cada pantalla clave del MVP.

---

## 1. Landing / Home (Visitante)

```
┌──────────────────────────────────────────────────┐
│  [Logo]    [Buscar...]     [☀️/🌙] [♥] [Login]    │
├──────────────────────────────────────────────────┤
│                                                  │
│         Encuentra productos de tus               │
│         grupos de WhatsApp en un solo lugar      │
│                                                  │
│         [Buscar productos...]    [Buscar]        │
│                                                  │
│    [Categoría▼] [Ciudad▼] [Precio▼] [Ordenar▼]   │
│                                                  │
├──────────────────────────────────────────────────┤
│  Categorías populares                            │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │ 🛒 │ │ 👕 │ │ 🍔 │ │ 💻 │ │ 🏠 │              │
│  │Comi│ │Ropa│ │Comi│ │Tec │ │Hog │              │
│  └────┘ └────┘ └────┘ └────┘ └────┘              │
├──────────────────────────────────────────────────┤
│  Productos destacados                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ Img  │ │ Img  │ │ Img  │ │ Img  │             │
│  │      │ │      │ │      │ │      │             │
│  │Nombre│ │Nombre│ │Nombre│ │Nombre│             │
│  │$Precio│ │$Precio│ │$Precio│ │$Precio│           │
│  │Negocio│ │Negocio│ │Negocio│ │Negocio│           │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
│                                                  │
│  [Ver más productos →]                           │
├──────────────────────────────────────────────────┤
│  ¿Vendes por WhatsApp?                           │
│  [Crea tu catálogo gratis]                       │
├──────────────────────────────────────────────────┤
│  Footer: About | Términos | Privacidad | Contacto│
└──────────────────────────────────────────────────┘
```

---

## 2. Resultados de Búsqueda

```
┌──────────────────────────────────────────────────┐
│  [←] [Buscar "zapatos"...]          [☀️/🌙] [♥]   │
├───────────────┬──────────────────────────────────┤
│  Filtros      │  Resultados (24)  [Ordenar: Rec.▼]│
│               │                                  │
│  Categoría    │  ┌──────┐ ┌──────┐ ┌──────┐      │
│  ☑ Moda       │  │ Img  │ │ Img  │ │ Img  │      │
│  ☐ Tecnología │  │      │ │      │ │      │      │
│  ☐ Hogar      │  │Nombre│ │Nombre│ │Nombre│      │
│               │  │$Precio│ │$Precio│ │$Precio│    │
│  Subcategoría │  │Negocio│ │Negocio│ │Negocio│    │
│  ☑ Calzado    │  └──────┘ └──────┘ └──────┘      │
│  ☐ Ropa       │                                  │
│               │  ┌──────┐ ┌──────┐ ┌──────┐      │
│  Ubicación    │  │ Img  │ │ Img  │ │ Img  │      │
│  Ciudad: Stgo │  │      │ │      │ │      │      │
│  Comuna: ▼    │  │Nombre│ │Nombre│ │Nombre│      │
│               │  │$Precio│ │$Precio│ │$Precio│    │
│  Precio       │  │Negocio│ │Negocio│ │Negocio│    │
│  [Min] - [Max]│  └──────┘ └──────┘ └──────┘      │
│               │                                  │
│  [Limpiar]    │  [Cargando más...] (infinite)    │
└───────────────┴──────────────────────────────────┘
```

**Mobile:**
```
┌──────────────────┐
│ [←] [Buscar...]   │
│         [☀️] [♥]   │
├──────────────────┤
│ [Filtros ▼] [Ord▼]│
├──────────────────┤
│ ┌──────┐ ┌──────┐│
│ │ Img  │ │ Img  ││
│ │Nombre│ │Nombre││
│ │$Precio│ │$Precio││
│ │Negocio│ │Negocio││
│ └──────┘ └──────┘│
│ ┌──────┐ ┌──────┐│
│ │ Img  │ │ Img  ││
│ │Nombre│ │Nombre││
│ │$Precio│ │$Precio││
│ │Negocio│ │Negocio││
│ └──────┘ └──────┘│
│ [Cargando más...] │
└──────────────────┘
```

---

## 3. Página de Producto

```
┌──────────────────────────────────────────────────┐
│  [←]                              [☀️/🌙] [♥] [⬆] │
├───────────────────────┬──────────────────────────┤
│                       │  Nombre del Producto      │
│   ┌─────────────────┐ │  $10.990                  │
│   │                 │ │  [Disponible] [Destacado]  │
│   │   Imagen Grande │ │                           │
│   │                 │ │  ───────────────────────  │
│   └─────────────────┘ │                           │
│   [thumb1][thumb2][3] │  Descripción completa      │
│                       │  del producto aquí...      │
│                       │                           │
│                       │  ───────────────────────  │
│                       │  Vendedor                  │
│                       │  ┌────┐ Nombre Negocio    │
│                       │  │Logo│ Categoría          │
│                       │  └────┐ Santiago, Comuna  │
│                       │         [Ver negocio →]   │
│                       │                           │
│                       │  ───────────────────────  │
│                       │  [💬 Contactar por WhatsApp]│
│                       │                           │
├───────────────────────┴──────────────────────────┤
│  Productos relacionados                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ Img  │ │ Img  │ │ Img  │ │ Img  │             │
│  │Nombre│ │Nombre│ │Nombre│ │Nombre│             │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
└──────────────────────────────────────────────────┘
```

**Mobile:**
```
┌──────────────────┐
│ [←]        [♥] [⬆]│
├──────────────────┤
│ ┌──────────────┐ │
│ │              │ │
│ │  Imagen      │ │
│ │  Grande      │ │
│ │              │ │
│ └──────────────┘ │
│ [1][2][3][4][5]  │
├──────────────────┤
│ Nombre Producto   │
│ $10.990           │
│ [Disponible]      │
├──────────────────┤
│ Descripción...    │
│                   │
├──────────────────┤
│ ┌────┐ Negocio   │
│ │Logo│ Categoría  │
│ └────┘ Santiago   │
│ [Ver negocio →]   │
├──────────────────┤
│ [💬 Contactar por │
│      WhatsApp]    │
├──────────────────┤
│ Relacionados      │
│ ┌────┐ ┌────┐    │
│ │Img │ │Img │    │
│ │Nom │ │Nom │    │
│ └────┘ └────┘    │
└──────────────────┘
```

---

## 4. Login / Registro

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              [Logo Catáloga]                     │
│                                                  │
│         ┌──────────────────────┐                 │
│         │                      │                 │
│         │   Iniciar Sesión     │                 │
│         │                      │                 │
│         │  [G  Continuar con G]│                 │
│         │                      │                 │
│         │  ── o ──             │                 │
│         │                      │                 │
│         │  Email:              │                 │
│         │  [______________]    │                 │
│         │                      │                 │
│         │  Contraseña:         │                 │
│         │  [______________]    │                 │
│         │                      │                 │
│         │  [Iniciar Sesión]    │                 │
│         │                      │                 │
│         │  ¿Olvidaste tu       │                 │
│         │  contraseña?         │                 │
│         │                      │                 │
│         │  ¿No tienes cuenta?  │                 │
│         │  [Regístrate]        │                 │
│         └──────────────────────┘                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 5. Dashboard del Vendedor

```
┌──────────────────────────────────────────────────┐
│  [Logo]  Dashboard  Productos  Negocio  [Perfil]  │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ Visitas │ │ Clicks │ │Favorit.│ │Product.│     │
│  │  1.234  │ │   89   │ │   45   │ │   12   │     │
│  └────────┘ └────────┘ └────────┘ └────────┘     │
│                                                  │
│  Visitas últimos 30 días                         │
│  ┌──────────────────────────────────────────┐    │
│  │     ▁▂▃▅▆▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Productos más vistos                            │
│  ┌──────────────────────────────────────────┐    │
│  │ 1. Producto A              342 visitas   │    │
│  │ 2. Producto B              287 visitas   │    │
│  │ 3. Producto C              156 visitas   │    │
│  │ 4. Producto D               98 visitas   │    │
│  │ 5. Producto E               67 visitas   │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Clicks WhatsApp últimos 30 días                 │
│  ┌──────────────────────────────────────────┐    │
│  │     ▁▁▂▃▃▄▅▅▆▆▇▇▆▅▄▃▃▂▂▁▁▁▂▃           │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 6. Gestión de Productos (Vendedor)

```
┌──────────────────────────────────────────────────┐
│  [Logo]  Dashboard  Productos  Negocio  [Perfil]  │
├──────────────────────────────────────────────────┤
│  Mis Productos              [+ Nuevo Producto]   │
│  [Todos▼] [Publicados] [Borradores] [Destacados]  │
├──────────────────────────────────────────────────┤
│  ┌────┐ Nombre          Precio    Estado  Acción  │
│  │Img │ Producto A      $10.990   Publi   ✏️ 🗑 ⭐ │
│  └────┘                                            │
│  ┌────┐ Nombre          Precio    Estado  Acción  │
│  │Img │ Producto B      $5.990    Borrador ✏️ 🗑 ⭐│
│  └────┘                                            │
│  ┌────┐ Nombre          Precio    Estado  Acción  │
│  │Img │ Producto C      $25.000   Publi   ✏️ 🗑 ⭐ │
│  └────┘                                            │
│                                                   │
│  [← Anterior]  Página 1 de 3  [Siguiente →]      │
└──────────────────────────────────────────────────┘
```

---

## 7. Formulario Crear/Editar Producto

```
┌──────────────────────────────────────────────────┐
│  [←] Nuevo Producto                               │
├──────────────────────────────────────────────────┤
│                                                   │
│  Imágenes                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │  +   │ │ Img1 │ │ Img2 │ │ Img3 │ │ Img4 │    │
│  │Subir │ │      │ │      │ │      │ │      │    │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
│  Arrastra para reordenar (máx 5)                  │
│                                                   │
│  Nombre *                                         │
│  [____________________________________]           │
│                                                   │
│  Descripción *                                    │
│  [____________________________________]           │
│  [____________________________________]           │
│  [____________________________________]           │
│                                                   │
│  Precio *              Moneda                     │
│  [__________]          [CLP ▼]                    │
│                                                   │
│  Categoría *           Subcategoría               │
│  [Moda ▼]              [Calzado ▼]                │
│                                                   │
│  Stock                 Disponibilidad             │
│  [__________]          [● Disponible]             │
│  □ Ilimitado                                      │
│                                                   │
│  □ Producto destacado                             │
│                                                   │
│  Estado                                           │
│  (●) Publicado  ( ) Borrador                      │
│                                                   │
│  [Guardar]  [Cancelar]                            │
└──────────────────────────────────────────────────┘
```

---

## 8. Panel Administrador

```
┌──────────────────────────────────────────────────┐
│  [Logo] Admin                                     │
│  ┌─────────┬──────────────────────────────────────┐
│  │         │                                      │
│  │ Dashbd  │  Dashboard General                   │
│  │ Usuarios│                                      │
│  │ Negocios│  ┌────────┐┌────────┐┌────────┐      │
│  │ Product.│  │Usuarios││Negocios││Product.│      │
│  │ Categor.│  │  1.234 ││   56   ││  890   │      │
│  │ Reportes│  └────────┘└────────┘└────────┘      │
│  │ Moder.  │                                      │
│  │         │  ┌────────┐┌────────┐                │
│  │         │  │ Visitas││ClicksWA│                │
│  │         │  │ 45.678 ││  3.456 │                │
│  │         │  └────────┘└────────┘                │
│  │         │                                      │
│  │         │  [Exportar CSV]                      │
│  │         │                                      │
│  └─────────┴──────────────────────────────────────┘
```

---

## 9. Mis Favoritos

```
┌──────────────────────────────────────────────────┐
│  [←] Mis Favoritos                    [☀️/🌙]     │
├──────────────────────────────────────────────────┤
│  12 productos guardados                           │
├──────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ Img  │ │ Img  │ │ Img  │ │ Img  │             │
│  │      │ │      │ │      │ │      │             │
│  │Nombre│ │Nombre│ │Nombre│ │Nombre│             │
│  │$Precio│ │$Precio│ │$Precio│ │$Precio│           │
│  │Negocio│ │Negocio│ │Negocio│ │Negocio│           │
│  │  ♥    │ │  ♥    │ │  ♥    │ │  ♥    │           │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
│                                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ Img  │ │ Img  │ │ Img  │ │ Img  │             │
│  │      │ │      │ │      │ │      │             │
│  │Nombre│ │Nombre│ │Nombre│ │Nombre│             │
│  │$Precio│ │$Precio│ │$Precio│ │$Precio│           │
│  │Negocio│ │Negocio│ │Negocio│ │Negocio│           │
│  │  ♥    │ │  ♥    │ │  ♥    │ │  ♥    │           │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
└──────────────────────────────────────────────────┘
```

---

## 10. Página de Negocio (Pública)

```
┌──────────────────────────────────────────────────┐
│  [←]                              [☀️/🌙] [♥] [⬆] │
├──────────────────────────────────────────────────┤
│  ┌──────┐                                        │
│  │ Logo  │  Nombre del Negocio                   │
│  └──────┘  Categoría · Santiago, Comuna          │
│            [💬 Contactar por WhatsApp]            │
├──────────────────────────────────────────────────┤
│  Descripción del negocio...                       │
│                                                   │
│  Horario: Lun-Vie 9:00-18:00                      │
│  Instagram: @negocio  Facebook: /negocio          │
├──────────────────────────────────────────────────┤
│  Productos (12)              [Ordenar: Recientes▼]│
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ Img  │ │ Img  │ │ Img  │ │ Img  │             │
│  │Nombre│ │Nombre│ │Nombre│ │Nombre│             │
│  │$Precio│ │$Precio│ │$Precio│ │$Precio│           │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ Img  │ │ Img  │ │ Img  │ │ Img  │             │
│  │Nombre│ │Nombre│ │Nombre│ │Nombre│             │
│  │$Precio│ │$Precio│ │$Precio│ │$Precio│           │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
└──────────────────────────────────────────────────┘
```

---

## 11. Mobile Navigation (Bottom Bar)

```
┌──────────────────┐
│                  │
│   Contenido      │
│   de la app      │
│                  │
│                  │
│                  │
│                  │
├──────────────────┤
│ [🏠] [🔍] [♥] [👤]│
│ Inicio Buscar Fav Perfil│
└──────────────────┘
```

**Nota:** La bottom navigation bar aparece solo en mobile. En desktop, la navegación está en el header.
