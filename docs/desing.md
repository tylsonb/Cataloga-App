# Design System: Catáloga (PWA & Desktop)

---

## 1. Filosofía de Diseño & Identidad

Catáloga es una Progressive Web App (PWA) optimizada para la conversión entre la exploración ágil de productos y el cierre de ventas directo vía WhatsApp.

* **Human-Centric & Táctil:** Interfaces con profundidad visual deliberada (bordes sutiles, micro-sombras de elevación, contrastes nítidos y áreas de toque generosas de mínimo 48x48 px) que eliminan la estética plana y genérica.
* **App-Like Feel Nativo:** Soporte nativo para *Safe Area Insets* en iOS y Android, navegación inferior fija (*Bottom Navigation Bar*), feedback háptico/visual instantáneo al presionar (`active:scale-[0.97]`) y scroll inercial suave sin rebotes innecesarios.
* **WhatsApp Direct-Response Engine:** Cada elemento de producto prioriza la acción de compra con integración visual directa al ecosistema de mensajería (verde esmeralda característico, formato de mensajes dinámicos y previsualizaciones claras).

---

## 2. Tokens de Color & Variables CSS (Modo Claro / Oscuro)

Configuración base en HSL lista para `tailwind.config.js` y `globals.css`.

### 2.1 Mapeo de Tokens HSL

```css
@layer base {
  :root {
    /* Superficies y Fondos */
    --background: 40 20% 99%;       /* #FDFCF9 - Blanco cálido orgánico */
    --foreground: 222 47% 11%;      /* #0F172A - Pizarra profundo */
    --surface: 0 0% 100%;          /* #FFFFFF - Tarjetas y modales */
    --surface-subtle: 40 15% 95%;   /* #F5F3ED - Fondos secundarios */
    --border: 220 13% 91%;          /* #E2E8F0 - Bordes estructurales */

    /* Identidad de Marca */
    --primary: 158 72% 38%;         /* #1AA36B - Verde Catáloga WhatsApp Pro */
    --primary-foreground: 0 0% 100%;
    --primary-hover: 158 75% 32%;

    /* Acentos & Conversión */
    --accent: 14 90% 58%;           /* #F15A24 - Naranja quemado para badges y alertas */
    --accent-foreground: 0 0% 100%;

    /* Categorías Táctiles (Pasteles Saturados) */
    --cat-peach: 16 100% 95%;       /* Alimentos */
    --cat-mint: 152 68% 93%;        /* Moda / Frescura */
    --cat-lilac: 250 80% 96%;       /* Tecnología / Hogar */
    --cat-lemon: 48 100% 92%;       /* Ofertas / Novedades */

    /* UI Neutros */
    --muted: 215 16% 47%;           /* #64748B - Textos de apoyo */
    --muted-foreground: 215 16% 47%;
    --ring: 158 72% 38%;
  }

  .dark {
    --background: 224 71% 4%;       /* #020617 - Obsidian Night */
    --foreground: 210 40% 98%;      /* #F8FAFC */
    --surface: 222 47% 9%;          /* #0B132B */
    --surface-subtle: 223 47% 13%;  /* #111D42 */
    --border: 217 33% 17%;

    --primary: 155 75% 44%;         /* #1BCB85 - Alta visibilidad en oscuro */
    --primary-foreground: 224 71% 4%;
    --primary-hover: 155 75% 50%;

    --accent: 14 95% 64%;
    --accent-foreground: 0 0% 100%;

    --cat-peach: 16 35% 15%;
    --cat-mint: 152 30% 14%;
    --cat-lilac: 250 30% 16%;
    --cat-lemon: 48 30% 14%;

    --muted: 215 20% 65%;
    --muted-foreground: 215 20% 65%;
    --ring: 155 75% 44%;
  }
}