import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
  
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);
  

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!isOnline) {
      setError('No estás conectado a Internet. Los datos se guardarán localmente.');
      insertIndexedDB({ email, nombre, password });
      return;
    }
  
    try {
      const response = await fetch('https://backend-be7l.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nombre, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        setError(data.message || 'Error al registrarte.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor. Inténtalo nuevamente.');
    }
  };

  function insertIndexedDB(data) {
    let dbRequest = window.indexedDB.open("database", 2); // Asegúrate de usar una versión específica
  
    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
  
      // Crear el object store 'Usuarios' si no existe
      if (!db.objectStoreNames.contains("Usuarios")) {
        db.createObjectStore("Usuarios", { keyPath: "email" });
        console.log("✅ 'Usuarios' object store creado.");
      } else {
        console.log("⚠️ 'Usuarios' object store ya existe.");
      }
    };
  
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
  
      // Verificar si el object store existe antes de insertar los datos
      if (db.objectStoreNames.contains("Usuarios")) {
        const transaction = db.transaction("Usuarios", "readwrite");
        const objStore = transaction.objectStore("Usuarios");
  
        const addRequest = objStore.add(data);
  
        addRequest.onsuccess = () => {
          console.log("✅ Datos insertados en IndexedDB:", addRequest.result);
  
          // Sincronizar datos si el navegador soporta Background Sync
          if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready
              .then((registration) => {
                console.log("Intentando registrar la sincronización...");
                return registration.sync.register("syncUsuarios");
              })
              .then(() => {
                console.log("✅ Sincronización registrada con éxito");
              })
              .catch((err) => {
                console.error("❌ Error registrando la sincronización:", err);
              });
          } else {
            console.warn("⚠️ Background Sync no es soportado en este navegador.");
          }
        };
  
        addRequest.onerror = () => {
          console.error("❌ Error insertando en IndexedDB");
        };
      } else {
        console.error("❌ El object store 'Usuarios' no existe.");
      }
    };
  
    dbRequest.onerror = () => {
      console.error("❌ Error abriendo IndexedDB");
    };
  }   

    return (
        <div className="wrapper">
            <div className="back-arrow" onClick={() => navigate(-1)}>
                <div className="circle">
                    <FaArrowLeft className="icon_back" />
                </div>
            </div>

            <h1>Registro</h1>
            <div className="line" />

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleRegister}>
                <div className="input-box">
                <input type="text" name="name" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    <FaUser className="icon" />
                </div>

             {/*    <div className="input-box">
                    <input type="text" name="app" placeholder="Apellido Paterno" value={formData.app} onChange={(e) => setFormData({ ...formData, app: e.target.value })} required />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input type="text" name="apm" placeholder="Apellido Materno" value={formData.apm} onChange={(e) => setFormData({ ...formData, apm: e.target.value })} required />
                    <FaUser className="icon" />
                </div> */}

                <div className="input-box">
                    <input type="email" name="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <FaEnvelope className="icon" />
                </div>

                <div className="input-box">
                <input type="password" name="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <FaLock className="icon" />
                </div>

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default Register;
