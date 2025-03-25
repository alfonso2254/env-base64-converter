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

Para ver la herramienta en acción, visita [la demo online]([#](https://env-base64-converter.vercel.app/) (próximamente).

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
```
APP_ENV=local
APP_KEY="complex+key/with/special=chars"
DEBUG=true
```

Ejemplo de salida (Base64):
```
APP_ENV:bG9jYWw=
APP_KEY:Y29tcGxleCtrZXkvd2l0aC9zcGVjaWFsPWNoYXJz
DEBUG:dHJ1ZQ==
```

### Decodificar Base64 a archivo .env

1. Navega a la pestaña "Decodificar Base64 a .env"
2. Ingresa el contenido en formato KEY:base64value de alguna de estas formas:
   - Pega directamente en el campo de texto
   - Haz clic en "Cargar archivo" para seleccionar un archivo
   - Arrastra y suelta un archivo sobre la zona demarcada
   - Haz clic en "Ejemplo" para cargar datos de ejemplo
3. Presiona el botón "Convertir" o usa el atajo Ctrl+Enter
4. El contenido decodificado aparecerá en el panel de la derecha
5. Usa los botones para copiar al portapapeles o descargar como archivo .env

### Atajos de teclado

- **Ctrl+Enter**: Convierte el contenido actual
- **Ctrl+S**: Descarga el resultado actual (ya sea .env o formato Base64)
- **Tab**: Inserta espacios en lugar de cambiar el foco (en áreas de texto)

## ¿Por qué usar esta herramienta?

- **Seguridad**: Todo se procesa localmente en tu navegador, sin enviar datos a ningún servidor externo
- **Velocidad**: Procesamiento instantáneo sin necesidad de conexión a internet
- **Confiabilidad**: Maneja correctamente casos especiales como variables con espacios, comillas, y caracteres especiales
- **Versatilidad**: Perfecta para equipos DevOps, desarrolladores y para entornos CI/CD

## Casos de uso comunes

- **Configuración segura**: Almacenar variables de configuración sensibles en sistemas CI/CD
- **Transferencia segura**: Compartir configuraciones con el equipo sin exponer valores sensibles
- **Almacenamiento**: Guardar variables de entorno en un formato seguro y compacto
- **Automatización**: Integrar con scripts para automatizar la configuración de entornos

## Tecnologías

- [Vue.js 3](https://vuejs.org/) - Framework progresivo para construir interfaces de usuario
- [Vite](https://vitejs.dev/) - Herramienta de compilación y desarrollo
- [PrimeVue](https://www.primefaces.org/primevue/) - Biblioteca de componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitario

## Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Sube tus cambios a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

[MIT](LICENSE)

## Autor

Desarrollado por [Alfonso Alarcón](https://github.com/alfonso2254)

---

<p align="center">
  ¿Te gusta esta herramienta? ⭐ ¡Dale una estrella al repositorio para apoyar el proyecto!
</p>
