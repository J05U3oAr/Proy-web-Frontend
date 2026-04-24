# SeriesTracker Frontend

Cliente web hecho con HTML, CSS y JavaScript vanilla.

## Correr localmente

Primero levanta el backend en `http://localhost:8080`.

Luego sirve el frontend con cualquier servidor estático. Ejemplo con Python:

```bash
cd frontend
python -m http.server 3000
```

Abre `http://localhost:3000`.

## Configuración de API

El frontend usa [config.js](/c:/Users/chaar/OneDrive/Desktop/Archivos%20UVG/Semestre%205/Web/Proyecto1/frontend/js/config.js) para definir la URL base del backend:

```js
window.APP_CONFIG = {
  API_BASE_URL: 'http://localhost:8080',
};
```

En producción esa URL se reemplaza durante el build de Vercel.

## Despliegue en Vercel

Este proyecto ya quedó preparado con:

- [vercel.json](/c:/Users/chaar/OneDrive/Desktop/Archivos%20UVG/Semestre%205/Web/Proyecto1/vercel.json)
- [build.mjs](/c:/Users/chaar/OneDrive/Desktop/Archivos%20UVG/Semestre%205/Web/Proyecto1/frontend/scripts/build.mjs)

Variable de entorno requerida:

```env
API_BASE_URL=https://tu-backend.up.railway.app
```

Pasos:

1. Sube el proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Mantén como raíz la carpeta del repo.
4. Agrega `API_BASE_URL` con la URL pública del backend en Railway.
5. Despliega.

El build genera `frontend/dist` y deja el frontend apuntando al backend desplegado.
