// GroupModal.js

import React, { useState } from "react";
import {
  findUserByUsername,
  addMemberToGroup,
  removeMemberFromGroup,
} from "../services/GroupServices/GroupServices"; // Importar servicios

export default function GroupModal({ onClose, onSave, group = null, roles }) {
  const [name, setName] = useState(group ? group.name : "");
  const [description, setDescription] = useState(group ? group.description : "");
  const [members, setMembers] = useState(group ? group.members : []);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [newMemberRole, setNewMemberRole] = useState(roles[0]?._id || "");
  const [error, setError] = useState("");

  // Función para agregar un nuevo miembro
  const handleAddMember = async () => {
    if (!newMemberUsername || !newMemberRole) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Buscar el usuario por su username
      const userData = await findUserByUsername(newMemberUsername);
      if (!userData.success || !userData.user) {
        setError("Usuario no encontrado");
        return;
      }

      const user = userData.user;

      // Verificar si el usuario ya es miembro del grupo
      const isAlreadyMember = members.some((member) => member.user?._id === user._id);
      if (isAlreadyMember) {
        setError("Este usuario ya es miembro del grupo.");
        return;
      }

      // Añadir el miembro al grupo
      const addMemberData = await addMemberToGroup(group._id, user._id, newMemberRole);
      if (addMemberData.success) {
        setMembers([...members, { user: { _id: user._id, username: user.username }, role: newMemberRole }]);
        setNewMemberUsername("");
        setNewMemberRole(roles[0]?._id || "");
        setError("");
      } else {
        setError(addMemberData.message || "Error al añadir miembro");
      }
    } catch (error) {
      console.error("Error al añadir miembro:", error);
      setError("Error al añadir miembro");
    }
  };

  // Función para eliminar un miembro
  const handleRemoveMember = async (index) => {
    const memberToRemove = members[index];
    if (!memberToRemove || !group) return;

    try {
      const removeMemberData = await removeMemberFromGroup(group._id, memberToRemove.user._id);
      if (removeMemberData.success) {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
      } else {
        setError(removeMemberData.message || "Error al eliminar miembro");
      }
    } catch (error) {
      console.error("Error al eliminar miembro:", error);
      setError("Error al eliminar miembro");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ _id: group?._id, name, description, members });
    onClose();
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900/70">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-120">
        <h2 className="text-2xl font-bold mb-4">{group ? "Editar Grupo" : "Nuevo Grupo"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="font-semibold">Nombre del grupo:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del grupo"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="font-semibold">Descripción:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del grupo"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {group && (
            <div>            
              {/* Sección para agregar miembros */}
              <div>
                <label htmlFor="newMemberUsername" className="font-semibold">Agregar miembro:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="newMemberUsername"
                    value={newMemberUsername}
                    onChange={(e) => setNewMemberUsername(e.target.value)}
                    placeholder="Usuario del miembro"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    Agregar
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              {/* Lista de miembros */}
          
              <div>
                <label className="font-semibold">Miembros:</label>
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div key={index} className="flex justify-between items-center w-full">
                      <span className="w-1/3">{member.user?.username}</span>
                      <span className="text-sm text-gray-600 w-1/3">
                        {member.role?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="text-red-500 hover:text-red-700 w-1/3"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              {group ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}