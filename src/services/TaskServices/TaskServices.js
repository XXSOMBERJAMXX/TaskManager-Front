import { httpRequest } from "../httpInterceptor"; 

// Obtener todas las tareas
export const fetchTasks = async (groupId = null) => {
  const endpoint = "/tasks";
  const headers = groupId ? { groupId } : {};
  return httpRequest(endpoint, "GET", null, headers);
};

// Crear o actualizar una tarea
export const addOrUpdateTask = async (task) => {
  const endpoint = task._id ? `/tasks/${task._id}` : "/tasks";
  const method = task._id ? "PUT" : "POST";
  return httpRequest(endpoint, method, task);
};

// Eliminar una tarea
export const deleteTask = async (taskId) => {
  return httpRequest(`/tasks/${taskId}`, "DELETE");
};