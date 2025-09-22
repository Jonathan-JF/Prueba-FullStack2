# Copilot Instructions for Prueba-FullStack2

## Arquitectura General
- Proyecto estático front-end: HTML, CSS y JavaScript puro.
- Estructura principal:
  - `assets/index.html`: punto de entrada de la aplicación.
  - `assets/css/sytles.css`: estilos globales.
  - `assets/js/main.js`: lógica principal de la aplicación.

## Flujos de trabajo críticos
- No hay sistema de build ni dependencias externas; los archivos se editan y se visualizan directamente en el navegador.
- Para probar cambios, abrir `assets/index.html` en el navegador.
- No existen scripts de test ni automatización; las pruebas son manuales.

## Convenciones y patrones específicos
- Todo el código JavaScript reside en `main.js`.
- Los estilos deben ir en `sytles.css` (nota: el nombre del archivo tiene un error tipográfico, debería ser `styles.css`).
- Mantener la estructura de carpetas bajo `assets/`.
- No hay frameworks ni módulos; usar solo sintaxis estándar de JS y CSS.
- Los recursos estáticos (imágenes, fuentes) deben agregarse en subcarpetas dentro de `assets/` si se requieren.

## Integraciones y dependencias
- No hay dependencias externas ni integración con backend.
- No se utiliza ningún gestor de paquetes.

## Ejemplo de patrón
- Para agregar una nueva funcionalidad JS:
  1. Editar `assets/js/main.js`.
  2. Asegurarse de que el código se ejecute al cargar el DOM (por ejemplo, usando `window.onload`).
- Para modificar estilos:
  1. Editar `assets/css/sytles.css`.
  2. Referenciar las clases/IDs en el HTML.

## Archivos clave
- `assets/index.html`: estructura y contenido principal.
- `assets/css/sytles.css`: estilos globales.
- `assets/js/main.js`: lógica JS.

---

Si agregas nuevas convenciones, documenta aquí. Si alguna sección es poco clara o falta información, solicita detalles al usuario.