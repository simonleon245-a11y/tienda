# Recos Diarias — sitio web

Página de aterrizaje (landing page) simple, sin dependencias ni pasos de
compilación — es un solo archivo `index.html` que se puede publicar tal
cual en cualquier hosting.

Junto con `DailyRecsApp/` (la app en sí, exportada como web/PWA), forman
**dos sitios separados**:

1. **Esta carpeta (`Website/`)** → la página de presentación, con
   explicación de la app, cómo instalarla y la sección de precios/Premium.
2. **`DailyRecsApp/`** → la app funcionando de verdad como PWA (a donde
   apuntan los botones "Abrir la app" / "Empezar gratis" de esta página).

Publicarlas como dos proyectos separados (en vez de meter la app dentro
de esta página) evita problemas de rutas rotas — cada una vive en su
propia URL, conectadas por un link.

## Publicar gratis con Vercel

1. Crea una cuenta gratis en https://vercel.com — el botón **"Continue with
   GitHub"** es lo más fácil, usa la misma cuenta donde está tu repositorio.
2. Dale **"Add New..." → "Project"** y elige tu repositorio (`tienda`).
3. Vas a crear **dos proyectos** a partir del mismo repositorio (Vercel
   permite importarlo varias veces con configuración distinta cada vez):

   **Proyecto 1 — la página web:**
   - Nombre: lo que quieras, ej. `recos-diarias`
   - **Root Directory**: `Website`
   - Framework Preset: `Other` (déjalo así, no necesita nada especial)
   - Branch: asegúrate de que diga `claude/daily-recommendations-app-gci6an`
     (no `main`) — se cambia en "Git" dentro de la configuración del
     proyecto si no te lo pregunta al importar
   - Dale **Deploy**

   **Proyecto 2 — la app:**
   - Nombre: ej. `recos-diarias-app`
   - **Root Directory**: `DailyRecsApp`
   - Framework Preset: `Other`
   - Branch: `claude/daily-recommendations-app-gci6an`
   - Antes de darle Deploy, agrega las variables de entorno (sección
     "Environment Variables"), las mismas que tienes en tu `.env` local:
     - `LASTFM_API_KEY`
     - `TMDB_API_KEY`
     - `TMDB_WATCH_REGION` (pon `CO`)
     - `GOOGLE_BOOKS_API_KEY` (si tienes una; si no, déjala vacía)
     - `PREMIUM_CHECKOUT_URL` (tu link de pago; si no lo tienes aún,
       déjala vacía y la agregas después)
   - Dale **Deploy**

4. Cuando terminen, cada proyecto te da una URL tipo
   `https://recos-diarias-app.vercel.app` — copia la del **Proyecto 2**
   (la app).

5. Abre `Website/index.html` en tu computadora, busca el texto
   `TU-APP-AQUI.vercel.app` (aparece 2 veces) y reemplázalo por esa URL
   real. Guarda, y sube el cambio:
   ```bash
   git add Website/index.html
   git commit -m "Conectar la web con la URL real de la app"
   git push origin claude/daily-recommendations-app-gci6an
   ```
   Vercel vuelve a publicar el Proyecto 1 automáticamente en cuanto detecta
   el push — en 1-2 minutos ya queda conectado.

## Actualizar más adelante

Cada vez que se haga `git push` a esta rama, Vercel vuelve a publicar
ambos proyectos solo — no hay que repetir nada de esto. Si cambias de
rama a `main` en algún momento (por ejemplo, al fusionar este trabajo),
recuerda actualizar la rama de producción en la configuración de cada
proyecto en Vercel ("Settings → Git → Production Branch").

## Dominio propio (opcional)

Por defecto queda en un subdominio gratis de Vercel
(`tu-proyecto.vercel.app`). Si más adelante compras un dominio (ej. en
Namecheap o GoDaddy), se conecta desde "Settings → Domains" en cada
proyecto de Vercel — puedes usar algo como `recosdiarias.com` para la
página y `app.recosdiarias.com` para la app.
