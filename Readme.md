# SeriesTracker — Frontend

Cliente web para gestionar una colección de series. Construido con **HTML, CSS y JavaScript vanilla** únicamente — sin frameworks, sin librerías externas, sin jQuery. Consume la API REST del backend usando `fetch()` nativo.

![alt text](./Imagenes/image.png)

> 🔗 Repositorio del backend: [Proy-web-Backend](https://github.com/J05U3oAr/Proy-web-Backend)
> 🌐 App en producción: [proy-web-frontend.vercel.app](https://proy-web-frontend.vercel.app)

---

## Tecnologías

- HTML5
- CSS3 (variables CSS, grid, flexbox)
- JavaScript vanilla — solo `fetch()` y el DOM
- Fuente: [Geist Mono](https://fonts.google.com/specimen/Geist+Mono) vía Google Fonts

---

## Correr localmente

Primero asegúrate de tener el backend corriendo en `http://localhost:8080`.

Luego sirve el frontend con cualquier servidor estático. Ejemplo con Python:

```bash
cd frontend
python -m http.server 3000
```

Abre `http://localhost:3000` en tu navegador.

### Configuración de la URL del backend

En producción la URL apunta a: `https://web-production-42b2c.up.railway.app`

```js
window.APP_CONFIG = {
  API_BASE_URL: 'http://localhost:8080',
};
```

---

## Estructura del proyecto

```
frontend/
├── index.html
├── css/
│   └── style.css         # Estilos globales, variables, componentes
├── js/
│   ├── config.js         # URL base del backend (reemplazada en build)
│   ├── api.js            # Toda la comunicación con la API REST
│   ├── ui.js             # Renderizado de componentes y DOM
│   └── app.js            # Orquestación: conecta eventos con API
└── scripts/
    └── build.mjs         # Script de build para Vercel
```

Cada archivo tiene una responsabilidad clara:
- **`api.js`** — solo sabe de `fetch()` y JSON, nada de HTML
- **`ui.js`** — solo sabe de DOM, nada de red
- **`app.js`** — conecta ambos, maneja el estado local

---

## Funcionalidades

- 📋 Listar todas las series con filtros por estado
- ➕ Crear series con título, género, estado, episodios, descripción e imagen
- ✏️ Editar cualquier serie existente
- 🗑️ Eliminar con modal de confirmación
- 🖼️ Preview de imagen en tiempo real al ingresar URL
- 📊 Estadísticas en el header (total, viendo, completadas)
- 🔔 Notificaciones toast para feedback de acciones

---

## Despliegue en Vercel

El proyecto incluye un `vercel.json` en la raíz y un script de build que reemplaza la URL del backend automáticamente.

### Pasos

1. Sube el frontend a un repositorio de GitHub.
2. Importa el repositorio en [Vercel](https://vercel.com).
3. Mantén el **Root Directory** en la raíz del repo.
4. Agrega la variable de entorno:
   ```
   API_BASE_URL=https://web-production-42b2c.up.railway.app
   ```
5. Despliega. Vercel ejecutará `node frontend/scripts/build.mjs` y servirá `frontend/dist`.

### `vercel.json`

```json
{
  "buildCommand": "node frontend/scripts/build.mjs",
  "outputDirectory": "frontend/dist",
  "installCommand": "echo 'skip'",
  "framework": null
}
```

---

## CORS

El frontend corre en un dominio distinto al backend (Vercel vs Railway). Por eso el backend debe incluir los headers CORS apropiados. Desde el frontend no se requiere configuración adicional: `fetch()` los maneja automáticamente.

---

## Challenges implementados

- ✅ Calidad visual del cliente — diseño minimalista con sistema de diseño propio (variables CSS, tipografía mono, paleta oscura)
- ✅ Organización del código — archivos separados con responsabilidades claras (`api.js`, `ui.js`, `app.js`)

---

## Reflexión

Trabajar con JavaScript vanilla fue un ejercicio muy valioso. Al no tener frameworks como React, cada decisión de arquitectura — cómo separar la lógica de red del DOM, cómo manejar el estado local, cómo estructurar los módulos — tuvo que tomarse conscientemente. Lo usaríamos de nuevo para proyectos pequeños o como base educativa; para proyectos más grandes, un framework facilita el mantenimiento a largo plazo.