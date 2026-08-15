<div align="center">
  <img src="images/daviddevx-logo.webp" alt="DavidDevX" width="250">

  # Portafolio profesional de David Castillo

  Un portafolio web estático, responsive y accesible para presentar mi perfil, tecnologías y proyectos como desarrollador web.

  [Ver portafolio](https://daviddevxpe.github.io/) · [GitHub](https://github.com/DavidDevXPe) · [Contacto](mailto:hectordavidcastillobailon@gmail.com)
</div>

![Vista social del portafolio DavidDevX](images/og-image.png)

## Sobre el proyecto

Este sitio reúne mi trayectoria desde Ingeniería de Industrias Alimentarias hacia el desarrollo web. La interfaz utiliza la identidad visual DavidDevX y presenta proyectos reales mediante demos, repositorios y casos de estudio breves.

El portafolio está construido sin frameworks ni dependencias en producción. GitHub Pages sirve directamente los archivos HTML, CSS, JavaScript e imágenes optimizadas.

## Características

- Diseño responsive para escritorio, tablet y móvil.
- Navegación accesible con teclado y estados de foco visibles.
- Casos de estudio dentro de diálogos nativos.
- Imágenes WebP y recursos SVG optimizados.
- Metadatos Open Graph, Twitter Cards y datos estructurados Schema.org.
- Sitemap, reglas para buscadores y página 404 personalizada.
- Animaciones respetuosas con `prefers-reduced-motion`.
- Validación local sin dependencias externas.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- Git y GitHub Pages
- Node.js únicamente para las herramientas locales de desarrollo

## Proyectos destacados

| Proyecto | Descripción | Demo | Código |
| --- | --- | --- | --- |
| Pokédex App | Búsqueda, filtros y paginación utilizando PokeAPI. | [Abrir](https://pokedex-app-mu-livid.vercel.app/) | [Repositorio](https://github.com/DavidDevXPe/pokedex_app) |
| Rick and Morty App | Consulta de ubicaciones y residentes mediante la API de Rick and Morty. | [Abrir](https://rick-and-morty-app-phi-green.vercel.app/) | [Repositorio](https://github.com/DavidDevXPe/Rick-and-Morty---App) |
| Weather App | Información meteorológica basada en la ubicación del usuario. | [Abrir](https://weather-clima.vercel.app/) | [Repositorio](https://github.com/DavidDevXPe/App-Clima) |

## Estructura

```text
.
├── css/
│   └── styles.css
├── images/
├── js/
│   └── main.js
├── scripts/
│   ├── serve.mjs
│   └── validate-project.mjs
├── 404.html
├── index.html
├── robots.txt
└── sitemap.xml
```

## Desarrollo local

Se requiere Node.js 18 o superior. No es necesario instalar paquetes.

```bash
npm run dev
```

Después visita `http://127.0.0.1:4173`.

## Comprobaciones antes de publicar

```bash
npm run check
```

El comando comprueba la sintaxis de JavaScript, datos estructurados, URL canónica, sitemap, referencias locales, IDs duplicados y estructura básica del CSS.

## Despliegue

El sitio se publica desde la rama `main` mediante GitHub Pages. Cada cambio aprobado se despliega con:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

## Autor

**David Castillo — DavidDevX**

- GitHub: [@DavidDevXPe](https://github.com/DavidDevXPe)
- Correo: [hectordavidcastillobailon@gmail.com](mailto:hectordavidcastillobailon@gmail.com)
- Estado: disponible para empleo y proyectos freelance
