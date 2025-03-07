// DashboardPage.js

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import TaskList from "../../components/TaskList";
import TaskModal from "../../components/TaskModal";
import GroupList from "../../components/GroupList";
import GroupModal from "../../components/GroupModal";
import { fetchGroups, addOrUpdateGroup, deleteGroup, fetchTasksByGroup, fetchRoles } from "../../services/GroupServices/GroupServices"; // Importar servicios de grupos
import { fetchTasks, addOrUpdateTask, deleteTask } from "../../services/TaskServices/TaskServices"; // Importar servicios de tareas

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;
  const [groups, setGroups] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [roles, setRoles] = useState([]);

  // Obtener tareas
  const fetchTasksData = async (groupId = null) => {
    try {
      const data = await fetchTasks(groupId);
      if (data.success) setTasks(data.tasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  // Obtener grupos
  const fetchGroupsData = async () => {
    try {
      const data = await fetchGroups();
      if (data.success) setGroups(data.groups);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
    }
  };

  // Obtener roles
  const fetchRolesData = async () => {
    try {
      const data = await fetchRoles();
      if (data.success) setRoles(data.roles);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  // Seleccionar grupo
  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    fetchTasksData(groupId);
  };

  // Recargar tareas
  const reloadTasks = () => {
    fetchTasksData(selectedGroup);
  };

  useEffect(() => {
    fetchRolesData();
    fetchTasksData(selectedGroup);
    fetchGroupsData();
  }, []);

  // Calcular porcentaje de tareas completadas
  const calculateCompletionPercentage = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.status === "Completado").length;
    return ((completedTasks / tasks.length) * 100).toFixed(2);
  };

  // Abrir modal de tarea
  const openModal = (task = null) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Guardar o actualizar tarea
  const handleAddOrUpdateTask = async (task) => {
    try {
      const data = await addOrUpdateTask(task);
      if (data.success) {
        fetchTasksData(selectedGroup);
      }else{
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al guardar tarea:", error);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (id) => {
    try {
      const data = await deleteTask(id);
      if (data.success){
        fetchTasksData(selectedGroup);
      }else{
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Guardar o actualizar grupo
  const handleAddOrUpdateGroup = async (group) => {
    try {
      const data = await addOrUpdateGroup(group);
      if (data.success){
        fetchGroupsData();
      }else{
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al guardar grupo:", error);
    }
  };

  // Eliminar grupo
  const handleDeleteGroup = async (groupId) => {
    try {
      const tasksData = await fetchTasksByGroup(groupId);
      if (tasksData.tasks.length > 0) {
        alert("No se puede eliminar el grupo porque tiene tareas asociadas.");
        return;
      }

      const deleteData = await deleteGroup(groupId);
      if (deleteData.success){ 
        fetchGroupsData();
      }else{
        alert(deleteData.message);
      }
    } catch (error) {
      console.error("Error al eliminar grupo:", error);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 w-full h-full min-h-fit animate-fade-in">
      <Header reload={reloadTasks} completionPercentage={calculateCompletionPercentage()} />

      {/* Lista de grupos */}
      <GroupList
        groups={groups}
        handleGroupSelect={handleGroupSelect}
        onEditGroup={(group) => {
          setSelectedGroup(group);
          setIsGroupModalOpen(true);
        }}
        onDeleteGroup={handleDeleteGroup}
      />

      {/* Lista de tareas */}
      <TaskList tasks={tasks} onEdit={openModal} onDelete={handleDeleteTask} />

      {/* Botones para agregar tareas y grupos */}
      <button
        className="fixed bottom-10 right-12 bg-green-600 hover:bg-green-800 text-white rounded-full p-4 shadow-lg transition-all w-12 h-12 flex items-center justify-center"
        onClick={() => {setIsTaskModalOpen(true);}}
      >
        +
      </button>
      <button
        className="fixed bottom-10 right-32 bg-yellow-500 hover:bg-yellow-700 text-white rounded-full p-4 shadow-lg transition-all w-12 h-12 flex items-center justify-center"
        onClick={() => setIsGroupModalOpen(true)}
      >
        👥
      </button>

      {/* Modales */}
      {isTaskModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() =>{ setIsTaskModalOpen(false);  setSelectedTask(null); }}
          onSave={handleAddOrUpdateTask}
          groups={groups}
        />
      )}
      {isGroupModalOpen && (
        <GroupModal
          onClose={() => {setIsGroupModalOpen(false); setSelectedGroup(null);}}
          onSave={handleAddOrUpdateGroup}
          group={selectedGroup}
          roles={roles}
        />
      )}
    </div>
  );
}