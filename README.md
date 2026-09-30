# Portafolio — Jeyner Jarquín

Sitio de una sola página para captar clientes: sitios web, sistemas de gestión,
APIs y aplicaciones de escritorio.

**No necesita build.** No hay `npm install`, ni framework, ni paso de compilación.
Son archivos estáticos: editas, guardas, haces `git push` y el sitio queda
actualizado.

- URL principal: `https://jeyner-jarquin.github.io/portafolio/`
- Espejo en Render: se actualiza con el mismo `push`
- Todos los botones de contacto abren WhatsApp: `+505 5718 3200`

---

## Estructura

```
.
├── index.html                  Todo el contenido. Ahí se edita cada texto.
├── css/styles.css              Colores, tipografía, diseño y responsive.
├── js/main.js                  Menú, scroll-spy, animaciones, FAQ, formulario.
├── assets/
│   ├── favicon.svg             Icono de la pestaña (monograma JJ).
│   ├── jeyner.jpg              Tu foto. 640 x 843 px, ~40 KB.
│   └── og-image.png            Imagen que se ve al compartir el enlace.
├── robots.txt                  Le dice a Google qué indexar.
├── sitemap.xml                 La dirección del sitio, para buscadores.
├── 404.html                    Página de enlace roto.
├── .nojekyll                   Necesario para GitHub Pages.
├── .htmlvalidate.json          Reglas de validación del HTML.
└── .github/workflows/deploy.yml  Verifica y publica automáticamente.
```

---

## Cómo editar el contenido

Todo el texto visible está en `index.html`. Los puntos que más vas a tocar:

| Quiero cambiar... | Dónde |
|---|---|
| Título o meta descripción (lo que sale en Google) | `<title>` y `<meta name="description">`, al inicio de `<head>` |
| Textos de las secciones | Busca el `<h2>` o `<p>` correspondiente |
| Datos de contacto (WhatsApp, correo, redes) | Busca `57183200` y `jeinercristopher@gmail.com` |
| Texto que recibe el cliente en WhatsApp | Los `href` que empiezan con `https://wa.me/` |
| Colores y estilo | Las variables al inicio de `css/styles.css` |
| Qué proyectos se muestran | Los `<article class="project">` en la sección `#proyectos` |

**Truco:** los enlaces de WhatsApp llevan el mensaje ya escrito y codificado.
Si agregas uno nuevo, el texto va después de `text=` con los espacios como `%20`.
La forma fácil: escribe el mensaje normal en un codificador de URL y pégalo.

### Cambiar la foto

Reemplaza `assets/jeyner.jpg` manteniendo un peso bajo (menos de 200 KB) y una
proporción parecida a 4:5 vertical. En `index.html` actualiza los atributos
`width` y `height` de la imagen para que coincidan con los reales.

---

## Publicar en GitHub Pages (URL principal)

### 1. Subir el código

Crea un repositorio en GitHub llamado `portafolio`, **público** (Pages gratuito
solo funciona con repositorios públicos).

```bash
git remote add origin https://github.com/Jeyner-Jarquin/portafolio.git
git branch -M main
git push -u origin main
```

### 2. Activar Pages con GitHub Actions

En el repositorio: **Settings ▸ Pages ▸ Build and deployment ▸ Source**.

Elige **GitHub Actions**. No elijas "Deploy from a branch": si dejas ambos activos
se publicarían dos veces.

Eso es todo. A partir de aquí, cada `git push` a `main` pasa la verificación y
publica solo. El sitio queda en `https://Jeyner-Jarquin.github.io/portafolio/`
en unos dos minutos.

Si prefieres el método clásico (sin el workflow), pon Source en
"Deploy from a branch", rama `main`, carpeta `/ (root)`, y **desactiva el
workflow** borrando `.github/workflows/deploy.yml`.

---

## Publicar en Render (espejo)

Render es opcional: sirve el mismo sitio en un dominio de Render. Se actualiza
solo, así que úsalo como copia de seguridad o como segunda dirección.

1. En Render: **New ▸ Static Site** y conecta el repositorio `portafolio`.
2. Deja el **Build Command completamente vacío** (no es un proyecto con build).
3. En **Publish Directory** escribe `.`
4. Deja el plan **Free** y crea el sitio.

Para que el workflow de GitHub Actions le avise a Render que se actualice:

1. En Render: tu sitio ▸ **Settings ▸ Deploy Hook** ▸ copia la URL.
2. En GitHub: **Settings ▸ Secrets and variables ▸ Actions ▸ New repository
   secret**, nombre `RENDER_DEPLOY_HOOK`, valor la URL copiada.

Si no creas el secreto, el sitio de Render simplemente no se actualiza y el
workflow sigue publicando en Pages sin dar error.

> No pongas este sitio detrás de un *Web Service* gratis de Render: se duerme a
> los 15 minutos y mientras está dormido responde a `robots.txt` con "bloquear
> todo", lo que rompería la indexación del sitio.

---

## Respaldo de los contactos por correo (Formspree, opcional)

El formulario siempre abre WhatsApp, que es donde se cierra la venta. Con
Formspree además recibes una copia de cada mensaje en tu correo.

1. Crea una cuenta gratis en [formspree.io](https://formspree.io) y un formulario
   nuevo.
2. Abre `js/main.js` y pon el ID que te den en la línea 5:

   ```js
   var LEAD_FORM_ENDPOINT = "https://formspree.io/f/TU_ID_AQUI";
   ```

Mientras esa línea esté vacía, el sitio funciona igual y solo omite el envío por
correo. No hay nada más que configurar.

---

## Verificar antes de publicar (opcional, en tu computadora)

```bash
npx --yes html-validate@9 index.html 404.html
```

Si no reporta nada, el HTML está bien. Esto mismo es lo que corre el workflow
antes de publicar, junto con una revisión de que los archivos y las anclas
internas existan.

---

## Nota sobre el despliegue automático

Un sitio estático sin build se publica solo con cada `push`, tanto en GitHub
Pages como en Render. El workflow de este repositorio no publica por sí solo:
primero **verifica** el HTML, los archivos y los enlaces internos, y solo si todo
está correcto publica. Así, si un cambio rompe algo, el sitio anterior sigue
en línea en lugar de dejarte un error visible para un cliente.