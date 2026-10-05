# Panel Personal

Dashboard personal con React, Vite y Tailwind CSS. La integración con Google se gestiona desde un backend Express para que el secreto OAuth y los tokens no lleguen al navegador.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm
- Un proyecto de Google Cloud con Google Calendar API y Google Tasks API habilitadas

## Instalación

Desde la raíz del proyecto:

```bash
npm install
npm --prefix backend install
Copy-Item backend/.env.example backend/.env
```

Completa `backend/.env` con las credenciales OAuth. Ejecuta el backend y el frontend en terminales separadas:

```bash
npm run dev:backend
```

```bash
npm run dev
```

Abre http://localhost:5174. Vite reenvía `/api` y `/auth` a `http://localhost:3001`.

## Configurar Google Cloud

1. Crea o selecciona un proyecto en Google Cloud Console.
2. En **APIs y servicios > Biblioteca**, habilita **Google Calendar API** y **Google Tasks API**.
3. Configura la pantalla de consentimiento OAuth. Para uso personal en modo de prueba, añade tu cuenta Google como usuario de prueba.
4. En **Credenciales**, crea un **ID de cliente OAuth** de tipo **Aplicación web**.
5. Añade esta URI exacta en **URIs de redirección autorizados**: `http://localhost:3001/auth/google/callback`.
6. Si Google Console solicita un origen JavaScript autorizado, añade `http://localhost:5174`. El flujo OAuth lo ejecuta el backend.
7. Copia el ID y el secreto de cliente a `backend/.env`:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:5174
SESSION_SECRET=una-cadena-aleatoria-larga
PORT=3001
```

La URI configurada en Google debe coincidir exactamente con `GOOGLE_REDIRECT_URI`. No publiques el archivo `backend/.env`.

## Sincronización

- Al cargar la web se consultan los calendarios accesibles y todas las listas de Google Tasks. Los eventos recurrentes se expanden y las fechas se ordenan cronológicamente.
- Los cambios hechos fuera del panel aparecen al actualizar la página. Los cambios iniciados desde el panel se envían a Google y se vuelven a consultar.
- Las fechas de tareas se guardan como vencimientos de Google Tasks. Google Calendar muestra esas tareas en su vista de Tasks; no se crea un evento duplicado.
- Entregas, gastos, suscripciones y turnos mantienen la persistencia local existente. Eventos y tareas ya no se guardan en `localStorage`.
- Las sesiones OAuth usan el almacén en memoria de Express por simplicidad. En desarrollo, una sesión se conserva al actualizar la página mientras el backend siga ejecutándose; al reiniciar el backend tendrás que volver a conectar Google.

## Producción

```bash
npm run build
npm run preview
```

En producción configura `FRONTEND_URL`, `GOOGLE_REDIRECT_URI` y `SESSION_SECRET` para el dominio HTTPS real, registra la nueva URI exacta en Google Cloud y usa un almacén de sesiones persistente detrás de un proxy HTTPS.
