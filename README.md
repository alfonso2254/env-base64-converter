# Convertidor de Variables de Entorno y Base64

<p align="center">
  <img src="./public/env-base64-banner.png" alt="ENV Base64 Converter" width="600">
</p>

<p align="center">
  Una herramienta web moderna para codificar y decodificar archivos .env a formato Base64
</p>

<p align="center">
  <a href="#características">Características</a> •
  <a href="#demostración">Demostración</a> •
  <a href="#instalación">Instalación</a> •
  <a href="#uso">Uso</a> •
  <a href="#tecnologías">Tecnologías</a> •
  <a href="#licencia">Licencia</a>
</p>

## Características

- ✨ **Interfaz intuitiva** - Diseño limpio y fácil de usar
- 🔄 **Bidireccional** - Convierte de .env a Base64 y viceversa
- 📂 **Soporte para drag & drop** - Arrastra y suelta tus archivos
- 📋 **Copiado rápido** - Copia los resultados al portapapeles con un clic
- 💾 **Descarga directa** - Guarda los archivos resultantes en tu equipo
- 🧩 **Ejemplos integrados** - Prueba la herramienta con datos de ejemplo
- ⌨️ **Atajos de teclado** - Mayor productividad con atajos como Ctrl+Enter
- 📊 **Estadísticas en tiempo real** - Visualiza el número de variables y líneas
- 📱 **Totalmente responsiva** - Funciona en dispositivos móviles y de escritorio

## Demostración

Para ver la herramienta en acción, visita [la demo online](#) (próximamente).

![Captura de pantalla de la aplicación](./public/screenshot.png)

## Instalación

### Requisitos previos
- Node.js (v16.0 o superior)
- npm o yarn

### Pasos de instalación

1. Clona el repositorio:
```bash
git clone https://github.com/alfonso2254/env-base64-converter.git
cd env-base64-converter
```

2. Instala las dependencias:
```bash
npm install
# o con yarn
yarn install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
# o con yarn
yarn dev
```

4. Abre tu navegador en `http://localhost:5173`

### Compilación para producción

```bash
npm run build
# o con yarn
yarn build
```

Los archivos compilados se guardarán en la carpeta `dist/`.

## Uso

### Codificar archivo .env a Base64

1. Navega a la pestaña "Codificar .env a Base64"
2. Ingresa el contenido del archivo .env de alguna de estas formas:
   - Pega directamente en el campo de texto
   - Haz clic en "Cargar archivo .env" para seleccionar un archivo
   - Arrastra y suelta un archivo .env sobre la zona demarcada
   - Haz clic en "Ejemplo" para cargar datos de ejemplo
3. Presiona el botón "Convertir" o usa el atajo Ctrl+Enter
4. El resultado aparecerá en el panel de la derecha
5. Usa los botones para copiar al portapapeles o descargar el resultado

Ejemplo de entrada (.env):
