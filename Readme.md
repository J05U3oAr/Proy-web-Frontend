# 🎨 SeriesTracker — Frontend

Cliente web construido con **HTML + CSS + JavaScript vanilla**. Sin frameworks, sin librerías, sin jQuery. Consume la API REST del backend exclusivamente mediante `fetch()` nativo y manipula el DOM directamente.

---

## 🔗 Repositorios

| Repo | Link |
|------|------|
| 🎨 **Frontend (este repo)** | `https://github.com/J05U3oAr/Proy-web-Frontend` |
| 🖥️ **Backend** | `https://github.com/J05U3oAr/Proy-web-Backend` | 

---


## 🚀 Cómo correr localmente

> ⚠️ **Importante:** El backend debe estar corriendo en `http://localhost:8080` antes de abrir el frontend. Consulta el README del backend para levantarlo.

El frontend son archivos estáticos — no se puede abrir `index.html` directamente con `file://` porque el navegador bloquea las peticiones `fetch()` desde ese protocolo. Necesitas un servidor HTTP local. Hay varias opciones:

### Opción A — Python (recomendado, sin instalar nada extra)

```bash
# Clonar el repo
git clone https://github.com/J05U3oAr/Proy-web-Frontend
cd Proy-web-Frontend

# Levantar servidor local
python3 -m http.server 3000

# Abrir en el navegador:
# http://localhost:3000
```

### Opción B — Node.js

```bash
npx serve .
# o
npx http-server . -p 3000
```

### Opción C — VS Code Live Server

1. Instalar la extensión **Live Server** en VS Code
2. Clic derecho en `index.html` → **Open with Live Server**
3. Se abre automáticamente en el navegador

---

## 📁 Estructura del proyecto

```
frontend/
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   ├── app.js
│   └── ui.js
├── index.html
└── Readme.md
```

### Separación de responsabilidades

La arquitectura del JS está deliberadamente dividida en tres capas:

| Archivo | Responsabilidad | Sabe de HTML | Sabe de la API |
|---------|----------------|--------------|----------------|
| `api.js` | Fetch y comunicación HTTP | ❌ No | ✅ Sí |
| `ui.js` | Construcción y manipulación del DOM | ✅ Sí | ❌ No |
| `app.js` | Eventos, estado y orquestación | ✅ Sí | ✅ Sí |

---

## ✨ Funcionalidades

- **Listar series** en un grid responsivo con cards visuales
- **Crear serie** desde un modal con validación client-side y server-side
- **Editar serie** con el formulario precargado con los datos actuales
- **Eliminar serie** con modal de confirmación
- **Filtrar** por estado: Todas / Viendo / Completadas / Por ver / Abandonadas
- **Preview de imagen** en tiempo real al escribir la URL en el formulario
- **Estadísticas** en el hero: total de series, cuántas estás viendo, cuántas completadas
- **Toast notifications** para feedback de acciones (éxito, error, info)
- **Estado vacío** con mensaje y botón cuando no hay series
- **Estado de carga** con spinner mientras se obtienen los datos
- **Diseño responsivo** que funciona en móvil y desktop

---

## 🌐 CORS

CORS *(Cross-Origin Resource Sharing)* es una política de seguridad del navegador que bloquea las peticiones `fetch()` hacia un servidor en un origen distinto (diferente puerto o dominio); el backend lo configura explícitamente para permitir estas llamadas.

Como el frontend corre en `:3000` y el backend en `:8080`, sin CORS el navegador bloquearía todas las peticiones. El backend tiene configurado `Access-Control-Allow-Origin: *` para permitir cualquier origen durante desarrollo.

---

## 🏆 Challenges implementados

- ✅ **Calidad visual del cliente (0–30 pts)**
  - Diseño editorial con paleta pink/cream y tipografía Playfair Display
  - Animaciones CSS: cards con entrada escalonada, spinner, toasts, modal con spring animation
  - Estados de carga y estado vacío trabajados
  - Totalmente responsivo para móvil y desktop
  - Micro-interacciones en hover y focus

- ✅ **Organización del código (0–20 pts)**
  - Separación clara en tres archivos JS con responsabilidades únicas
  - `api.js` no toca el DOM, `ui.js` no hace fetch — cada archivo tiene una sola razón para cambiar

- ✅ **Códigos HTTP correctos (20 pts)**
  - El cliente distingue y reacciona diferente ante `200`, `201`, `204`, `400` y `404`
  - Al recibir `201` agrega la nueva serie al estado local sin recargar
  - Al recibir `204` elimina la serie del estado local sin recargar
  - Al recibir `400` con `fields`, muestra errores inline en el formulario

---

---

## 💭 Reflexión

Construir el cliente sin ningún framework fue un ejercicio que parece limitante al principio, pero resultó ser enormemente educativo. Manejar el DOM directamente te obliga a entender exactamente qué hace React o Vue por detrás — el manejo de estado, la actualización del UI, la delegación de eventos.

La separación en `api.js`, `ui.js` y `app.js` fue la mejor decisión del proyecto. Al principio parece burocrática, pero cuando necesitas cambiar algo solo tienes que abrir un archivo — si el endpoint cambia, tocas `api.js`; si cambia el diseño de una card, tocas `ui.js`. Cada archivo tiene una sola razón para cambiar, y eso hace el código sorprendentemente mantenible para ser vanilla JS.

Lo más difícil fue manejar el estado local (`allSeries`) de forma consistente con lo que hay en el servidor. Con un framework esto se resuelve con herramientas de estado reactivo; sin framework toca hacerlo manualmente y es fácil que se desincronice si no eres cuidadoso.

**¿Lo usaría de nuevo?** Para proyectos pequeños o de aprendizaje, definitivamente sí — te da un entendimiento profundo de cómo funciona la web. Para algo más grande o con un equipo, preferiría un framework que resuelva el manejo de estado de forma más robusta.
