import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="card shadow p-4">
            <h2 className="mb-4">Bienvenido</h2>
  
            {userRole === 'admin' && (
              <button
                onClick={() => navigate('/register')}
                className="btn btn-success mb-3 w-100"
              >
                Registrar nuevo usuario
              </button>
            )}
  
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
