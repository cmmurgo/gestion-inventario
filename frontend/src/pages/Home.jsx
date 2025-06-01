import React from 'react';
import ventasImg from '../assets/total_ventas.png';
import comprasImg from '../assets/total_compras.png';
import perdidasImg from '../assets/total_perdidas.png';
import ingresosImg from '../assets/total_ingresos.png';
import gastosImg from '../assets/total_gastos.png';
import inventarioImg from '../assets/codigo_barras.png';
import graficoImg from '../assets/grafico.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL } from '../api';
import axios from 'axios';

function Home() {

  const [totalVentas, setTotalVentas] = useState([]);
  const [totalPerdidas, setTotalPerdidas] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState([]);
  const [totalCompras, setTotalCompras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const cargarDatos = async () => {
      try {
        const [resVenta, resPerdidas, resIngresos, resCompra] = await Promise.all([
          axios.get(`${API_URL}/api/inventario/totales/ventas`, { headers: { Authorization: `Bearer ${token}` } }),      
          axios.get(`${API_URL}/api/inventario/totales/perdidas`, { headers: { Authorization: `Bearer ${token}` } }),  
          axios.get(`${API_URL}/api/inventario/totales/ingresos`, { headers: { Authorization: `Bearer ${token}` } }), 
          axios.get(`${API_URL}/api/inventario/totales/compras`, { headers: { Authorization: `Bearer ${token}` } }) 
        ]);    
        
        setTotalVentas(resVenta.data.total_ventas);  
        setTotalPerdidas(resPerdidas.data.total_perdidas); 
        setTotalIngresos(resIngresos.data.total_ingresos); 
        setTotalCompras(resCompra.data.total_compras);  
      
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos de la venta.');
      }
    };

    cargarDatos();
  }, []);

  const handleCodigoBarra = () => {
    navigate('/inventario/codigo-barra');
  };

  const nombreMes = new Date().toLocaleString('es-AR', { month: 'long' }).toUpperCase();

  const data = [
    { icon: ventasImg, value: totalVentas, label: 'Total Cantidad de Ventas' },
    { icon: comprasImg, value: totalCompras, label: 'Total Cantidad de Compras' },
    { icon: perdidasImg, value: totalPerdidas, label: 'Total Cantidad de Pérdidas' },
    { icon: ingresosImg, value: '$' + (totalIngresos ?? 0), label: 'Ingresos Netos x Ventas' },
    { icon: gastosImg, value: 12, label: 'Total Gastos $' },
    { icon: inventarioImg, value: '', label: 'Escanear Cído de Barras', hideValue: true, isButton: true },
  ];

  return (    
    <div className="container-md py-4">
      <h4 className="text-center fw-bold mb-4">DATOS DEL MES DE {nombreMes}</h4>
      <div className="row g-4 mb-4">
        {data.map((item, index) => (
          <div className="col-4" key={index}>
            {item.isButton ? (
              <button
                className="d-flex align-items-center bg-white shadow rounded-4 p-3 w-100 border-0 text-start"
                style={{ cursor: 'pointer' }}
                onClick={handleCodigoBarra}            
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
        <h5 className="mb-3">Movimientos por mes</h5>
        <img
          src={graficoImg}
          alt="Gráfico de ventas"
          className="img-fluid shadow rounded-4"
        />
      </div>
    </div>
  );
}

export default Home;
