# SISTEMA DE GESTION DE INVENTARIO INTELIGENTE PARA COMERCIOS

Este proyecto es una aplicación web con un backend en **Node.js (Express)** y un frontend en **React**. A continuación, se detallan los pasos para instalar y ejecutar el entorno completo en tu máquina local.

---

## Estructura del repositorio

/backend # API REST con Node.js y Express

GESTION-INVENTARIO/
└── backend/
    ├── config/                    # Configuraciones generales (conexión a BD)
    ├── controllers/               # Lógica de controladores para manejar rutas y lógica de negocio
    ├── middlewares/               # Middlewares personalizados (autenticación, validaciones)
    ├── models/                    # Definiciones de modelos 
    ├── routes/                    # Archivos de rutas organizados por recurso (ventas, productos, etc.)
    ├── node_modules/              # Módulos de Node instalados 
    ├── .env                       # Variables de entorno 
    ├── app.js                     # Configura la app Express 
    ├── server.js                  # Punto de entrada principal del servidor
    ├── package.json               # Dependencias y scripts del backend
    └── package-lock.json          # Archivo generado automáticamente con versión exacta de paquetes


/frontend # Interfaz de usuario hecha con React

GESTION-INVENTARIO/
└── frontend/
	├── node_modules/                 # Módulos de dependencias 
	├── public/                       # Archivos estáticos públicos 
	├── src/                          # Carpeta principal del código fuente
	│   ├── assets/                   # Imágenes, íconos, estilos u otros recursos estáticos
	│   ├── context/                  # Context API: estado global de React 
	│   ├── pages/                    # Vistas organizadas por entidades
	│   │   ├── Clientes/
	│   │   ├── Compras/
	│   │   ├── Inventario/
	│   │   ├── Perdidas/
	│   │   ├── Productos/
	│   │   ├── Promociones/
	│   │   ├── Proveedores/
	│   │   ├── Usuarios/
	│   │   └── Ventas/
	│   ├── Grafico.jsx              # Componente para mostrar gráficos
	│   ├── Home.jsx                 # Página principal (dashboard)
	│   ├── Login.jsx                # Página de login
	│   ├── Plantilla.css            # Estilos comunes
	│   ├── Plantilla.jsx            # Componente layout general de la app
	│   ├── RecuperarContrasena.jsx  # Pantalla para recuperación de contraseña
	│   ├── services/                # Funsiones comunes
	│   │   ├── api.js               # Variable de VITE
	│   ├── App.jsx                  # Componente raíz: contiene rutas y layout general
	│   ├── App.css                  # Estilos generales de la app
	│   └── main.jsx                 # Punto de entrada para React (renderiza `<App />`)
	├── .env                         # Variables de entorno 
	├── .gitignore                   # Ignora archivos y carpetas para Git
	├── eslint.config.js             # Configuración de ESLint
	├── index.html                   # Archivo HTML base usado por Vite
	├── package.json                 # Configuración y dependencias del frontend
	├── package-lock.json            # Versionado exacto de dependencias
	├── vite.config.js               # Configuración de Vite
	├── gestion-inventario postgresql.sql  # Script SQL para la base de datos
	└── README.md                    # Documentación principal del proyecto

---

## Requisitos previos

- Node.js (versión recomendada: >= 18)
- Git
- npm 
- PostgreSQL

---

## Instalación paso a paso

### 1. Clonar el repositorio

git clone https://github.com/cmmurgo/gestion-inventario.git
cd gestion-inventario

2. Instalar dependencias del backend

cd backend
npm install

3. Crear archivo .env para el backend
Crea un archivo .env dentro de la carpeta backend/ con el siguiente contenido (ajustar según configuración):

PORT=3001
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gestion-inventario
JWT_SECRET=a_elecion
NODE_ENV=development
EMAIL_USER= <<un_email@gmail.com>>
EMAIL_PASSWORD= <<clave del correo>>

4. Iniciar el backend

npm start

El servidor se ejecutará en http://localhost:3001 o el puerto que definas.

5. Instalar dependencias del frontend
En una nueva terminal:

cd frontend
npm install

6. Crear archivo .env para el frontend
Crea un archivo .env dentro de frontend/:

VITE_API_URL=http://localhost:3001

7. Iniciar el frontend

npm run dev 

El frontend se ejecutará en http://localhost:5173 

Autores
	Grupo 5: 
		Daniel Riveros Cabibbo
		Corina Días Correia
		Fernando Paez Zanini
		Marcelo Murgo
