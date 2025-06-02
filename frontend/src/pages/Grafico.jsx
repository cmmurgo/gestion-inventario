import React from "react";
import { useEffect, useState } from 'react';
import { API_URL } from '../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const GraficoMovimientos = () => {
    // Datos por mes para el año actual
const [data, setData] = useState([]);

useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetch(`${API_URL}/api/inventario/movimientos-por-mes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          const transformado = response.movimientos_por_mes.map((item) => ({
            mes_anio: item.mes_anio,
            monto_compras: Number(item.monto_compras),
            monto_ventas: Number(item.monto_ventas),
            monto_perdidas: Number(item.monto_perdidas),
          }));
          setData(transformado);
        })
        .catch((error) => console.error('Error al obtener datos:', error));
    }, []);
  
    return (
        <div style={{ width: "100%", height: 400 }}>
            <h3 style={{ textAlign: "center" }}>Movimientos por mes en $ </h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes_anio" />
                <YAxis   label={{
                                    value: "Cantidad de movimientos",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { textAnchor: "middle" }
                                    }}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="monto_compras" fill="#28a745" name="Compras" />
                <Bar dataKey="monto_ventas" fill="#dc3545" name="Ventas" />
                <Bar dataKey="monto_perdidas" fill="#007bff" name="Pérdidas" />
                </BarChart>
            </ResponsiveContainer>
      </div>
    );
  };

  
  export default GraficoMovimientos;