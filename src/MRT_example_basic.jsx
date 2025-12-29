import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';


const CONFIG = {
    meses: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    locales: ['Sucursal Centro', 'Sucursal Norte', 'Sucursal Sur', 'Sucursal Este', 'Sucursal Oeste'],
    productos: ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'],
    venta: { min: 1000, max: 50000, decimales: 2 },
    inventario: { min: -50, max: 500 },
    crecimiento: { min: -25, max: 50, decimales: 2 },
    colores: {
      crecimiento: {
        positivo: '#10b981',
        negativo: '#ef4444', 
        neutro: '#6b7280',   
      },
      inventario: {
        positivo: '#3b82f6',
        negativo: '#f59e0b', 
        bajo: '#ef4444',     
      },
      venta: {
        alto: '#10b981',     
        medio: '#f59e0b',    
        bajo: '#ef4444',      
      },
    },
    umbrales: {
      ventaAlta: 30000,
      ventaBaja: 10000,
      inventarioBajo: 20,
    },
};
  
const obtenerMesActual = () => {
const mesActual = new Date().getMonth();
return CONFIG.meses[mesActual];
};

const randomDecimal = (min, max, decimales = 2) => {
return Number((Math.random() * (max - min) + min).toFixed(decimales));
};

const randomInt = (min, max) => {
return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generarDatosEjemplo = () => {
const datos = [];
CONFIG.locales.forEach((local) => {
    CONFIG.productos.forEach((producto) => {
    const venta = randomDecimal(
        CONFIG.venta.min,
        CONFIG.venta.max,
        CONFIG.venta.decimales
    );
    const inventario = randomInt(CONFIG.inventario.min, CONFIG.inventario.max);
    const crecimiento = randomDecimal(
        CONFIG.crecimiento.min,
        CONFIG.crecimiento.max,
        CONFIG.crecimiento.decimales
    );

    datos.push({
        local,
        producto,
        venta,
        mes: obtenerMesActual(),
        inventario,
        crecimiento,
    });
    });
});
return datos;
};

export const MRT_example_basic = () => {
  const [data] = useState(() => generarDatosEjemplo());

  const columns = useMemo(
    () => [
      {
        accessorKey: 'local',
        header: 'Local',
        size: 180,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'producto',
        header: 'Producto',
        size: 150,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'venta',
        header: 'Venta',
        size: 130,
        Cell: ({ cell }) => {
          const valor = cell.getValue();
          const formateado = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: CONFIG.venta.decimales,
            maximumFractionDigits: CONFIG.venta.decimales,
          }).format(valor);
          
          let color = CONFIG.colores.venta.bajo;
          if (valor >= CONFIG.umbrales.ventaAlta) {
            color = CONFIG.colores.venta.alto;
          } else if (valor >= CONFIG.umbrales.ventaBaja) {
            color = CONFIG.colores.venta.medio;
          }
          
          return (
            <span style={{ color, fontWeight: 'bold' }}>
              ${formateado}
            </span>
          );
        },
      },
      {
        accessorKey: 'mes',
        header: 'Mes en Curso',
        size: 140,
      },
      {
        accessorKey: 'inventario',
        header: 'Inventario',
        size: 130,
        Cell: ({ cell }) => {
          const valor = cell.getValue();
          const formateado = new Intl.NumberFormat('es-ES').format(valor);
          
          let color = CONFIG.colores.inventario.positivo;
          if (valor < 0) {
            color = CONFIG.colores.inventario.negativo;
          } else if (valor < CONFIG.umbrales.inventarioBajo) {
            color = CONFIG.colores.inventario.bajo;
          }
          
          return (
            <span style={{ color, fontWeight: 'bold' }}>
              {formateado}
            </span>
          );
        },
      },
      {
        accessorKey: 'crecimiento',
        header: 'Crecimiento',
        size: 140,
        Cell: ({ cell }) => {
          const valor = cell.getValue();
          const formateado = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: CONFIG.crecimiento.decimales,
            maximumFractionDigits: CONFIG.crecimiento.decimales,
            style: 'percent',
          }).format(valor / 100);
          
          let color = CONFIG.colores.crecimiento.neutro;
          if (valor > 0) {
            color = CONFIG.colores.crecimiento.positivo;
          } else if (valor < 0) {
            color = CONFIG.colores.crecimiento.negativo;
          }
          
          return (
            <span style={{ color, fontWeight: 'bold' }}>
              {formateado}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

