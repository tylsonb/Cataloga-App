# Catáloga

Catálogo inteligente para encontrar productos y servicios que se venden por WhatsApp.

## Configuración

### Variables de entorno

Crear archivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Google OAuth (configuración manual)

El botón "Continuar con Google" ya está implementado en código. Para activarlo:

1. **Supabase Dashboard** → https://supabase.com/dashboard/project/kauwvsabxorxorlosbpqixg/auth/providers
   - Activar provider "Google"

2. **Google Cloud Console** → https://console.cloud.google.com/apis/credentials
   - Crear OAuth 2.0 Client ID (Web application)
   - Authorized redirect URI: `https://kauwvsabxorxorlosbpqixg.supabase.co/auth/v1/callback`

3. **Volver a Supabase Dashboard**
   - Pegar Client ID y Client Secret de Google
   - Guardar

4. Verificar que `NEXT_PUBLIC_SITE_URL` apunta al dominio correcto en `.env.local`

### PWA Iconos (opcional)

Los iconos SVG placeholder están en `public/icons/`. Para generar PNGs reales:

1. Ir a https://www.pwabuilder.com o https://realfavicongenerator.net
2. Subir el logo de Catáloga
3. Descargar los PNGs generados (192x192 y 512x512)
4. Reemplazar los archivos en `public/icons/`
5. Actualizar `public/manifest.json` para usar `image/png` en lugar de `image/svg+xml`

## Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run type-check   # Verificación de tipos TypeScript
```
