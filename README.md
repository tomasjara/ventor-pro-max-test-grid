# Ventor Pro Max - Test Grid

Proyecto de ejemplo que demuestra el uso de **Material React Table** con React y Vite. Incluye una tabla configurable con datos de ejemplo que muestra ventas, inventario y crecimiento por local y producto.

## 🚀 Características

- Tabla interactiva con **Material React Table**
- Formato de números con decimales, enteros y porcentajes
- Colores condicionales según valores
- Filtros y ordenamiento
- Configuración centralizada y personalizable
- Datos de ejemplo generados automáticamente

## 📋 Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**

## 🛠️ Instalación

1. **Clonar el repositorio** (si aplica):
   ```bash
   git clone <url-del-repositorio>
   cd ventor-pro-max-test-grid
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```
   o si usas yarn:
   ```bash
   yarn install
   ```
   
### Modo Desarrollo
```bash
npm run dev
```
o
```bash
yarn dev
```

## 📁 Estructura del Proyecto

```
ventor-pro-max-test-grid/
├── src/
│   └── MRT_example_basic.jsx  # Componente principal de la tabla
│   
├── public/                  
├── package.json             
└── vite.config.js           
```

## ⚙️ Configuración

El archivo `src/MRT_example_basic.jsx` contiene un objeto `CONFIG` que puedes modificar para personalizar:

- **Locales**: Lista de sucursales
- **Productos**: Lista de productos
- **Rangos de valores**: Mínimos y máximos para ventas, inventario y crecimiento
- **Colores**: Colores condicionales para cada tipo de dato
- **Umbrales**: Valores límite para aplicar colores

Ejemplo:
```javascript
const CONFIG = {
  locales: ['Sucursal Centro', 'Sucursal Norte', ...],
  productos: ['Producto A', 'Producto B', ...],
  venta: { min: 1000, max: 50000, decimales: 2 },
  // ... más configuración
};
```

## 📊 Columnas de la Tabla

- **Local**: Filtrable
- **Producto**: Filtrable
- **Venta**: Números con decimales, formato de moneda
- **Mes en Curso**: Mes actual automático
- **Inventario**: Números enteros (pueden ser negativos)
- **Crecimiento**: Porcentajes con decimales

## 🎨 Colores Condicionales

- **Venta**: Verde (alta), Naranja (media), Rojo (baja)
- **Inventario**: Azul (positivo), Naranja (negativo), Rojo (bajo)
- **Crecimiento**: Verde (positivo), Rojo (negativo), Gris (neutro)

## 📦 Dependencias Principales

- **React** ^19.2.0
- **Material React Table** ^3.2.1
- **Material-UI** ^6
- **Vite** (con rolldown)

## 📝 Notas

- Los datos se generan aleatoriamente al cargar la página
- El formato de números usa `Intl.NumberFormat` con locale `es-ES`
- La tabla incluye paginación (10 filas por página por defecto)

