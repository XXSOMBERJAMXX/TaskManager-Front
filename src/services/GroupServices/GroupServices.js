import { httpRequest } from "../httpInterceptor"; // Importar el interceptor

// Obtener todos los grupos
export const fetchGroups = async () => {
  return httpRequest("/groups", "GET");
};

// Crear o actualizar un grupo
export const addOrUpdateGroup = async (group) => {
  const endpoint = group._id ? `/groups/${group._id}` : "/groups";
  const method = group._id ? "PUT" : "POST";
  return httpRequest(endpoint, method, group);
};

// Eliminar un grupo
export const deleteGroup = async (groupId) => {
  return httpRequest(`/groups/${groupId}`, "DELETE");
};

// Obtener tareas asociadas a un grupo
export const fetchTasksByGroup = async (groupId) => {
  return httpRequest(`/groups/${groupId}/tasks`, "GET");
};

// Obtener todos los roles
export const fetchRoles = async () => {
  return httpRequest("/roles", "GET");
};

// Buscar un usuario por su username
export const findUserByUsername = async (username) => {
  return httpRequest(`/users?username=${username}`, "GET");
};

// Añadir un miembro a un grupo
export const addMemberToGroup = async (groupId, userId, roleId) => {
  return httpRequest(`/groups/${groupId}/add-member`, "POST", { userId, roleId });
};

// Eliminar un miembro de un grupo
export const removeMemberFromGroup = async (groupId, userId) => {
  return httpRequest(`/groups/${groupId}/remove-member/${userId}`, "DELETE");
};

export const fetchGroupMembers = async (groupId) => {
  return httpRequest(`/groups/${groupId}/members`, "GET");
};