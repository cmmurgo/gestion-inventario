import { Link } from "react-router-dom";

export default function MenuInventario() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold mb-4">Menú de Análisis</h1>

      {/* Grid para dos columnas en pantallas medianas y grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">

      <br></br>
        <Link to="/stock-producto" className="w-full">
        <button className="btn btn-secondary w-full flex items-center gap-3 py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          📦
          <span className="text-base font-medium">
            Ver reporte de stock de productos
          </span>
        </button>
      </Link>
      <br></br>      <br></br>
        <Link to="/stock-bajo" className="w-full">
          <button className="btn btn-danger w-full flex items-center gap-3 py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            🛑
            <span className="text-base font-medium">Detectar Stock Bajo</span>
          </button>
        </Link>
        <br></br><br></br>
 
        <Link to="/tasa-rotacion" className="w-full">
          <button className="btn btn-info w-full flex items-center gap-3 py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            📊
            <span className="text-base font-medium">Medir Rotación de Producto</span>
          </button>
        </Link>
        <br></br><br></br>

        <Link to="/productos-mayor-ingreso" className="w-full">
          <button className="btn btn-success w-full flex items-center gap-3 py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            💰
            <span className="text-base font-medium">Productos que generan mayores ingresos</span>
          </button>
        </Link>
        <br></br><br></br>

        <Link to="/productos-menos-vendidos" className="w-full">
          <button className="btn btn-warning w-full flex items-center gap-3 py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            📉
            <span className="text-base font-medium">Productos menos vendidos que requieren estrategias promocionales</span>
          </button>
        </Link>

      </div>
    </div>
  );
}