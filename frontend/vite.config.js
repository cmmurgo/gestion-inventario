import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables desde .env o .env.production, etc.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      'process.env': env,
    },
    build: {
      outDir: 'build', // <- Esto hace que Vite genere la carpeta 'build'
    },
  };
});





// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig(({ mode }) => {
//   // Cargar variables desde .env o .env.production, etc.
//   const env = loadEnv(mode, process.cwd());

//   return {
//     plugins: [react()],
//     define: {
//       'process.env': env,
//     },
//   };
// });




// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })





