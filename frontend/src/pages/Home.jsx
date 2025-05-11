import React from 'react';
import ventasImg from '../assets/total_ventas.png';
import comprasImg from '../assets/total_compras.png';
import perdidasImg from '../assets/total_perdidas.png';
import ingresosImg from '../assets/total_ingresos.png';
import gastosImg from '../assets/total_gastos.png';
import inventarioImg from '../assets/codigo_barras.png';
import graficoImg from '../assets/grafico.png';

const data = [
  { icon: ventasImg, value: 5, label: 'Total Ventas' },
  { icon: comprasImg, value: 20, label: 'Total Compras' },
  { icon: perdidasImg, value: 2, label: 'Total Pérdidas' },
  { icon: ingresosImg, value: 15, label: 'Total Ingresos $' },
  { icon: gastosImg, value: 12, label: 'Total Gastos $' },
  { icon: inventarioImg, value: '', label: 'Inventario', hideValue: true, isButton: true },
];

export default function Home() {
  return (
    <div className="container-md py-4">
      <div className="row g-4 mb-4">
        {data.map((item, index) => (
          <div className="col-4" key={index}>
            {item.isButton ? (
              <button
                className="d-flex align-items-center bg-white shadow rounded-4 p-3 w-100 border-0 text-start"
                style={{ cursor: 'pointer' }}
                onClick={() => console.log('Ir a Inventario')}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{ width: '60px', height: '60px', marginRight: '15px' }}
                />
                <div>
                  {!item.hideValue && (
                    <div className="fs-4 fw-bold text-dark">{item.value}</div>
                  )}
                  <div className="text-muted">{item.label}</div>
                </div>
              </button>
            ) : (
              <div className="d-flex align-items-center bg-white shadow rounded-4 p-3 w-100">
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{ width: '60px', height: '60px', marginRight: '15px' }}
                />
                <div>
                  {!item.hideValue && (
                    <div className="fs-4 fw-bold text-dark">{item.value}</div>
                  )}
                  <div className="text-muted">{item.label}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <h5 className="mb-3">Cantidad de ventas por mes</h5>
        <img
          src={graficoImg}
          alt="Gráfico de ventas"
          className="img-fluid shadow rounded-4"
        />
      </div>
    </div>
  );
}
