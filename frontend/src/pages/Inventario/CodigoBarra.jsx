import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { API_URL } from '../../api';

export default function CodigoBarra() {
  const [data, setData] = useState('No se ha escaneado ningún código');
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = (err, result) => {
    if (result) {
      const codigo = result.text;
      setData(codigo);
      buscarProducto(codigo);
    } else if (err) {
      setError('Error al escanear');
    }
  };

  const buscarProducto = async (codigo) => {
    try {
      setError(null);
      setProducto(null);

      const response = await fetch(`${API_URL}/api/productos/barcode/${codigo}`);

      if (!response.ok) {
        setError('Producto no encontrado');
        return;
      }

      const data = await response.json();
      setProducto(data);
    } catch (err) {
      setError('Error en la conexión al servidor');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Escáner de Código de Barras</h2>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={handleUpdate}
      />
      <p><strong>Código escaneado:</strong> {data}</p>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {producto && (
        <div style={{ marginTop: 20, border: '1px solid black', padding: 10 }}>
          <h3>Producto encontrado:</h3>
          <p><strong>Nombre:</strong> {producto.nombre}</p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p><strong>Descripción:</strong> {producto.descripcion}</p>
          <p><strong>Precio venta:</strong> ${producto.precio_venta}</p>
          <p><strong>Stock mínimo:</strong> {producto.stock_minimo}</p>
        </div>
      )}
    </div>
  );
}
