import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Button, ButtonGroup, Box } from '@mui/material';


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
  
const obtenerMesAleatorio = () => {
const indiceAleatorio = Math.floor(Math.random() * CONFIG.meses.length);
return CONFIG.meses[indiceAleatorio];
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
        mes: obtenerMesAleatorio(),
        inventario,
        crecimiento,
    });
    });
});
return datos;
};

export const MRT_example_basic = () => {
  const [data] = useState(() => generarDatosEjemplo());
  
  // Estado para controlar la visibilidad de columnas
  const [columnVisibility, setColumnVisibility] = useState({});
  
  // Funciones para cambiar la visibilidad de columnas
  const mostrarSoloLocales = () => {
    setColumnVisibility({
      local: true,
      producto: false,
    });
  };
  
  const mostrarSoloProductos = () => {
    setColumnVisibility({
      local: false,
      producto: true,
    });
  };
  
  const mostrarSinAgrupar = () => {
    setColumnVisibility({
      local: true,
      producto: true,
    });
  };
  
  // Calcular estado de visibilidad
  const localVisible = columnVisibility['local'] !== false;
  const productoVisible = columnVisibility['producto'] !== false;
  
  // Determinar qué vista está activa
  const vistaActiva = useMemo(() => {
    if (localVisible && productoVisible) return 'sinAgrupar';
    if (localVisible && !productoVisible) return 'soloLocales';
    if (!localVisible && productoVisible) return 'soloProductos';
    return 'sinAgrupar'; // Por defecto
  }, [localVisible, productoVisible]);
  
  // Calcular grouping basado en visibilidad
  // Si solo local está visible (producto oculto) → agrupar por local
  // Si solo producto está visible (local oculto) → agrupar por producto
  const grouping = useMemo(() => {
    // Si solo local está visible, agrupar por local
    if (localVisible && !productoVisible) {
      return ['local'];
    }
    // Si solo producto está visible, agrupar por producto
    if (!localVisible && productoVisible) {
      return ['producto'];
    }
    // Si ambos están visibles u ocultos, no agrupar
    return [];
  }, [localVisible, productoVisible]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'local',
        header: 'Local',
        size: 180,
        enableColumnFilter: true,
        enableGrouping: true,
      },
      {
        accessorKey: 'producto',
        header: 'Producto',
        size: 150,
        enableColumnFilter: true,
        enableGrouping: true,
      },
      {
        accessorKey: 'venta',
        header: 'Venta',
        size: 130,
        aggregationFn: 'sum', // Sumar valores al agrupar
        AggregatedCell: ({ cell }) => {
          const valor = cell.getValue();
          const formateado = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: CONFIG.venta.decimales,
            maximumFractionDigits: CONFIG.venta.decimales,
          }).format(valor);
          
          return (
            <span style={{ fontWeight: 'bold', color: '#10b981' }}>
              Total: ${formateado}
            </span>
          );
        },
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
        header: 'Mes',
        size: 140,
      },
      {
        accessorKey: 'inventario',
        header: 'Inventario',
        size: 130,
        aggregationFn: 'sum', // Sumar valores al agrupar
        AggregatedCell: ({ cell }) => {
          const valor = cell.getValue();
          const formateado = new Intl.NumberFormat('es-ES').format(valor);
          
          return (
            <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>
              Total: {formateado}
            </span>
          );
        },
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
        aggregationFn: 'mean', // Promedio para crecimiento (más lógico que suma)
        AggregatedCell: ({ cell }) => {
          const valor = cell.getValue();
          const formateado = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: CONFIG.crecimiento.decimales,
            maximumFractionDigits: CONFIG.crecimiento.decimales,
            style: 'percent',
          }).format(valor / 100);
          
          return (
            <span style={{ fontWeight: 'bold', color: '#6b7280' }}>
              Promedio: {formateado}
            </span>
          );
        },
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
    enableGrouping: true,
    enableAggregationRow: true, // Habilitar filas de agregación
    enableColumnVisibility: true,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
      grouping,
    },
    initialState: {
      expanded: true, // Expandir grupos por defecto
    },
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
  });

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
        <ButtonGroup variant="outlined" aria-label="botones de vista">
          <Button 
            onClick={mostrarSinAgrupar}
            variant={vistaActiva === 'sinAgrupar' ? 'contained' : 'outlined'}
          >
            Sin Agrupar
          </Button>
          <Button 
            onClick={mostrarSoloLocales}
            variant={vistaActiva === 'soloLocales' ? 'contained' : 'outlined'}
          >
            Solo Locales
          </Button>
          <Button 
            onClick={mostrarSoloProductos}
            variant={vistaActiva === 'soloProductos' ? 'contained' : 'outlined'}
          >
            Solo Productos
          </Button>
        </ButtonGroup>
      </Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

