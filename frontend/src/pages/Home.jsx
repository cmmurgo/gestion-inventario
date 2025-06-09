import React from 'react';
import ventasImg from '../assets/total_ventas.png';
import comprasImg from '../assets/total_compras.png';
import perdidasImg from '../assets/total_perdidas.png';
import ingresosImg from '../assets/total_ingresos.png';
import gastosImg from '../assets/total_gastos.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL } from '../api';
import axios from 'axios';
import Grafico from './Grafico.jsx';

function Home() {

  const [totalVentas, setTotalVentas] = useState([]);
  const [totalPerdidas, setTotalPerdidas] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState([]);
  const [totalCompras, setTotalCompras] = useState([]);
  const [totalGastos, setTotalGastos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const cargarDatos = async () => {
      try {
        const [resVenta, resPerdidas, resIngresos, resCompra, resGastos] = await Promise.all([
          axios.get(`${API_URL}/api/inventario/totales/ventas`, { headers: { Authorization: `Bearer ${token}` } }),      
          axios.get(`${API_URL}/api/inventario/totales/perdidas`, { headers: { Authorization: `Bearer ${token}` } }),  
          axios.get(`${API_URL}/api/inventario/totales/ingresos`, { headers: { Authorization: `Bearer ${token}` } }), 
          axios.get(`${API_URL}/api/inventario/totales/compras`, { headers: { Authorization: `Bearer ${token}` } }), 
          axios.get(`${API_URL}/api/inventario/totales/gastos`, { headers: { Authorization: `Bearer ${token}` } }) 
        ]);    
        
        setTotalVentas(resVenta.data.total_ventas);  
        setTotalPerdidas(resPerdidas.data.total_perdidas); 
        setTotalIngresos(resIngresos.data.total_ingresos); 
        setTotalCompras(resCompra.data.total_compras);  
        setTotalGastos(resGastos.data.total_gastos); 
      
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
    { icon: gastosImg, value: '$' + (totalGastos ?? 0), label: 'Total Gastos' },
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

        <Grafico />
      
      </div>
    </div>
  );
}

export default Home;
