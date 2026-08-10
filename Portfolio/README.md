# Portfolio — Simón Rodríguez

Sitio web personal de fotografía y cine. HTML/CSS/JS puro, sin dependencias
ni proceso de build: se puede abrir `index.html` directamente en el
navegador o subir la carpeta a cualquier hosting estático (GitHub Pages,
Netlify, Vercel, etc.).

## Estructura

```
Portfolio/
├── index.html
├── css/style.css
├── js/main.js
├── assets/
│   ├── photos/   ← fotos de la galería
│   └── video/    ← el cortometraje (cortometraje.mp4)
└── README.md
```

## Cómo agregar las fotos

La galería tiene dos secciones: **Retratos** (fotos con personas) y
**Paisajes** (fotos sin personas).

1. Copia los archivos de imagen dentro de `assets/photos/` (ej. `01.jpg`,
   `02.jpg`, `retrato-maria.jpg`...).
2. Abre `js/main.js` y edita el arreglo correspondiente al inicio del
   archivo, agregando una línea por cada foto:

   ```js
   const photos = [
     { src: 'assets/photos/01.jpg', caption: 'Retrato, 2025' },
     { src: 'assets/photos/02.jpg', caption: '' },
   ];

   const landscapePhotos = [
     { src: 'assets/photos/06.jpg', caption: '' },
   ];
   ```

   El `caption` es opcional (aparece al pasar el mouse sobre la foto).
   El orden del arreglo es el orden en que se muestran.

## Cómo agregar el cortometraje

1. Copia el archivo de video a `assets/video/` con el nombre
   `cortometraje.mp4` (o cambia la ruta en `index.html`, sección
   `<video>`, si prefieres otro nombre).
2. Si quieres una imagen de portada antes de dar play, agrega el atributo
   `poster="assets/video/portada.jpg"` a la etiqueta `<video>`.

## Cómo agregar el número de contacto

Abre `js/main.js` y completa estas dos líneas:

```js
const whatsappNumber = '521234567890'; // solo dígitos, con código de país
const phoneDisplayText = '+52 123 456 7890'; // como se ve en la página
```

## Notas de diseño

- Tipografías: Cormorant Garamond (títulos) + Jost (texto), vía Google Fonts.
- Paleta oscura y elegante con acento dorado (`--accent` en `css/style.css`).
- Animaciones: revelado al hacer scroll, parallax suave en el hero,
  transiciones en la galería y el lightbox. Respeta
  `prefers-reduced-motion`.
