import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/register/Register';
import SplashScreen from './components/splashScreen/SplashScreen'; 
import Users from './components/users/Users';

const App = () => {
  const [isSplashDone, setSplashDone] = useState(false);

  // Definir la función onLoaded
  const onLoaded = () => {
    setSplashDone(true);  // Al completar el splash, cambia el estado
  };

  useEffect(() => {
    // Simula el tiempo de carga del Splash Screen (3 segundos)
    const timer = setTimeout(() => {
      onLoaded();  // Llama a la función onLoaded después de 3 segundos
    }, 3000); // 3 segundos

    return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte
  }, []);

  return (
    <>
      {!isSplashDone ? (
        <SplashScreen onLoaded={onLoaded} /> 
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
      
        </Routes>
      )}
    </>
  );
};

export default App;
