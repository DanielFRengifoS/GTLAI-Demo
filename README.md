# GTL AI — Reusable Cover Template

Portada independiente, neutral y reutilizable. Conserva la identidad GTL AI mediante el nuevo emblema superior izquierdo, la animación completa del logo de apertura, la transición y el selector de tres opciones. No contiene nombres, fotografías ni referencias del cliente anterior.

## Estructura

```text
GTL-AI-Cover-Template/
├── index.html                         # Portada + selector de opciones
├── welcome.css                        # Estilos, fades y movimiento del arco
├── welcome.js                         # Animación, carrusel y navegación
├── assets/
│   ├── gtl-ai-brand-mark.png         # Emblema GTL AI superior izquierdo
│   ├── gtl-ai-logo-intro.mp4          # Animación GTL AI original, completa
│   ├── gtl-ai-logo-poster.webp        # Fallback estático del logo
│   ├── hero-01-placeholder.svg        # Hero de la opción 01 (reemplazable)
│   ├── hero-02-placeholder.svg        # Hero de la opción 02 (reemplazable)
│   └── hero-03-placeholder.svg        # Hero de la opción 03 (reemplazable)
└── demos/
    ├── 01/index.html                  # Placeholder reemplazable
    ├── 02/index.html                  # Placeholder reemplazable
    └── 03/index.html                  # Placeholder reemplazable
```

## Personalización obligatoria

Busca los textos entre corchetes en `index.html` y sustitúyelos:

| Placeholder | Qué colocar |
|---|---|
| `[NOMBRE DEL PROYECTO]` | Nombre del proyecto. Está dividido en dos líneas para conservar la composición; puedes editar ambas líneas o eliminar el `<br>`. |
| `[TIPO DE PROPUESTA]` | Ej. PORTAFOLIO DIGITAL, EXPERIENCIA WEB, PROPUESTA DE MARCA. |
| `[DESCRIPCIÓN BREVE DE LA PROPUESTA...]` | Una frase corta, idealmente de una o dos líneas. |
| `[NOMBRE DEL CLIENTE]` | Nombre de la persona, marca o empresa que recibe la propuesta. |
| `[CIUDAD · PAÍS]` | Ubicación del cliente o del proyecto. |

El texto **Presentación privada** es genérico y puede permanecer. El emblema GTL AI superior izquierdo está en `assets/gtl-ai-brand-mark.png`; puedes sustituir ese archivo por otra versión manteniendo el mismo nombre, o cambiar el `src` de `.brand-mark` en `index.html`.

## Reemplazar las tres hero images

La imagen circular del centro rota automáticamente entre tres imágenes, una por cada demo.

1. Sustituye `assets/hero-01-placeholder.svg` por la imagen hero de la opción 01.
2. Sustituye `assets/hero-02-placeholder.svg` por la imagen hero de la opción 02.
3. Sustituye `assets/hero-03-placeholder.svg` por la imagen hero de la opción 03.
4. Si usas otro formato o nombre (por ejemplo `.webp` o `.jpg`), actualiza el `src` de la imagen correspondiente en `index.html`, conservando el atributo `data-hero-slide`.

Usa imágenes horizontales o cuadradas de buena resolución; el contenedor las recorta en círculo con `object-fit: cover`. Para que la composición funcione bien, el sujeto principal debe quedar cerca del centro.

### Comportamiento del carrusel

- Cambia de imagen cada **1,5 segundos**.
- Usa fade-out/fade-in superpuesto, sin dejar un fotograma vacío.
- El arco verde de la esquina superior derecha gira **120° por cambio**; tras tres cambios completa una vuelta.
- Los indicadores `01 / 02 / 03` resaltan la imagen activa.
- Se pausa cuando la pestaña no está visible y al abrir una demo.
- Se desactiva automáticamente si el visitante tiene activado `prefers-reduced-motion`.

Para ajustar la velocidad, cambia `HERO_INTERVAL_MS` en `welcome.js` (valor en milisegundos). Para ajustar la duración del fade y del giro, modifica las transiciones de `.hero-slide` y `.orbit-trace` en `welcome.css`. El ángulo de cada giro está definido por `orbitRotation += 120` en `welcome.js`.

## Integrar las tres demos

Reemplaza el contenido de estos archivos por los HTML finales de cada opción:

- `demos/01/index.html`
- `demos/02/index.html`
- `demos/03/index.html`

Conserva dentro de cada carpeta los assets y archivos JS/CSS que requiera esa opción. Revisa las rutas relativas si el HTML final depende de carpetas externas. No reemplaces el `index.html` de la raíz: ese archivo es la portada.

Los botones superiores conservan los números 01, 02 y 03. Si quieres nombres más descriptivos, edita el texto visible y los atributos `aria-label` de los botones `tab-01`, `tab-02` y `tab-03` en el `index.html` raíz.

## Ajustar la identidad visual

En las primeras líneas de `welcome.css` puedes cambiar los cuatro colores principales:

```css
--night: #090a0f;  /* fondo */
--mint: #85efd0;   /* acento y CTA */
--ice: #edf5f2;    /* texto principal */
--quiet: #a7b7b3;  /* texto secundario */
```

El video y el poster de GTL AI son independientes del cliente. El MP4 se conserva completo, sin recortes ni re-encode. La cámara CSS comienza en 1.22× y hace un push-in hasta 2.05× cuando el símbolo se reduce para dar paso al wordmark GTL AI; el movimiento se sincroniza con la reproducción y se pausa si el video se pausa. Si necesitas una portada sin el video, elimina el bloque `.portal-mark` del HTML y sus estilos asociados.

## Probar localmente

Desde esta carpeta ejecuta:

```bash
python3 -m http.server 8765
```

Abre `http://localhost:8765/`. Usa un servidor local en lugar de abrir el archivo directamente para que el comportamiento de los iframes sea consistente.

## Desplegar

Sube el contenido completo de esta carpeta a un hosting estático como Cloudflare Pages. No requiere build, npm, backend ni variables de entorno.

## Notas

- La portada y el selector son independientes del contenido de las tres demos.
- El enlace principal abre la opción 01 con una transición circular cinematográfica.
- Los botones permiten cambiar entre las tres opciones sin abandonar la portada desplegada.
- Se respeta `prefers-reduced-motion` para usuarios que desactivan animaciones.
- Los archivos de `demos/` son placeholders de muestra, no demos de cliente.
