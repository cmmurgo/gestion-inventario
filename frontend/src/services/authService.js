// Para agrupar funciones comunes
export const getToken = () => localStorage.getItem('token');
export const getUserRole = () => localStorage.getItem('userRole');

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};
