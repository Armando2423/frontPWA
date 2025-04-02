import React, { useEffect, useState } from "react";
import keys from "../../../keys.json";
import { useNavigate } from "react-router-dom";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userRol = localStorage.getItem("userRol");

  useEffect(() => {
    if (userRol === "admin") {
      fetch("https://backpwa-741q.onrender.com/auth/users")
        .then((response) => {
          if (!response.ok) throw new Error("Error al obtener los usuarios");
          return response.json();
        })
        .then((data) => {
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

  const handleSendMessage = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmSendNotification = async () => {
    if (!selectedUser || !selectedUser.suscripcion) {
      alert("El usuario no tiene una suscripción válida.");
      return;
    }

    try {
      const response = await fetch("https://backpwa-741q.onrender.com/auth/suscripcionMod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suscripcion: selectedUser.suscripcion,
          mensaje: `Gracias ${selectedUser.name} por usar mi PWA!!`,
        }),
      });

      if (!response.ok) throw new Error("Error al enviar el mensaje");

      console.log("Mensaje enviado");
      alert("Notificación enviada con éxito");
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
      alert(error.message);
    }

    setShowModal(false);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Hi!</h2>
      {userRol === "admin" ? (
        <div>
          <h2 style={{ color: "white" }}>📋 Usuarios Suscritos</h2>
          {isLoading ? (
            <p>⏳ Cargando usuarios...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Enviar Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.email || index}>
                      <td className="td-td">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button className="send-message-btn" onClick={() => handleSendMessage(user)}>
                          Enviar Notificación
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
        <p className="this-is-p">Thanks!! for using my PWA</p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <p>¿Deseas enviarle una notificación push a {selectedUser?.email}?</p>
            <button onClick={confirmSendNotification}>Sí, enviar</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
