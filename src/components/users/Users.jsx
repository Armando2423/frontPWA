import React, { useEffect, useState } from "react";
import keys from "../../../keys.json"; // tengo mis keys para el web push (publicKey, privateKey)
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
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
  }, []);

   const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSendNotification = async () => {
    if (!selectedUser) return;
    setShowModal(false);
  
    try {
      const response = await fetch("https://backpwa-741q.onrender.com/auth/suscripcionMod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suscripcion: selectedUser.suscripcion,
          mensaje: JSON.stringify({
            title: "Hola desde RealDesire 😎",
            body: `Hola ${selectedUser.nombre}, tienes una nueva notificación!`,
            icon: "/icons/fire3.png",     // Ruta pública relativa a tu PWA
            image: "/icons/fire2.png"
          })
        }),
      });
  
      if (!response.ok) throw new Error("Error al enviar la notificación");
  
      alert("Notificación enviada con éxito");
    } catch (error) {
      console.error("Error al enviar notificación:", error);
      alert(error.message);
    }
  };
  
  
  return (
    <div className="page-container">
      <h2 className="page-title">Usuarios</h2>
      {isLoading ? (
        <p>⏳ Cargando usuarios...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Notificar</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="send-message-btn" onClick={() => handleOpenModal(user)}>
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

{showModal && selectedUser && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>
        ¿Deseas enviar una notificación PUSH a <a className="nameEmail">{selectedUser.email}</a>?
      </h3>
      <div className="modal-buttons">
      <button className="btn-modal" onClick={handleSendNotification}>Sí</button>
        <button className="btn-modal" onClick={() => setShowModal(false)}>No</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Users;
