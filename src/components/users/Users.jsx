import React, { useEffect, useState } from "react";
import keys from "../../../keys.json"; // Importa las llaves VAPID
import { useNavigate } from "react-router-dom";
import "./Users.css"; // Importamos el archivo CSS


function Users() {
 /*  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userRol = localStorage.getItem("userRol");

  // username
  const userName = localStorage.getItem('userName');


  useEffect(() => {
    if (userRol === "admin") {
      fetch("https://backpwa-741q.onrender.com/auth/users")
        .then((response) => {
          if (!response.ok) throw new Error("Error al obtener los usuarios");
          return response.json();
        })
        .then((data) => {
          console.log("Usuarios obtenidos:", data);
          const usersWithSubscription = data.filter(
            (user) => user.suscripcion !== null && user.suscripcion !== undefined
          );
          setUsers(usersWithSubscription);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar los usuarios:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [userRol]);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", { type: "module" });
      registration.update();
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        console.log("✅ El usuario ya está suscrito:", existingSubscription);
        return;
      }
  
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("❌ Permiso de notificaciones denegado");
        return;
      }
  
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keys.publicKey,
      });
  
      console.log("✅ Nueva suscripción creada:", subscription);
  
      if (!userId) return;
  
      const response = await fetch("https://backpwa-741q.onrender.com/auth/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, suscripcion: subscription.toJSON() }),
      });
  
      if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
      console.log("✅ Suscripción guardada en la base de datos:", await response.json());
    } catch (error) {
      console.error("❌ Error en el registro del Service Worker:", error);
    }
  };
  

  useEffect(() => {
    registerServiceWorker();
  }, []);

  const handleSendNotification = async (user) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
          new Notification("¡Notificación activada!");
      } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                  new Notification("¡Notificaciones permitidas!");
              } else {
                  alert("Las notificaciones están bloqueadas. Habilítalas en la configuración del navegador.");
              }
          });
      } else {
          alert("Las notificaciones están bloqueadas en la configuración del navegador.");
      }
  } else {
      alert("Tu navegador no soporta notificaciones.");
  }
  
  
    if (!user.suscripcion || !user.suscripcion.endpoint) {
      alert("El usuario no tiene suscripción de notificación.");
      return;
    }
  
    try {
      const message = prompt(`Escribe un mensaje para ${user.email}:`);
      if (!message || !message.trim()) {
        alert("El mensaje no puede estar vacío.");
        return;
      }
  
      const response = await fetch("https://backendpwa001.onrender.com/send_subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          title: `Notificación para ${user.nombre}`,
          body: message,
          subscription: user.suscripcion,
        }),
      });
  
      if (!response.ok) throw new Error("Error al enviar la notificación");
  
      alert("Notificación enviada con éxito");
    } catch (error) {
      console.error("❌ Error al enviar notificación:", error);
      alert(error.message);
    }
  }; */

  // username
  const userName = localStorage.getItem('userName');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userRol = localStorage.getItem("userRol");

  useEffect(() => {
    // https://backpwa-741q.onrender.com
    if (userRol === "admin") {
      fetch("https://backpwa-741q.onrender.com/auth/users")
        .then((response) => {
          if (!response.ok) throw new Error("Error al obtener los usuarios");
          console.log(users.map(user => user.nombre));
          return response.json();
        })
        .then((data) => {
          console.log("Usuarios obtenidos:", data);
          const usersWithSubscription = data.filter(
            (user) => user.suscripcion !== null && user.suscripcion !== undefined
          );
          setUsers(usersWithSubscription);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar los usuarios:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [userRol]);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        type: "module",
      });
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keys.publicKey,
      });

      if (!userId) return;

      const response = await fetch("https://backpwa-741q.onrender.com/auth/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, suscripcion: subscription.toJSON() }),
      });

      if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
      console.log("Suscripción guardada en la base de datos:", await response.json());
    } catch (error) {
      console.error("Error en el registro del Service Worker:", error);
    }
  };

  useEffect(() => {
    registerServiceWorker();
  }, []);

  const handleSendMessage = async (user) => {
    try {
      const message = prompt(`Escribe un mensaje para ${user.email}:`);
      if (!message || !message.trim()) {
        alert("El mensaje no puede estar vacío.");
        return;
      }
  
      
      if (!user.suscripcion) {
        throw new Error(`El usuario ${user.email} no tiene una suscripción válida.`);
      }
  
      console.log("Enviando a suscripción:", user.suscripcion);
  
      const response = await fetch("https://backpwa-741q.onrender.com/auth/suscripcionMod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suscripcion: user.suscripcion,
          mensaje: message, // Asegurar que se envía correctamente
        }),
      });
  
      if (!response.ok) throw new Error("Error al enviar el mensaje");
  
      const data = await response.json();
      console.log("Mensaje enviado:", data);
      alert("Mensaje enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert(error.message);
    }
  };
  
  
  return (
    <div className="page-container">
      <h2 className="page-title">Bienvenid@</h2>
      {userRol === "admin" ? (
        <div>
          <h2 style={{textAlign: 'center', color: 'white'}}>Usuarios</h2>
          {isLoading ? (
            <p>⏳ Cargando usuarios...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>📩 Email</th>
                  <th>✉️ Enviar notificación</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id || index}>
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>
                        <button className="send-message-btn" onClick={() => handleSendMessage(user)}>
                          Notificar 
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">📭 No hay usuarios suscritos</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <p>Bienvenid@ {userName}</p>
      )}
    </div>
  );
}

export default Users;